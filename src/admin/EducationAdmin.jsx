import React, { useState, useEffect, useCallback, memo } from 'react';
import { supabase } from '../supabaseClient'; 
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const formatDateToNamaBulanTahun = (dateStringYyyyMm) => {
  if (!dateStringYyyyMm || dateStringYyyyMm === 'Present') {
    return dateStringYyyyMm;   }
  try {
    if (!/^\d{4}-\d{2}$/.test(dateStringYyyyMm)) {
        return dateStringYyyyMm;
    }
    const [year, month] = dateStringYyyyMm.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1); 
    return dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }); 
  } catch (e) {
    console.warn("Error formatting date:", dateStringYyyyMm, e);
    return dateStringYyyyMm; 
  }
};

const EducationFormFields = memo(({ data, onChange, isEditMode = false }) => {
  const handleMonthInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ target: { name, value, type: 'month' } });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label htmlFor={isEditMode ? "edit_education_name" : "education_name"} className="block mb-1 text-sm font-medium text-slate-300">Nama Institusi</label>
          <input type="text" name="education_name" id={isEditMode ? "edit_education_name" : "education_name"} value={data.education_name} onChange={onChange} className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: Universitas Teknologi Canggih" required />
        </div>
        <div>
          <label htmlFor={isEditMode ? "edit_jurusan" : "jurusan"} className="block mb-1 text-sm font-medium text-slate-300">Jurusan / Program Studi</label>
          <input type="text" name="jurusan" id={isEditMode ? "edit_jurusan" : "jurusan"} value={data.jurusan} onChange={onChange} className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: Teknik Informatika"/>
        </div>
        <div>
          <label htmlFor={isEditMode ? "edit_nilai" : "nilai"} className="block mb-1 text-sm font-medium text-slate-300">Nilai / IPK (Opsional)</label>
          <input type="text" name="nilai" id={isEditMode ? "edit_nilai" : "nilai"} value={data.nilai} onChange={onChange} className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: 3.85"/>
        </div>
        <div>
          <label htmlFor={isEditMode ? "edit_location" : "location"} className="block mb-1 text-sm font-medium text-slate-300">Lokasi</label>
          <input type="text" name="location" id={isEditMode ? "edit_location" : "location"} value={data.location} onChange={onChange} className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: Jakarta, Indonesia"/>
        </div>
        <div className="md:col-span-2">
          <label htmlFor={isEditMode ? "edit_description" : "description"} className="block mb-1 text-sm font-medium text-slate-300">Deskripsi / Poin Penting</label>
          <textarea name="description" id={isEditMode ? "edit_description" : "description"} rows="3" value={Array.isArray(data.description) ? data.description.join('\n') : ''} onChange={onChange} className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Tekan Enter untuk poin baru..."></textarea>
        </div>
        <div>
          <label htmlFor={isEditMode ? "edit_start_year" : "start_year"} className="block mb-1 text-sm font-medium text-slate-300">Mulai (Bulan & Tahun)</label>
          <input type="month" name="start_year" id={isEditMode ? "edit_start_year" : "start_year"} value={data.start_year} onChange={handleMonthInputChange} className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
            <label htmlFor={isEditMode ? "edit_end_year" : "end_year"} className="block mb-1 text-sm font-medium text-slate-300">Selesai (Bulan & Tahun)</label>
            <input type="month" name="end_year" id={isEditMode ? "edit_end_year" : "end_year"} value={data.is_present || data.end_year === 'Present' ? '' : data.end_year} onChange={handleMonthInputChange} className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-600 disabled:text-slate-400" disabled={data.is_present} required={!data.is_present} />
            <div className="mt-2">
                <input type="checkbox" name="is_present" id={isEditMode ? "edit_is_present" : "is_present"} checked={data.is_present} onChange={onChange} className="mr-2 h-4 w-4 rounded text-indigo-500 focus:ring-indigo-400 border-slate-500 bg-slate-700" />
                <label htmlFor={isEditMode ? "edit_is_present" : "is_present"} className="text-sm text-slate-300 select-none">Masih berlangsung (Present)</label>
            </div>
        </div>
      </div>
    </>
  );
});

const EducationAdmin = () => {
  // State untuk daftar semua entri pendidikan
  const [educations, setEducations] = useState([]);

  // State untuk form tambah pendidikan baru
  const [newEducation, setNewEducation] = useState({
    education_name: '',
    jurusan: '',
    nilai: '', 
    location: '',
    description: [],
    start_year: '',
    end_year: '',
    is_present: false,
  });

  // State untuk entri pendidikan yang sedang diedit di modal
  const [editingEducation, setEditingEducation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State untuk UI feedback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false); 
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fungsi untuk membersihkan pesan setelah beberapa detik
  const clearMessages = useCallback(() => {
    setTimeout(() => {
      setError('');
      setSuccessMessage('');
    }, 4000);
  }, []);

  // Mengambil data pendidikan
  const fetchEducations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('education')
        .select('*')
        .order('start_year', { ascending: false });

      if (fetchError) throw fetchError;
      setEducations(data || []);
    } catch (err) {
      console.error("Error fetching education data:", err);
      setError(`Gagal memuat data pendidikan: ${err.message}`);
      clearMessages();
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  useEffect(() => {
    fetchEducations();
  }, [fetchEducations]);

const handleNewEducationChange = useCallback((e) => {
  const { name, value, type, checked } = e.target;
  setNewEducation(prev => {
    if (name === 'description') {
      return { ...prev, description: value.split('\n') };
    } else if (name === 'is_present') {
      return { 
        ...prev, 
        is_present: checked,
        end_year: checked ? 'Present' : (prev.end_year === 'Present' ? '' : prev.end_year) 
      };
    } else if (type === 'month') { 
      return { ...prev, [name]: value }; 
    }
    return { ...prev, [name]: type === 'checkbox' ? checked : value };
  });
}, []);

const handleEditEducationChange = useCallback((e) => {
  const { name, value, type, checked } = e.target;
  setEditingEducation(prev => {
    if (!prev) return null; 
    if (name === 'description') {
      return { ...prev, description: value.split('\n') };
    } else if (name === 'is_present') {
      return { 
        ...prev, 
        is_present: checked, 
        end_year: checked ? 'Present' : (prev.end_year === 'Present' ? '' : prev.end_year) 
      };
    } else if (type === 'month') {
      return { ...prev, [name]: value };
    }
    return { ...prev, [name]: type === 'checkbox' ? checked : value };
  });
}, []); 

  // Fungsi untuk mereset form tambah baru
  const resetNewEducationForm = () => {
    setNewEducation({
      education_name: '',
      jurusan: '',
      nilai: '',
      location: '',
      description: [],
      start_year: '',
      end_year: '',
      is_present: false,
    });
  };

  // Menambah entri pendidikan baru
  const handleAddEducation = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    // Ambil data yang akan disimpan, pastikan end_year sesuai dengan is_present
    const dataToSave = { ...newEducation };
    if (dataToSave.is_present) {
        dataToSave.end_year = 'Present';
    }
    delete dataToSave.is_present; // Hapus field temporary is_present

    try {
      const { error: insertError } = await supabase.from('education').insert(dataToSave);
      if (insertError) throw insertError;

      setSuccessMessage('Data pendidikan berhasil ditambahkan!');
      resetNewEducationForm();
      fetchEducations(); // Muat ulang data
    } catch (err) {
      console.error("Error adding education:", err);
      setError(`Gagal menambahkan data: ${err.message}`);
    } finally {
      setSaving(false);
      clearMessages();
    }
  };

  // Membuka modal edit
const openEditModal = (edu) => {
  const isPresent = edu.end_year === 'Present';
  setEditingEducation({ 
    ...edu, 
    is_present: isPresent,
  });
  setIsModalOpen(true);
};

  // Menutup modal edit
  const closeEditModal = () => {
    setEditingEducation(null);
    setIsModalOpen(false);
  };

  // Menyimpan perubahan dari modal edit
  const handleUpdateEducation = async (e) => {
    e.preventDefault();
    if (!editingEducation || !editingEducation.id) return;

    setSaving(true);
    setError('');
    setSuccessMessage('');

    const { id, ...dataToUpdate } = editingEducation;
    if (dataToUpdate.is_present) {
        dataToUpdate.end_year = 'Present';
    }
    delete dataToUpdate.is_present; 

    try {
      const { error: updateError } = await supabase
        .from('education')
        .update(dataToUpdate)
        .eq('id', id);
      if (updateError) throw updateError;

      setSuccessMessage('Data pendidikan berhasil diperbarui!');
      closeEditModal();
      fetchEducations();
    } catch (err) {
      console.error("Error updating education:", err);
      setError(`Gagal memperbarui data: ${err.message}`);
    } finally {
      setSaving(false);
      clearMessages();
    }
  };

  // Menghapus entri pendidikan
  const handleDeleteEducation = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data pendidikan ini?")) return;

    setDeleting(true); 
    setError('');
    setSuccessMessage('');
    try {
      const { error: deleteError } = await supabase.from('education').delete().eq('id', id);
      if (deleteError) throw deleteError;

      setSuccessMessage('Data pendidikan berhasil dihapus!');
      fetchEducations(); // Muat ulang data
    } catch (err) {
      console.error("Error deleting education:", err);
      setError(`Gagal menghapus data: ${err.message}`);
    } finally {
      setDeleting(false);
      clearMessages();
    }
  };


  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200 flex justify-center items-center">
        <p className="text-xl">Memuat data Riwayat Pendidikan...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200">
      <div className="max-w mx-auto"> {/* Max width disesuaikan untuk tabel */}
        <h1 className="text-3xl font-bold mb-8 text-indigo-400">Pengaturan Riwayat Pendidikan</h1>

        {/* Area Pesan Global */}
        {error && <div className="mb-6 p-3 bg-red-500/30 text-red-300 rounded-md text-sm">{error}</div>}
        {successMessage && <div className="mb-6 p-3 bg-green-500/30 text-green-300 rounded-md text-sm">{successMessage}</div>}

        {/* Form Tambah Pendidikan Baru */}
        <form onSubmit={handleAddEducation} className="mb-10 p-6 bg-slate-800 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-6 text-indigo-300">Tambah Riwayat Pendidikan Baru</h2>
          <EducationFormFields data={newEducation} onChange={handleNewEducationChange} />
          <div className="mt-6 text-right">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Menyimpan...' : <><FaPlus className="inline mr-2" /> Tambah Pendidikan</>}
            </button>
          </div>
        </form>

        {/* Tabel Daftar Pendidikan */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-indigo-300">Daftar Riwayat Pendidikan</h2>
            {educations.length === 0 && !loading ? (
                <p className="text-slate-400">Belum ada data pendidikan.</p>
            ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-indigo-300 uppercase bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nama Institusi</th>
                            <th scope="col" className="px-6 py-3">Jurusan</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Lokasi</th>
                            <th scope="col" className="px-6 py-3">Tahun</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {educations.map((edu) => (
                        <tr key={edu.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-100 whitespace-nowrap">{edu.education_name}</td>
                            <td className="px-6 py-4">{edu.jurusan || '-'}</td>
                            <td className="px-6 py-4 hidden md:table-cell">{edu.location || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formatDateToNamaBulanTahun(edu.start_year)} - {formatDateToNamaBulanTahun(edu.end_year)}</td>
                            <td className="px-2 py-4 text-center">
                            <button
                                onClick={() => openEditModal(edu)}
                                className="font-medium text-indigo-400 hover:text-indigo-300 mr-3 p-1"
                                aria-label="Edit"
                            >
                                <FaEdit size={16}/>
                            </button>
                            <button
                                onClick={() => handleDeleteEducation(edu.id)}
                                disabled={deleting} 
                                className="font-medium text-red-500 hover:text-red-400 p-1 disabled:opacity-50"
                                aria-label="Hapus"
                            >
                                <FaTrash size={16}/>
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>


        {/* Modal Edit Pendidikan */}
        {isModalOpen && editingEducation && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-indigo-300">Edit Riwayat Pendidikan</h2>
                <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-200 p-1" aria-label="Tutup modal">
                  <FaTimes size={24} />
                </button>
              </div>
              <form onSubmit={handleUpdateEducation}>
                <EducationFormFields data={editingEducation} onChange={handleEditEducationChange} isEditMode={true} />
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? 'Menyimpan...' : <><FaSave className="inline mr-2" /> Simpan Perubahan</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationAdmin;