import React, { useState, useEffect, useCallback, memo } from 'react';
import { supabase } from '../supabaseClient'; // Pastikan path ini benar
import { FaEdit, FaTrash, FaSave, FaTimes, FaSearch, FaEnvelope, FaUser, FaCommentDots } from 'react-icons/fa';

// Helper function untuk format tanggal jika ada kolom timestamp (misal: created_at)
// Jika tidak ada, Anda bisa menghapus atau menyesuaikan ini.
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  try {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return timestamp;
  }
};

/*
// Komponen Form untuk Edit QnA (dikomentari, jika diperlukan nanti)
const QnAFormFields = memo(({ data, onChange, isEditMode = false }) => {
  // isEditMode tidak terlalu relevan di sini jika hanya untuk edit
  // karena fieldnya akan read-only atau diedit langsung.
  // Jika ingin field bisa diedit, maka mirip seperti form lain.
  // Untuk QnA, biasanya pesan tidak diedit, tapi ini tergantung kebutuhan.
  return (
    <>
      <div className="space-y-4">
        <div>
          <label htmlFor="qna_name" className="block mb-1 text-sm font-medium text-slate-300">Nama Pengirim</label>
          <input
            type="text"
            name="name"
            id="qna_name"
            value={data.name || ''}
            onChange={onChange} // Buat readOnly jika tidak ingin diedit
            // readOnly 
            className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="qna_email" className="block mb-1 text-sm font-medium text-slate-300">Email</label>
          <input
            type="email"
            name="email"
            id="qna_email"
            value={data.email || ''}
            onChange={onChange} // Buat readOnly jika tidak ingin diedit
            // readOnly
            className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="qna_message" className="block mb-1 text-sm font-medium text-slate-300">Pesan</label>
          <textarea
            name="message"
            id="qna_message"
            rows="5"
            value={data.message || ''}
            onChange={onChange} // Buat readOnly jika tidak ingin diedit
            // readOnly
            className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
      </div>
    </>
  );
});
*/

const QnAAdmin = () => {
  const [qnaMessages, setQnaMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk modal edit (dikomentari)
  // const [editingMessage, setEditingMessage] = useState(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  // const [saving, setSaving] = useState(false); // Untuk simpan editan (dikomentari)
  // const [deleting, setDeleting] = useState(false); // Untuk hapus (dikomentari)
  const [error, setError] = useState('');
  // const [successMessage, setSuccessMessage] = useState(''); // Untuk notifikasi (dikomentari)

  // const clearMessages = useCallback(() => { setTimeout(() => { setError(''); setSuccessMessage(''); }, 4000); }, []);

  const fetchQnaMessages = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('qna')
        .select('*')
        // Asumsi ada kolom 'created_at' untuk sorting, jika tidak, ganti dengan 'name' atau lainnya
        .order('created_at', { ascending: false }); 

      if (fetchError) throw fetchError;
      setQnaMessages(data || []);
      setFilteredMessages(data || []); // Inisialisasi filteredMessages
    } catch (err) {
      console.error("Error fetching QnA data:", err);
      setError(`Gagal memuat data QnA: ${err.message}`);
      // clearMessages();
    } finally { setLoading(false); }
  }, []); // [clearMessages] jika digunakan

  useEffect(() => { fetchQnaMessages(); }, [fetchQnaMessages]);

  // Efek untuk filtering
  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = qnaMessages.filter(item => {
      return (
        item.name?.toLowerCase().includes(lowercasedFilter) ||
        item.email?.toLowerCase().includes(lowercasedFilter) ||
        item.message?.toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredMessages(filteredData);
  }, [searchTerm, qnaMessages]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /*
  // Fungsi untuk Edit & Hapus (dikomentari)
  const openEditModal = (msg) => {
    setEditingMessage({ ...msg }); // Salin data untuk diedit
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingMessage(null);
    setIsModalOpen(false);
  };

  const handleEditFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditingMessage(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  }, []);

  const handleUpdateMessage = async (e) => {
    e.preventDefault();
    if (!editingMessage || !editingMessage.id) return;

    setSaving(true); setError(''); setSuccessMessage('');
    const { id, ...dataToUpdate } = editingMessage; // Kolom seperti created_at mungkin tidak perlu diupdate

    try {
      // Hati-hati jika ingin mengizinkan update pada 'name' atau 'email' jika itu data asli user.
      // Biasanya pesan QnA tidak diubah.
      const { error: updateError } = await supabase
        .from('qna')
        .update(dataToUpdate) // Tentukan kolom yang boleh diupdate
        .eq('id', id);
      if (updateError) throw updateError;

      setSuccessMessage('Data QnA berhasil diperbarui!');
      closeEditModal();
      fetchQnaMessages();
    } catch (err) {
      console.error("Error updating QnA:", err);
      setError(`Gagal memperbarui data: ${err.message}`);
    } finally {
      setSaving(false);
      clearMessages();
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pesan ini?")) return;

    setDeleting(true); setError(''); setSuccessMessage('');
    try {
      const { error: deleteError } = await supabase.from('qna').delete().eq('id', id);
      if (deleteError) throw deleteError;

      setSuccessMessage('Pesan berhasil dihapus!');
      fetchQnaMessages();
    } catch (err) {
      console.error("Error deleting QnA:", err);
      setError(`Gagal menghapus pesan: ${err.message}`);
    } finally {
      setDeleting(false);
      clearMessages();
    }
  };
  */


  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200 flex justify-center items-center">
        <p className="text-xl">Memuat data Q&A...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200">
      <div className="max-w-6xl mx-auto"> {/* Dibuat lebih lebar untuk tabel */}
        <h1 className="text-3xl font-bold mb-8 text-indigo-400">Manajemen Q&A / Pesan Masuk</h1>

        {error && <div className="mb-6 p-3 bg-red-500/30 text-red-300 rounded-md text-sm">{error}</div>}
        {/* {successMessage && <div className="mb-6 p-3 bg-green-500/30 text-green-300 rounded-md text-sm">{successMessage}</div>} */}
        
        {/* Filter Section */}
        <div className="mb-6 p-4 bg-slate-800 rounded-lg shadow-md">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Cari berdasarkan nama, email, atau isi pesan..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
        </div>

        {/* Tabel Daftar QnA */}
        <div className="bg-slate-800 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-0 p-6 text-indigo-300 border-b border-slate-700">Daftar Pesan</h2>
            {filteredMessages.length === 0 && !loading ? (
                <p className="text-slate-400 p-6">Tidak ada pesan yang cocok dengan filter atau belum ada pesan masuk.</p>
            ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-indigo-300 uppercase bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 w-1/4">Nama</th>
                            <th scope="col" className="px-6 py-3 w-1/4">Email</th>
                            <th scope="col" className="px-6 py-3 w-2/4">Pesan</th>
                            {/* <th scope="col" className="px-6 py-3">Dikirim</th> */} {/* Jika ada kolom created_at */}
                            {/* <th scope="col" className="px-6 py-3 text-center">Aksi</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMessages.map((msg) => (
                        <tr key={msg.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-100">
                                <div className="flex items-center">
                                    <FaUser className="mr-2 text-slate-400" /> {msg.name}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <FaEnvelope className="mr-2 text-slate-400" /> 
                                    <a href={`mailto:${msg.email}`} className="hover:text-indigo-400">{msg.email}</a>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-start"> {/* items-start agar ikon sejajar dengan baris pertama pesan */}
                                    <FaCommentDots className="mr-2 mt-1 text-slate-400 flex-shrink-0" />
                                    <span className="whitespace-pre-wrap break-words">{msg.message}</span>
                                </div>
                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                {formatTimestamp(msg.created_at)}
                            </td>
                            */}
                            {/*
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                            <button
                                onClick={() => openEditModal(msg)}
                                className="font-medium text-indigo-400 hover:text-indigo-300 mr-3 p-1"
                                aria-label="Edit atau Lihat Detail" // Label bisa diubah
                            >
                                <FaEdit size={16}/>
                            </button>
                            <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                disabled={deleting}
                                className="font-medium text-red-500 hover:text-red-400 p-1 disabled:opacity-50"
                                aria-label="Hapus"
                            >
                                <FaTrash size={16}/>
                            </button>
                            </td>
                            */}
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>

        {/* Modal Edit QnA (dikomentari) */}
        {/*
        {isModalOpen && editingMessage && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-indigo-300">Detail Pesan / Edit</h2>
                <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-200 p-1" aria-label="Tutup modal">
                  <FaTimes size={24} />
                </button>
              </div>
              <form onSubmit={handleUpdateMessage}>
                <QnAFormFields data={editingMessage} onChange={handleEditFormChange} isEditMode={true} />
                <div className="mt-8 flex justify-end gap-3">
                  <button type="button" onClick={closeEditModal} className="px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium rounded-lg transition-colors">
                    Tutup
                  </button>
                  // Tombol simpan bisa diaktifkan jika memang ada field yang boleh diedit
                  // <button
                  //   type="submit"
                  //   disabled={saving}
                  //   className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  // >
                  //   {saving ? 'Menyimpan...' : <><FaSave className="inline mr-2" /> Simpan Perubahan</>}
                  // </button>
                </div>
              </form>
            </div>
          </div>
        )}
        */}
      </div>
    </div>
  );
};

export default QnAAdmin;