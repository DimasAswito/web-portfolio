import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { FaCheck, FaTimes, FaTrash, FaUser, FaCommentDots } from 'react-icons/fa';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  try {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch (e) {
    return timestamp;
  }
};

const GuestbookAdmin = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = useCallback(() => { setTimeout(() => { setError(''); setSuccessMessage(''); }, 4000); }, []);

  const fetchEntries = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching guestbook entries:', err);
      setError(`Gagal memuat data guestbook: ${err.message}`);
      clearMessages();
    } finally { setLoading(false); }
  }, [clearMessages]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleToggleApprove = async (entry) => {
    setUpdatingId(entry.id); setError(''); setSuccessMessage('');
    try {
      const { error: updateError } = await supabase
        .from('guestbook')
        .update({ approved: !entry.approved })
        .eq('id', entry.id);
      if (updateError) throw updateError;
      setSuccessMessage(entry.approved ? 'Pesan disembunyikan dari publik.' : 'Pesan disetujui dan tampil di publik.');
      fetchEntries();
    } catch (err) {
      console.error('Error updating guestbook entry:', err);
      setError(`Gagal memperbarui status: ${err.message}`);
    } finally { setUpdatingId(null); clearMessages(); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return;
    setDeleting(true); setError(''); setSuccessMessage('');
    try {
      const { error: deleteError } = await supabase.from('guestbook').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setSuccessMessage('Pesan berhasil dihapus!');
      fetchEntries();
    } catch (err) {
      console.error('Error deleting guestbook entry:', err);
      setError(`Gagal menghapus pesan: ${err.message}`);
    } finally { setDeleting(false); clearMessages(); }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200 flex justify-center items-center">
        <p className="text-xl">Memuat data guestbook...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-400">Manajemen Guestbook</h1>

        {error && <div className="mb-6 p-3 bg-red-500/30 text-red-300 rounded-md text-sm">{error}</div>}
        {successMessage && <div className="mb-6 p-3 bg-green-500/30 text-green-300 rounded-md text-sm">{successMessage}</div>}

        <div className="bg-slate-800 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-0 p-6 text-indigo-300 border-b border-slate-700">Daftar Pesan</h2>
          {entries.length === 0 ? (
            <p className="text-slate-400 p-6">Belum ada pesan guestbook.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-indigo-300 uppercase bg-slate-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 w-1/5">Nama</th>
                    <th scope="col" className="px-6 py-3 w-2/5">Pesan</th>
                    <th scope="col" className="px-6 py-3">Dikirim</th>
                    <th scope="col" className="px-6 py-3 text-center">Status</th>
                    <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-100">
                        <div className="flex items-center"><FaUser className="mr-2 text-slate-400" /> {entry.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start"><FaCommentDots className="mr-2 mt-1 text-slate-400 flex-shrink-0" /><span className="whitespace-pre-wrap break-words">{entry.message}</span></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatTimestamp(entry.created_at)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${entry.approved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {entry.approved ? 'Tampil' : 'Menunggu'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleApprove(entry)}
                          disabled={updatingId === entry.id}
                          className={`font-medium mr-3 p-1 disabled:opacity-50 ${entry.approved ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}
                          aria-label={entry.approved ? 'Batalkan persetujuan' : 'Setujui'}
                          title={entry.approved ? 'Batalkan persetujuan' : 'Setujui'}
                        >
                          {entry.approved ? <FaTimes size={16} /> : <FaCheck size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          disabled={deleting}
                          className="font-medium text-red-500 hover:text-red-400 p-1 disabled:opacity-50"
                          aria-label="Hapus"
                        >
                          <FaTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestbookAdmin;
