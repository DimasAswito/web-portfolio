import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { FaUser } from 'react-icons/fa';
import useInView from '../hooks/useInView';

export default function GuestbookSection() {
  const { t } = useTranslation();
  const [ref, isVisible] = useInView();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching guestbook entries:', error);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  useEffect(() => {
    const channel = supabase
      .channel('guestbook-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'guestbook', filter: 'approved=eq.true' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const record = payload.new;
            setEntries((prev) => {
              const withoutRecord = prev.filter((entry) => entry.id !== record.id);
              return [record, ...withoutRecord].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
              );
            });
          } else if (payload.eventType === 'DELETE') {
            const removedId = payload.old.id;
            setEntries((prev) => prev.filter((entry) => entry.id !== removedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, message } = formData;
    if (!name || !message) {
      setFormStatus({ type: 'error', message: t('guestbook.validation_message') });
      return;
    }

    setSubmitting(true);
    setFormStatus({ type: '', message: '' });
    const { error } = await supabase.from('guestbook').insert([{ name, message, approved: false }]);
    setSubmitting(false);

    if (error) {
      console.error('Error submitting guestbook entry:', error.message);
      setFormStatus({ type: 'error', message: t('guestbook.error_message') });
    } else {
      setFormStatus({ type: 'success', message: t('guestbook.success_message') });
      setFormData({ name: '', message: '' });
    }
  };

  return (
    <section
      id="guestbook"
      ref={ref}
      className={`py-20 ${isVisible ? 'reveal-visible' : 'reveal-right'}`}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">{t('guestbook.title')}</h2>
        <div className="flex flex-col md:flex-row gap-y-12 md:gap-x-12">
          <div className="md:w-1/2">
            <form className="bg-white dark:bg-dark rounded-xl p-8 shadow-lg border border-gray-300 dark:border-gray-700" onSubmit={handleSubmit}>
              <h3 className="text-2xl font-semibold mb-6 text-primary">{t('guestbook.form_title')}</h3>
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
                <label htmlFor="name" className="block mb-2 font-medium text-slate-800 dark:text-white">{t('guestbook.name_placeholder')}</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-100 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white" placeholder={t('guestbook.name_placeholder')} />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block mb-2 font-medium text-slate-800 dark:text-white">{t('guestbook.message_placeholder')}</label>
                <textarea id="message" rows="4" value={formData.message} onChange={handleChange} className="w-full px-4 py-3 bg-slate-100 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white" placeholder={t('guestbook.message_placeholder')}></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-primary text-white dark:text-dark font-semibold rounded-lg hover:bg-sky-600 dark:hover:bg-blue-400 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? t('guestbook.sending_button') : t('guestbook.send_button')}
              </button>
              <p className="mt-3 text-xs text-slate-500 dark:text-gray-400">{t('guestbook.pending_note')}</p>
            </form>
          </div>

          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold mb-6 text-primary">{t('guestbook.list_title')}</h3>
            {loading ? (
              <p className="text-slate-600 dark:text-gray-300">{t('guestbook.loading')}</p>
            ) : entries.length === 0 ? (
              <p className="text-slate-600 dark:text-gray-300">{t('guestbook.empty')}</p>
            ) : (
              <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-2">
                {entries.map((entry) => (
                  <div key={entry.id} className="bg-white dark:bg-dark rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
                        <FaUser className="text-primary text-sm" />
                      </div>
                      <span className="font-medium text-slate-800 dark:text-white">{entry.name}</span>
                    </div>
                    <p className="text-slate-600 dark:text-gray-300 text-sm whitespace-pre-wrap break-words">{entry.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
