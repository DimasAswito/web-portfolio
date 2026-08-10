import React, { useState, useEffect, useCallback, memo } from 'react';
import { supabase } from '../supabaseClient';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const SkillFormFields = memo(({ data, onChange, isEditMode = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
      <div>
        <label htmlFor={isEditMode ? "edit_skill_name" : "skill_name"} className="block mb-1 text-sm font-medium text-slate-300">Nama Skill</label>
        <input
          type="text"
          name="name"
          id={isEditMode ? "edit_skill_name" : "skill_name"}
          value={data.name}
          onChange={onChange}
          className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Contoh: React"
          required
        />
      </div>
      <div>
        <label htmlFor={isEditMode ? "edit_skill_level" : "skill_level"} className="block mb-1 text-sm font-medium text-slate-300">Level (0-100)</label>
        <input
          type="number"
          name="level"
          min="0"
          max="100"
          id={isEditMode ? "edit_skill_level" : "skill_level"}
          value={data.level}
          onChange={onChange}
          className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Contoh: 85"
          required
        />
      </div>
      <div>
        <label htmlFor={isEditMode ? "edit_skill_category" : "skill_category"} className="block mb-1 text-sm font-medium text-slate-300">Kategori (Opsional)</label>
        <input
          type="text"
          name="category"
          id={isEditMode ? "edit_skill_category" : "skill_category"}
          value={data.category}
          onChange={onChange}
          className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Contoh: Frontend"
        />
      </div>
    </div>
  );
});

const SkillAdmin = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', level: 50, category: '' });
  const [editingSkill, setEditingSkill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = useCallback(() => { setTimeout(() => { setError(''); setSuccessMessage(''); }, 4000); }, []);

  const fetchSkills = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('skill')
        .select('*')
        .order('level', { ascending: false });

      if (fetchError) throw fetchError;
      setSkills(data || []);
    } catch (err) {
      console.error("Error fetching skill data:", err);
      setError(`Gagal memuat data skill: ${err.message}`);
      clearMessages();
    } finally { setLoading(false); }
  }, [clearMessages]);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const handleNewSkillChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setNewSkill(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  }, []);

  const handleEditSkillChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setEditingSkill(prev => prev ? ({ ...prev, [name]: type === 'number' ? Number(value) : value }) : null);
  }, []);

  const resetNewSkillForm = () => setNewSkill({ name: '', level: 50, category: '' });

  const handleAddSkill = async (e) => {
    e.preventDefault(); setSaving(true); setError(''); setSuccessMessage('');
    try {
      const { error: insertError } = await supabase.from('skill').insert(newSkill);
      if (insertError) throw insertError;
      setSuccessMessage('Skill berhasil ditambahkan!');
      resetNewSkillForm(); fetchSkills();
    } catch (err) {
      console.error("Error adding skill:", err);
      setError(`Gagal menambahkan skill: ${err.message}`);
    } finally { setSaving(false); clearMessages(); }
  };

  const openEditModal = (skill) => { setEditingSkill({ ...skill }); setIsModalOpen(true); };
  const closeEditModal = () => { setEditingSkill(null); setIsModalOpen(false); };

  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.id) return;
    setSaving(true); setError(''); setSuccessMessage('');
    const { id, ...dataToUpdate } = editingSkill;
    try {
      const { error: updateError } = await supabase
        .from('skill')
        .update(dataToUpdate)
        .eq('id', id);
      if (updateError) throw updateError;
      setSuccessMessage('Skill berhasil diperbarui!');
      closeEditModal(); fetchSkills();
    } catch (err) {
      console.error("Error updating skill:", err);
      setError(`Gagal memperbarui skill: ${err.message}`);
    } finally { setSaving(false); clearMessages(); }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus skill ini?")) return;
    setDeleting(true); setError(''); setSuccessMessage('');
    try {
      const { error: deleteError } = await supabase.from('skill').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setSuccessMessage('Skill berhasil dihapus!');
      fetchSkills();
    } catch (err) {
      console.error("Error deleting skill:", err);
      setError(`Gagal menghapus skill: ${err.message}`);
    } finally { setDeleting(false); clearMessages(); }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200 flex justify-center items-center">
        <p className="text-xl">Memuat data skill...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200">
      <div className="max-w mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-400">Pengaturan Skill</h1>

        {error && <div className="mb-6 p-3 bg-red-500/30 text-red-300 rounded-md text-sm">{error}</div>}
        {successMessage && <div className="mb-6 p-3 bg-green-500/30 text-green-300 rounded-md text-sm">{successMessage}</div>}

        <form onSubmit={handleAddSkill} className="mb-10 p-6 bg-slate-800 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-6 text-indigo-300">Tambah Skill Baru</h2>
          <SkillFormFields data={newSkill} onChange={handleNewSkillChange} />
          <div className="mt-6 text-right">
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
              {saving ? 'Menyimpan...' : <><FaPlus className="inline mr-2" /> Tambah Skill</>}
            </button>
          </div>
        </form>

        <div className="bg-slate-800 rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-6 text-indigo-300">Daftar Skill</h2>
          {skills.length === 0 ? (
            <p className="text-slate-400">Belum ada data skill.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-indigo-300 uppercase bg-slate-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Nama Skill</th>
                    <th scope="col" className="px-6 py-3 hidden sm:table-cell">Kategori</th>
                    <th scope="col" className="px-6 py-3">Level</th>
                    <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((skill) => (
                    <tr key={skill.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-100 whitespace-nowrap">{skill.name}</td>
                      <td className="px-6 py-4 hidden sm:table-cell">{skill.category || '-'}</td>
                      <td className="px-6 py-4">{skill.level}%</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => openEditModal(skill)} className="font-medium text-indigo-400 hover:text-indigo-300 mr-3 p-1" aria-label="Edit"><FaEdit size={16}/></button>
                        <button onClick={() => handleDeleteSkill(skill.id)} disabled={deleting} className="font-medium text-red-500 hover:text-red-400 p-1 disabled:opacity-50" aria-label="Hapus"><FaTrash size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {isModalOpen && editingSkill && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-indigo-300">Edit Skill</h2>
                <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-200 p-1" aria-label="Tutup modal"><FaTimes size={24} /></button>
              </div>
              <form onSubmit={handleUpdateSkill}>
                <SkillFormFields data={editingSkill} onChange={handleEditSkillChange} isEditMode={true} />
                <div className="mt-8 flex justify-end gap-3">
                  <button type="button" onClick={closeEditModal} className="px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium rounded-lg transition-colors">Batal</button>
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

export default SkillAdmin;
