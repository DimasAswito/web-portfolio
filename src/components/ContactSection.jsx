import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FaCopy, FaCheck } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import useInView from '../hooks/useInView';

export default function ContactSection() {
  // Hook `useTranslation` sudah ada, ini sudah benar
  const { t } = useTranslation();
  const [ref, isVisible] = useInView();

  const [contact, setContact] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      const { data, error } = await supabase.from('contact').select('*').single();
      if (error) {
        console.error('Error fetching contact:', error);
      } else {
        setContact(data);
      }
    };
    fetchContact();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCopy = async (text, field) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(prev => (prev === field ? null : prev)), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    if (!name || !email || !message) {
      setFormStatus({ type: 'error', message: t('qna.validation_message') });
      return;
    }

    setSubmitting(true);
    setFormStatus({ type: '', message: '' });
    const { error } = await supabase.from('qna').insert([{ name, email, message }]);
    setSubmitting(false);

    if (error) {
      console.error('Error submitting message:', error.message);
      setFormStatus({ type: 'error', message: t('qna.error_message') });
    } else {
      setFormStatus({ type: 'success', message: t('qna.success_message') });
      setFormData({ name: '', email: '', message: '' });
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#0ea5e9', '#3b82f6', '#6366f1'],
      });
    }
  };

 return (
    <section
      id="contact"
      ref={ref}
      className={`min-h-screen flex items-center pt-20 ${isVisible ? 'reveal-visible' : 'reveal-bottom'}`}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">{t('contact.title')}</h2>
        <div className="flex flex-col md:flex-row gap-y-12 md:gap-y-0">
          
          <div className="md:w-1/2 md:pr-12">
            <h3 className="text-2xl font-semibold mb-6 text-primary">{t('contact.info_title')}</h3>
            {contact ? (
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mr-4">
                    <i className="fas fa-envelope text-primary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-800 dark:text-white">{t('contact.email_label')}</h4>
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${contact.email}`} className="text-slate-600 dark:text-gray-300 hover:text-primary transition duration-300">{contact.email}</a>
                      <button
                        type="button"
                        onClick={() => handleCopy(contact.email, 'email')}
                        className="text-slate-400 hover:text-primary transition-colors duration-300"
                        aria-label={copiedField === 'email' ? t('contact.copied_label') : t('contact.copy_label')}
                        title={copiedField === 'email' ? t('contact.copied_label') : t('contact.copy_label')}
                      >
                        {copiedField === 'email' ? <FaCheck size={14} /> : <FaCopy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mr-4">
                    <i className="fas fa-phone text-primary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-800 dark:text-white">{t('contact.phone_label')}</h4>
                    <div className="flex items-center gap-2">
                      <a href={`https://wa.me/${contact.phone}`} className="text-slate-600 dark:text-gray-300 hover:text-primary transition duration-300">{contact.phone}</a>
                      <button
                        type="button"
                        onClick={() => handleCopy(contact.phone, 'phone')}
                        className="text-slate-400 hover:text-primary transition-colors duration-300"
                        aria-label={copiedField === 'phone' ? t('contact.copied_label') : t('contact.copy_label')}
                        title={copiedField === 'phone' ? t('contact.copied_label') : t('contact.copy_label')}
                      >
                        {copiedField === 'phone' ? <FaCheck size={14} /> : <FaCopy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mr-4">
                    <i className="fas fa-map-marker-alt text-primary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-800 dark:text-white">{t('contact.location_label')}</h4>
                    <p className="text-slate-600 dark:text-gray-300">{contact.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mr-4">
                    <i className="fab fa-linkedin text-primary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-800 dark:text-white">{t('contact.linkedin_label')}</h4>
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-gray-300 hover:text-primary transition duration-300 break-all">{contact.linkedin}</a>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-600 dark:text-gray-300">{t('contact.loading')}</p>
            )}
            {contact && (
              <div className="mt-12">
                <h3 className="text-2xl font-semibold mb-6 text-primary">{t('contact.follow_title')}</h3>
                <div className="flex space-x-6">
                  {contact.github && (<a href={contact.github} className="text-3xl text-gray-500 hover:text-primary transition duration-300"><i className="fab fa-github"></i></a>)}
                  {contact.instagram && (<a href={contact.instagram} className="text-3xl text-gray-500 hover:text-primary transition duration-300"><i className="fab fa-instagram"></i></a>)}
                  {contact.facebook && (<a href={contact.facebook} className="text-3xl text-gray-500 hover:text-primary transition duration-300"><i className="fab fa-facebook"></i></a>)}
                  {contact.linktree && (<a href={contact.linktree} className="text-3xl text-gray-500 hover:text-primary transition duration-300"><i className="fas fa-link"></i></a>)}
                </div>
              </div>
            )}
          </div>

          {/* SISI KANAN - FORMULIR KONTAK */}
          <div className="md:w-1/2">
            <form className="bg-white dark:bg-dark rounded-xl p-8 shadow-lg border border-gray-300 dark:border-gray-700" onSubmit={handleSubmit}>
              <h3 className="text-2xl font-semibold mb-6 text-primary">{t('qna.title')}</h3>
              {formStatus.message && (
                <div
                  className={`mb-6 p-3 rounded-lg text-sm ${
                    formStatus.type === 'success'
                      ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border border-green-500/30'
                      : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/30'
                  }`}
                >
                  {formStatus.message}
                </div>
              )}
              <div className="mb-6">
                <label htmlFor="name" className="block mb-2 font-medium text-slate-800 dark:text-white">{t('qna.name_placeholder')}</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-100 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white" placeholder={t('qna.name_placeholder')} />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 font-medium text-slate-800 dark:text-white">{t('qna.email_placeholder')}</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-100 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white" placeholder={t('qna.email_placeholder')} />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block mb-2 font-medium text-slate-800 dark:text-white">{t('qna.message_placeholder')}</label>
                <textarea id="message" rows="5" value={formData.message} onChange={handleChange} className="w-full px-4 py-3 bg-slate-100 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white" placeholder={t('qna.message_placeholder')}></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-primary text-white dark:text-dark font-semibold rounded-lg hover:bg-sky-600 dark:hover:bg-blue-400 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? t('qna.sending_button') : t('qna.send_button')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
