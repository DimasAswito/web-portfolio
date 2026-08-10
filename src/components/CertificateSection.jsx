import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { FaCalendarAlt, FaExternalLinkAlt, FaImage, FaFilePdf, FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import useInView from '../hooks/useInView';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;


const CertificateDisplay = ({ imageUrl, altText, variant = 'thumbnail' }) => {
  const isModal = variant === 'modal';

  if (!imageUrl) {
    return (
      <div className="w-full h-full bg-slate-700 flex items-center justify-center">
        <FaImage className="text-5xl text-slate-500" />
      </div>
    );
  }

  const isPdf = imageUrl.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    return (
      <div className={isModal ? 'flex items-center justify-center' : 'w-full h-full bg-slate-500 flex items-center justify-center'}>
        <Document
          file={imageUrl}
          loading={<div className="text-white text-sm">Memuat PDF...</div>}
          error={
            <div className="text-center text-white p-2 text-xs">
              <FaFilePdf className="mx-auto mb-1 text-2xl"/>
              Gagal memuat preview PDF.
            </div>
          }
        >
          <Page pageNumber={1} width={isModal ? 640 : 400} />
        </Document>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={altText}
      className={isModal ? 'max-w-full max-h-[70vh] w-auto h-auto object-contain mx-auto' : 'w-full h-full object-cover'}
    />
  );
};

export default function CertificateSection() {
  const { t } = useTranslation();
  const [ref, isVisible] = useInView();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeIndex, setActiveIndex] = useState(null);

  const formatDisplayDate = (dateString) => {
    if (!dateString || dateString === 'Present') return dateString;
    try {
        if (!/^\d{4}-\d{2}$/.test(dateString)) return dateString;
        const [year, month] = dateString.split('-');
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    } catch (e) { return dateString; }
  };

  useEffect(() => {
    async function fetchCertificates() {
      setLoading(true);
      const { data, error } = await supabase
        .from('certificate')
        .select('*')
        .order('get_month', { ascending: false });

      if (!error && data) {
        setCertificates(data);
      } else {
        console.error('Failed to fetch certificate data:', error);
      }
      setLoading(false);
    }
    fetchCertificates();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 3);
  };

  const closeModal = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setActiveIndex(prev => (prev === null ? prev : (prev - 1 + certificates.length) % certificates.length));
  }, [certificates.length]);
  const showNext = useCallback(() => {
    setActiveIndex(prev => (prev === null ? prev : (prev + 1) % certificates.length));
  }, [certificates.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, closeModal, showPrev, showNext]);

  const activeCert = activeIndex !== null ? certificates[activeIndex] : null;

  return (
    <section
      id="certificates"
      ref={ref}
      className={`py-20 bg-slate-300 dark:bg-dark ${isVisible ? 'reveal-visible' : 'reveal-left'}`}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">{t('certificates.title')}</h2>
        
        {loading ? (
          <p className="text-center text-slate-500 dark:text-gray-400">Loading certificates...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.slice(0, visibleCount).map((cert, index) => (
                <div key={cert.id} className="bg-white dark:bg-darker rounded-xl shadow-md dark:shadow-lg card-hover flex flex-col overflow-hidden border border-gray-200 dark:border-transparent">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="relative aspect-w-16 aspect-h-9 w-full group block text-left cursor-pointer"
                    aria-label={t('certificates.viewLarger')}
                  >
                    <CertificateDisplay imageUrl={cert.img} altText={cert.certificate_name} />
                    <span className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <FaExpand className="text-white text-2xl" />
                    </span>
                  </button>
                  <div className="p-6 flex flex-col flex-grow">
                    {Array.isArray(cert.tag) && cert.tag.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {cert.tag.map((t, index) => (
                          <span key={index} className="text-xs bg-sky-100 dark:bg-sky-600/80 text-sky-800 dark:text-sky-100 px-2 py-1 rounded-full font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-primary mb-2 flex-grow">
                      {cert.certificate_name}
                    </h3>
                    <div className="flex items-center text-sm text-slate-500 dark:text-gray-400 mb-6">
                      <FaCalendarAlt className="mr-2" />
                      <span>{t('certificates.obtainedOn')} {formatDisplayDate(cert.get_month)}</span>
                    </div>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-block text-center w-full px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg font-semibold hover:bg-primary hover:text-white dark:hover:text-dark transition-colors duration-300"
                      >
                        {t('certificates.viewCredential')} <FaExternalLinkAlt className="inline ml-2" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < certificates.length && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  // will change the button hove
                  className="px-8 py-3 bg-primary/10 dark:bg-primary/20 text-primary font-semibold rounded-lg transition-all duration-300 hover:bg-primary hover:text-white dark:hover:text-dark hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1"
                >
                  {t('certificates.loadMore')}
                </button>
              </div>
            )}
          </>
        )}

        {activeCert && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50"
            onClick={closeModal}
          >
            {certificates.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-colors z-10"
                aria-label={t('certificates.prev')}
              >
                <FaChevronLeft size={20} />
              </button>
            )}

            <div
              className="relative bg-white dark:bg-darker rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 z-10"
                aria-label={t('certificates.close')}
              >
                <FaTimes size={22} />
              </button>

              <div className="flex items-center justify-center min-h-[200px]">
                <CertificateDisplay imageUrl={activeCert.img} altText={activeCert.certificate_name} variant="modal" />
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-primary mb-1">{activeCert.certificate_name}</h3>
                <p className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                  <FaCalendarAlt /> {t('certificates.obtainedOn')} {formatDisplayDate(activeCert.get_month)}
                </p>
                {activeCert.link && (
                  <a
                    href={activeCert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg font-semibold hover:bg-primary hover:text-white dark:hover:text-dark transition-colors duration-300"
                  >
                    {t('certificates.viewCredential')} <FaExternalLinkAlt className="inline ml-2" />
                  </a>
                )}
                {certificates.length > 1 && (
                  <p className="mt-4 text-xs text-slate-400 dark:text-gray-600">{activeIndex + 1} / {certificates.length}</p>
                )}
              </div>
            </div>

            {certificates.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showNext(); }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-colors z-10"
                aria-label={t('certificates.next')}
              >
                <FaChevronRight size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
