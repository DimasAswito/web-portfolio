import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { FaCalendarAlt, FaExternalLinkAlt, FaImage, FaFilePdf } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;


const CertificateDisplay = ({ imageUrl, altText }) => {
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
      <div className="w-full h-full bg-slate-500 flex items-center justify-center">
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
          <Page pageNumber={1} width={400} /> 
        </Document>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={altText}
      className="w-full h-full object-cover"
    />
  );
};

export default function CertificateSection() {
  const { t } = useTranslation();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);

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

  return (
    <section id="certificates" className="py-20 bg-slate-300 dark:bg-dark">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">{t('certificates.title')}</h2>
        
        {loading ? (
          <p className="text-center text-slate-500 dark:text-gray-400">Loading certificates...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.slice(0, visibleCount).map((cert) => (
                <div key={cert.id} className="bg-white dark:bg-darker rounded-xl shadow-md dark:shadow-lg card-hover flex flex-col overflow-hidden border border-gray-200 dark:border-transparent">
                  <div className="aspect-w-16 aspect-h-9 w-full">
                    <CertificateDisplay imageUrl={cert.img} altText={cert.certificate_name} />
                  </div>
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
                  className="px-8 py-3 bg-primary/10 dark:bg-primary/20 text-primary font-semibold rounded-lg transition-all duration-300 hover:bg-primary hover:text-white dark:hover:text-dark hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1"
                >
                  {t('certificates.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
