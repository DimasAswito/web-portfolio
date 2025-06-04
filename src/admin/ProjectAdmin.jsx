import React, { useState, useEffect, useCallback, memo } from 'react';
import { supabase } from '../supabaseClient'; // Pastikan path ini benar
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaTag, FaLink, FaGithub } from 'react-icons/fa';

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

// Komponen Form untuk Proyek
const ProjectFormFields = memo(({
  data,
  onChange,
  isEditMode = false,
  currentTagValue, // Untuk nilai input tag saat ini
  onCurrentTagChange, // Handler untuk perubahan input tag
  onAddTag, // Handler untuk menambah tag
  onRemoveTag // Handler untuk menghapus tag
}) => {
  const handleMonthInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ target: { name, value, type: 'month' } });
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddTag();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="md:col-span-2">
          <label htmlFor={isEditMode ? "edit_project_name" : "project_name"} className="block mb-1 text-sm font-medium text-slate-300">Nama Proyek</label>
          <input
            type="text"
            name="project_name"
            id={isEditMode ? "edit_project_name" : "project_name"}
            value={data.project_name}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Contoh: Aplikasi Manajemen Toko"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor={isEditMode ? "edit_project_description" : "project_description"} className="block mb-1 text-sm font-medium text-slate-300">Deskripsi Proyek</label>
          <textarea
            name="description" // Ini adalah string tunggal
            id={isEditMode ? "edit_project_description" : "project_description"}
            rows="4"
            value={data.description}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Jelaskan tentang proyek ini..."
          ></textarea>
        </div>

        {/* Bagian Input Tagline (Tags) */}
        <div className="md:col-span-2">
            <label htmlFor={isEditMode ? "edit_project_tag_input" : "project_tag_input"} className="block mb-1 text-sm font-medium text-slate-300">Tagline / Teknologi (Tekan Enter untuk menambah)</label>
            <div className="flex items-center">
                <input
                    type="text"
                    id={isEditMode ? "edit_project_tag_input" : "project_tag_input"}
                    value={currentTagValue}
                    onChange={onCurrentTagChange}
                    onKeyDown={handleTagInputKeyDown}
                    className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-l-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
                    placeholder="Ketik tag lalu Enter"
                />
                <button
                    type="button" // Penting agar tidak submit form utama
                    onClick={onAddTag}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-md transition-colors h-[46px]" // Sesuaikan tinggi jika perlu
                    aria-label="Tambah Tag"
                >
                    <FaPlus size={20}/>
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
                {Array.isArray(data.tagline) && data.tagline.map((tag, index) => (
                <span key={index} className="flex items-center bg-sky-600/80 text-sm px-3 py-1.5 rounded-full text-sky-100">
                    {tag}
                    <button type="button" onClick={() => onRemoveTag(tag)} className="ml-2 text-sky-100 hover:text-white" aria-label={`Hapus tag ${tag}`}>
                    <FaTimes size={12} />
                    </button>
                </span>
                ))}
            </div>
        </div>


        <div>
          <label htmlFor={isEditMode ? "edit_project_github" : "project_github"} className="block mb-1 text-sm font-medium text-slate-300">Link GitHub (Opsional)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaGithub className="text-slate-400" />
            </div>
            <input
                type="url"
                name="github"
                id={isEditMode ? "edit_project_github" : "project_github"}
                value={data.github}
                onChange={onChange}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://github.com/user/repo"
            />
          </div>
        </div>
        <div>
          <label htmlFor={isEditMode ? "edit_project_detail_link" : "project_detail_link"} className="block mb-1 text-sm font-medium text-slate-300">Link Detail/Live (Opsional)</label>
           <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLink className="text-slate-400" />
            </div>
            <input
                type="url"
                name="detail_link"
                id={isEditMode ? "edit_project_detail_link" : "project_detail_link"}
                value={data.detail_link}
                onChange={onChange}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://proyek-live.com"
            />
           </div>
        </div>

        <div>
          <label htmlFor={isEditMode ? "edit_project_start_month" : "project_start_month"} className="block mb-1 text-sm font-medium text-slate-300">Mulai (Bulan & Tahun)</label>
          <input
            type="month"
            name="start_month"
            id={isEditMode ? "edit_project_start_month" : "project_start_month"}
            value={data.start_month}
            onChange={handleMonthInputChange}
            className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
            <label htmlFor={isEditMode ? "edit_project_end_month" : "project_end_month"} className="block mb-1 text-sm font-medium text-slate-300">Selesai (Bulan & Tahun)</label>
            <input
                type="month"
                name="end_month"
                id={isEditMode ? "edit_project_end_month" : "project_end_month"}
                value={data.is_present || data.end_month === 'Present' ? '' : data.end_month}
                onChange={handleMonthInputChange}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-600 disabled:text-slate-400"
                disabled={data.is_present}
                required={!data.is_present}
            />
            <div className="mt-2">
                <input
                    type="checkbox"
                    name="is_present"
                    id={isEditMode ? "edit_project_is_present" : "project_is_present"}
                    checked={data.is_present}
                    onChange={onChange}
                    className="mr-2 h-4 w-4 rounded text-indigo-500 focus:ring-indigo-400 border-slate-500 bg-slate-700"
                />
                <label htmlFor={isEditMode ? "edit_project_is_present" : "project_is_present"} className="text-sm text-slate-300 select-none">Masih berlangsung (Present)</label>
            </div>
        </div>
      </div>
    </>
  );
});


const ProjectAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    project_name: '', description: '', tagline: [], github: '', detail_link: '',
    start_month: '', end_month: '', is_present: false,
  });
  const [editingProject, setEditingProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State untuk input tag saat ini (dipisah untuk form Add dan Edit)
  const [currentNewTag, setCurrentNewTag] = useState('');
  const [currentEditTag, setCurrentEditTag] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = useCallback(() => { setTimeout(() => { setError(''); setSuccessMessage(''); }, 4000); }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('project') // GANTI NAMA TABEL
        .select('*')
        .order('start_month', { ascending: false }); 

      if (fetchError) throw fetchError;
      setProjects(data || []);
    } catch (err) {
      console.error("Error fetching project data:", err);
      setError(`Gagal memuat data proyek: ${err.message}`);
      clearMessages();
    } finally { setLoading(false); }
  }, [clearMessages]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  // Handler untuk field standar
  const HandleStandardInputChange = (setter) => useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setter(prev => {
      if (!prev) return null; // Untuk editingProject yang bisa null
      if (name === 'is_present') {
        return { ...prev, is_present: checked, end_month: checked ? 'Present' : (prev.end_month === 'Present' ? '' : prev.end_month) };
      } else if (type === 'month') {
        return { ...prev, [name]: value }; 
      }
      // Untuk deskripsi (string tunggal) dan field lain
      return { ...prev, [name]: type === 'checkbox' ? checked : value };
    });
  }, [setter]);

  const handleNewProjectChange = HandleStandardInputChange(setNewProject);
  const handleEditProjectChange = HandleStandardInputChange(setEditingProject);

  // Handlers untuk Tagline pada form Add New Project
  const handleAddCurrentNewTag = useCallback(() => {
    if (currentNewTag && !newProject.tagline.includes(currentNewTag.trim())) {
      setNewProject(prev => ({ ...prev, tagline: [...prev.tagline, currentNewTag.trim()] }));
      setCurrentNewTag('');
    }
  }, [currentNewTag, newProject.tagline]);

  const handleRemoveNewTag = useCallback((tagToRemove) => {
    setNewProject(prev => ({ ...prev, tagline: prev.tagline.filter(tag => tag !== tagToRemove) }));
  }, []);

  // Handlers untuk Tagline pada form Edit Project (Modal)
   const handleAddCurrentEditTag = useCallback(() => {
    if (currentEditTag && editingProject && !editingProject.tagline.includes(currentEditTag.trim())) {
      setEditingProject(prev => ({ ...prev, tagline: [...prev.tagline, currentEditTag.trim()] }));
      setCurrentEditTag('');
    }
  }, [currentEditTag, editingProject]);

  const handleRemoveEditTag = useCallback((tagToRemove) => {
    setEditingProject(prev => {
      if (!prev) return null;
      return { ...prev, tagline: prev.tagline.filter(tag => tag !== tagToRemove) };
    });
  }, []);


  const resetNewProjectForm = () => {
    setNewProject({
      project_name: '', description: '', tagline: [], github: '', detail_link: '',
      start_month: '', end_month: '', is_present: false,
    });
    setCurrentNewTag('');
  };

  const handleAddProject = async (e) => {
    e.preventDefault(); setSaving(true); setError(''); setSuccessMessage('');
    const dataToSave = { ...newProject };
    if (dataToSave.is_present) dataToSave.end_month = 'Present';
    delete dataToSave.is_present;

    try {
      const { error: insertError } = await supabase.from('project').insert(dataToSave); // GANTI NAMA TABEL
      if (insertError) throw insertError;
      setSuccessMessage('Data proyek berhasil ditambahkan!');
      resetNewProjectForm(); fetchProjects();
    } catch (err) {
      console.error("Error adding project:", err);
      setError(`Gagal menambahkan data: ${err.message}`);
    } finally { setSaving(false); clearMessages(); }
  };

  const openEditModal = (proj) => {
    const isPresent = proj.end_month === 'Present';
    setEditingProject({ 
        ...proj, 
        tagline: Array.isArray(proj.tagline) ? proj.tagline : [], // Pastikan tagline adalah array
        description: proj.description || '', // Pastikan deskripsi tidak null
        is_present: isPresent 
    });
    setCurrentEditTag(''); // Reset input tag untuk modal
    setIsModalOpen(true);
  };

  const closeEditModal = () => { setEditingProject(null); setIsModalOpen(false); setCurrentEditTag(''); };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!editingProject || !editingProject.id) return;
    setSaving(true); setError(''); setSuccessMessage('');
    const { id, ...dataToUpdateWithoutId } = editingProject;
    const dataToUpdate = { ...dataToUpdateWithoutId };

    if (dataToUpdate.is_present) dataToUpdate.end_month = 'Present';
    delete dataToUpdate.is_present;

    try {
      const { error: updateError } = await supabase
        .from('project') // GANTI NAMA TABEL
        .update(dataToUpdate)
        .eq('id', id);
      if (updateError) throw updateError;
      setSuccessMessage('Data proyek berhasil diperbarui!');
      closeEditModal(); fetchProjects();
    } catch (err) {
      console.error("Error updating project:", err);
      setError(`Gagal memperbarui data: ${err.message}`);
    } finally { setSaving(false); clearMessages(); }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data proyek ini?")) return;
    setDeleting(true); setError(''); setSuccessMessage('');
    try {
      const { error: deleteError } = await supabase.from('project').delete().eq('id', id); // GANTI NAMA TABEL
      if (deleteError) throw deleteError;
      setSuccessMessage('Data proyek berhasil dihapus!');
      fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
      setError(`Gagal menghapus data: ${err.message}`);
    } finally { setDeleting(false); clearMessages(); }
  };

  if (loading) { /* ... Tampilan loading ... */ }

  return (
    <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200">
      <div className="max-w mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-400">Pengaturan Proyek</h1>

        {error && <div className="mb-6 p-3 bg-red-500/30 text-red-300 rounded-md text-sm">{error}</div>}
        {successMessage && <div className="mb-6 p-3 bg-green-500/30 text-green-300 rounded-md text-sm">{successMessage}</div>}

        <form onSubmit={handleAddProject} className="mb-10 p-6 bg-slate-800 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-6 text-indigo-300">Tambah Proyek Baru</h2>
          <ProjectFormFields 
            data={newProject} 
            onChange={handleNewProjectChange}
            currentTagValue={currentNewTag}
            onCurrentTagChange={(e) => setCurrentNewTag(e.target.value)}
            onAddTag={handleAddCurrentNewTag}
            onRemoveTag={handleRemoveNewTag}
          />
          <div className="mt-6 text-right">
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
              {saving ? 'Menyimpan...' : <><FaPlus className="inline mr-2" /> Tambah Proyek</>}
            </button>
          </div>
        </form>

        <div className="bg-slate-800 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-indigo-300">Daftar Proyek</h2>
            {projects.length === 0 && !loading ? ( <p className="text-slate-400">Belum ada data proyek.</p> ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-indigo-300 uppercase bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nama Proyek</th>
                            <th scope="col" className="px-6 py-3 hidden sm:table-cell">Tagline</th>
                            <th scope="col" className="px-6 py-3">Periode</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((proj) => ( 
                        <tr key={proj.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-100 whitespace-nowrap">{proj.project_name}</td>
                            <td className="px-6 py-4 hidden sm:table-cell">
                                {Array.isArray(proj.tagline) && proj.tagline.slice(0, 3).join(', ')}
                                {Array.isArray(proj.tagline) && proj.tagline.length > 3 ? '...' : ''}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {formatDateToNamaBulanTahun(proj.start_month)} - {formatDateToNamaBulanTahun(proj.end_month)}
                            </td>
                            <td className="px-6 py-4 text-center">
                            <button onClick={() => openEditModal(proj)} className="font-medium text-indigo-400 hover:text-indigo-300 mr-3 p-1" aria-label="Edit"> <FaEdit size={16}/> </button>
                            <button onClick={() => handleDeleteProject(proj.id)} disabled={deleting} className="font-medium text-red-500 hover:text-red-400 p-1 disabled:opacity-50" aria-label="Hapus"> <FaTrash size={16}/> </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>

        {isModalOpen && editingProject && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-indigo-300">Edit Proyek</h2>
                <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-200 p-1" aria-label="Tutup modal"> <FaTimes size={24} /> </button>
              </div>
              <form onSubmit={handleUpdateProject}>
                <ProjectFormFields 
                    data={editingProject} 
                    onChange={handleEditProjectChange} 
                    isEditMode={true}
                    currentTagValue={currentEditTag}
                    onCurrentTagChange={(e) => setCurrentEditTag(e.target.value)}
                    onAddTag={handleAddCurrentEditTag}
                    onRemoveTag={handleRemoveEditTag}
                />
                <div className="mt-8 flex justify-end gap-3">
                  <button type="button" onClick={closeEditModal} className="px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium rounded-lg transition-colors"> Batal </button>
                  <button type="submit" disabled={saving} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
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

export default ProjectAdmin;