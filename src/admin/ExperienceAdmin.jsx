import React, { useState, useEffect, useCallback, memo } from 'react';
import { supabase } from '../supabaseClient'; // Pastikan path ini benar
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaImage } from 'react-icons/fa';

// Helper function untuk format tanggal (tetap sama)
const formatDateToNamaBulanTahun = (dateStringYyyyMm) => {
  if (!dateStringYyyyMm || dateStringYyyyMm === 'Present') {
    return dateStringYyyyMm;
  }
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

// Komponen Form untuk Pengalaman (diganti dari EducationFormFields)
const ExperienceFormFields = memo(({ data, onChange, isEditMode = false, onLogoFileChange, isUploadingLogo }) => {
  const handleMonthInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ target: { name, value, type: 'month' } });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="md:col-span-2">
            <label htmlFor={isEditMode ? "edit_exp_logo_upload" : "exp_logo_upload"} className="block mb-2 text-sm font-medium text-slate-300">Logo Perusahaan</label>
            <div className="mt-1 flex items-center gap-x-4">
                {data.logo_url && (
                    <img src={data.logo_url} alt="Logo preview" className="h-16 w-16 rounded-lg object-contain bg-slate-600 p-1" />
                )}
                {!data.logo_url && (
                    <div className="h-16 w-16 rounded-lg bg-slate-600 flex items-center justify-center">
                      <FaImage className="text-3xl text-slate-400" />
                    </div>
                )}
                <input 
                    type="file" 
                    id={isEditMode ? "edit_exp_logo_upload" : "exp_logo_upload"}
                    onChange={onLogoFileChange} 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/svg" 
                />
                <label
                    htmlFor={isEditMode ? "edit_exp_logo_upload" : "exp_logo_upload"}
                    className="cursor-pointer rounded-lg bg-slate-600 px-4 py-2.5 text-sm font-medium text-slate-200 shadow-sm hover:bg-slate-500"
                >
                    {isUploadingLogo ? 'Mengupload...' : 'Ubah Logo'}
                </label>
            </div>
        </div>
        <div>
          <label htmlFor={isEditMode ? "edit_exp_name" : "exp_name"} className="block mb-1 text-sm font-medium text-slate-300">Nama Perusahaan/Organisasi</label>
          <input
            type="text"
            name="name" // Kolom: name
            id={isEditMode ? "edit_exp_name" : "exp_name"}
            value={data.name}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Contoh: PT Teknologi Maju Jaya"
            required
          />
        </div>
        <div>
          <label htmlFor={isEditMode ? "edit_exp_position" : "exp_position"} className="block mb-1 text-sm font-medium text-slate-300">Posisi/Jabatan</label>
          <input
            type="text"
            name="position" // Kolom: position
            id={isEditMode ? "edit_exp_position" : "exp_position"}
            value={data.position}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Contoh: Software Engineer"
            required
          />
        </div>
        <div className="md:col-span-2"> {/* Location dibuat full width atau biarkan seperti education (opsional) */}
          <label htmlFor={isEditMode ? "edit_exp_location" : "exp_location"} className="block mb-1 text-sm font-medium text-slate-300">Lokasi</label>
          <input
            type="text"
            name="location" // Kolom: location
            id={isEditMode ? "edit_exp_location" : "exp_location"}
            value={data.location}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Contoh: Jakarta, Indonesia atau Remote"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor={isEditMode ? "edit_exp_description" : "exp_description"} className="block mb-1 text-sm font-medium text-slate-300">Deskripsi Tugas/Pencapaian</label>
          <textarea
            name="description" // Kolom: description
            id={isEditMode ? "edit_exp_description" : "exp_description"}
            rows="4" // Mungkin perlu lebih banyak baris untuk deskripsi pengalaman
            value={Array.isArray(data.description) ? data.description.join('\n') : ''}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tekan Enter untuk poin baru..."
          ></textarea>
        </div>
        <div>
          <label htmlFor={isEditMode ? "edit_exp_start_month" : "exp_start_month"} className="block mb-1 text-sm font-medium text-slate-300">Mulai (Bulan & Tahun)</label>
          <input
            type="month"
            name="start_month" // Kolom: start_month
            id={isEditMode ? "edit_exp_start_month" : "exp_start_month"}
            value={data.start_month}
            onChange={handleMonthInputChange}
            className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
            <label htmlFor={isEditMode ? "edit_exp_end_month" : "exp_end_month"} className="block mb-1 text-sm font-medium text-slate-300">Selesai (Bulan & Tahun)</label>
            <input
                type="month"
                name="end_month" // Kolom: end_month
                id={isEditMode ? "edit_exp_end_month" : "exp_end_month"}
                value={data.is_present || data.end_month === 'Present' ? '' : data.end_month}
                onChange={handleMonthInputChange}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-600 disabled:text-slate-400"
                disabled={data.is_present}
                required={!data.is_present}
            />
            <div className="mt-2">
                <input
                    type="checkbox"
                    name="is_present" // Helper state, bukan kolom DB langsung
                    id={isEditMode ? "edit_exp_is_present" : "exp_is_present"}
                    checked={data.is_present}
                    onChange={onChange}
                    className="mr-2 h-4 w-4 rounded text-indigo-500 focus:ring-indigo-400 border-slate-500 bg-slate-700"
                />
                <label htmlFor={isEditMode ? "edit_exp_is_present" : "exp_is_present"} className="text-sm text-slate-300 select-none">Masih bekerja di sini (Present)</label>
            </div>
        </div>
      </div>
    </>
  );
});


const ExperienceAdmin = () => {
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({
    name: '',
    position: '',
    location: '',
    description: [],
    start_month: '',
    end_month: '',
    logo_url: '',
    is_present: false,
  });
  const [editingExperience, setEditingExperience] = useState(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = useCallback(() => { setTimeout(() => { setError(''); setSuccessMessage(''); }, 4000); }, []);

  // Handler untuk upload logo
  const handleLogoUpload = async (file, formType) => {
    if (!file) return;
    setIsUploadingLogo(true); setError('');
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const filePath = `public/experience_logos/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage.from("portfolio").upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage.from("portfolio").getPublicUrl(filePath);
      const publicUrl = publicUrlData.publicUrl;

      if (formType === 'new') {
        setNewExperience(prev => ({ ...prev, logo_url: publicUrl }));
      } else if (formType === 'edit' && editingExperience) {
        setEditingExperience(prev => ({ ...prev, logo_url: publicUrl }));
      }
      setSuccessMessage("Logo berhasil diupload.");
    } catch (err) {
      setError("Upload logo gagal: " + err.message);
    } finally {
      setIsUploadingLogo(false);
      // clearMessages(); // Mungkin tidak perlu clear success message agar user tahu
    }
  };

  const fetchExperiences = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('experience') // GANTI NAMA TABEL
        .select('*')
        .order('start_month', { ascending: false }); 

      if (fetchError) throw fetchError;
      setExperiences(data || []);
    } catch (err) {
      console.error("Error fetching experience data:", err);
      setError(`Gagal memuat data pengalaman: ${err.message}`);
      clearMessages();
    } finally { setLoading(false); }
  }, [clearMessages]);

  useEffect(() => { fetchExperiences(); }, [fetchExperiences]);

  const handleNewExperienceChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setNewExperience(prev => {
      if (name === 'description') {
        return { ...prev, description: value.split('\n') };
      } else if (name === 'is_present') {
        return { ...prev, is_present: checked, end_month: checked ? 'Present' : (prev.end_month === 'Present' ? '' : prev.end_month) };
      } else if (type === 'month') {
        return { ...prev, [name]: value }; 
      }
      return { ...prev, [name]: type === 'checkbox' ? checked : value };
    });
  }, []);

  const handleEditExperienceChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setEditingExperience(prev => {
      if (!prev) return null;
      if (name === 'description') {
        return { ...prev, description: value.split('\n') };
      } else if (name === 'is_present') {
        return { ...prev, is_present: checked, end_month: checked ? 'Present' : (prev.end_month === 'Present' ? '' : prev.end_month) };
      } else if (type === 'month') {
        return { ...prev, [name]: value };
      }
      return { ...prev, [name]: type === 'checkbox' ? checked : value };
    });
  }, []);

  const resetNewExperienceForm = () => {
    setNewExperience({
      name: '', position: '', location: '', logo_url: '', 
      description: [], start_month: '', end_month: '', is_present: false,
    });
  };

  const handleAddExperience = async (e) => {
    e.preventDefault(); setSaving(true); setError(''); setSuccessMessage('');
    const dataToSave = { ...newExperience };
    if (dataToSave.is_present) dataToSave.end_month = 'Present';
    delete dataToSave.is_present;

    try {
      const { error: insertError } = await supabase.from('experience').insert(dataToSave); // GANTI NAMA TABEL
      if (insertError) throw insertError;
      setSuccessMessage('Data pengalaman berhasil ditambahkan!');
      resetNewExperienceForm(); fetchExperiences();
    } catch (err) {
      console.error("Error adding experience:", err);
      setError(`Gagal menambahkan data: ${err.message}`);
    } finally { setSaving(false); clearMessages(); }
  };

  const openEditModal = (exp) => {
    const isPresent = exp.end_month === 'Present';
    setEditingExperience({ ...exp, is_present: isPresent });
    setIsModalOpen(true);
  };

  const closeEditModal = () => { setEditingExperience(null); setIsModalOpen(false); };

  const handleUpdateExperience = async (e) => {
    e.preventDefault();
    if (!editingExperience || !editingExperience.id) return;
    setSaving(true); setError(''); setSuccessMessage('');
    const { id, ...dataToUpdateWithoutId } = editingExperience;
    const dataToUpdate = { ...dataToUpdateWithoutId };

    if (dataToUpdate.is_present) dataToUpdate.end_month = 'Present';
    delete dataToUpdate.is_present;

    try {
      const { error: updateError } = await supabase
        .from('experience') // GANTI NAMA TABEL
        .update(dataToUpdate)
        .eq('id', id);
      if (updateError) throw updateError;
      setSuccessMessage('Data pengalaman berhasil diperbarui!');
      closeEditModal(); fetchExperiences();
    } catch (err) {
      console.error("Error updating experience:", err);
      setError(`Gagal memperbarui data: ${err.message}`);
    } finally { setSaving(false); clearMessages(); }
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data pengalaman ini?")) return;
    setDeleting(true); setError(''); setSuccessMessage('');
    try {
      const { error: deleteError } = await supabase.from('experience').delete().eq('id', id); // GANTI NAMA TABEL
      if (deleteError) throw deleteError;
      setSuccessMessage('Data pengalaman berhasil dihapus!');
      fetchExperiences();
    } catch (err) {
      console.error("Error deleting experience:", err);
      setError(`Gagal menghapus data: ${err.message}`);
    } finally { setDeleting(false); clearMessages(); }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200 flex justify-center items-center">
        <p className="text-xl">Memuat data Pengalaman...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200">
      <div className="max-w mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-400">Pengaturan Pengalaman Kerja</h1>

        {error && <div className="mb-6 p-3 bg-red-500/30 text-red-300 rounded-md text-sm">{error}</div>}
        {successMessage && <div className="mb-6 p-3 bg-green-500/30 text-green-300 rounded-md text-sm">{successMessage}</div>}

        <form onSubmit={handleAddExperience} className="mb-10 p-6 bg-slate-800 rounded-lg shadow-xl">
                <h2 className="text-xl font-semibold mb-6 text-indigo-300">Tambah Pengalaman Kerja Baru</h2>
                <ExperienceFormFields 
                    data={newExperience} 
                    onChange={handleNewExperienceChange} 
                    onLogoFileChange={(e) => handleLogoUpload(e.target.files[0], 'new')}
                    isUploadingLogo={isUploadingLogo}
                />
          <div className="mt-6 text-right">
            <button type="submit" disabled={saving || isUploadingLogo} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
              {saving ? 'Menyimpan...' : <><FaPlus className="inline mr-2" /> Tambah Pengalaman</>}
            </button>
          </div>
        </form>

        <div className="bg-slate-800 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-indigo-300">Daftar Pengalaman Kerja</h2>
            {experiences.length === 0 && !loading ? ( <p className="text-slate-400">Belum ada data pengalaman.</p> ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-indigo-300 uppercase bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Perusahaan/Organisasi</th>
                            <th scope="col" className="px-6 py-3">Posisi</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Lokasi</th>
                            <th scope="col" className="px-6 py-3">Periode</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {experiences.map((exp) => ( // ganti edu menjadi exp
                        <tr key={exp.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-100 whitespace-nowrap">{exp.name}</td>
                            <td className="px-6 py-4">{exp.position || '-'}</td>
                            <td className="px-6 py-4 hidden md:table-cell">{exp.location || '-'}</td>
                            <td className="px-2 py-4 whitespace-nowrap">
                                {formatDateToNamaBulanTahun(exp.start_month)} - {formatDateToNamaBulanTahun(exp.end_month)}
                            </td>
                            <td className="px-2 py-4 text-center">
                            <button onClick={() => openEditModal(exp)} className="font-medium text-indigo-400 hover:text-indigo-300 mr-3 p-1" aria-label="Edit"> <FaEdit size={16}/> </button>
                            <button onClick={() => handleDeleteExperience(exp.id)} disabled={deleting} className="font-medium text-red-500 hover:text-red-400 p-1 disabled:opacity-50" aria-label="Hapus"> <FaTrash size={16}/> </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>

        {isModalOpen && editingExperience && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-indigo-300">Edit Pengalaman Kerja</h2>
                <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-200 p-1" aria-label="Tutup modal"> <FaTimes size={24} /> </button>
              </div>
              <form onSubmit={handleUpdateExperience}>
                            <ExperienceFormFields 
                                data={editingExperience} 
                                onChange={handleEditExperienceChange} 
                                isEditMode={true}
                                onLogoFileChange={(e) => handleLogoUpload(e.target.files[0], 'edit')}
                                isUploadingLogo={isUploadingLogo}
                            />
                <div className="mt-8 flex justify-end gap-3">
                  <button type="button" onClick={closeEditModal} className="px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium rounded-lg transition-colors"> Batal </button>
                  <button type="submit" disabled={saving || isUploadingLogo} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
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

export default ExperienceAdmin;