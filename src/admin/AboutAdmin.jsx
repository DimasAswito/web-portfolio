import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient'; 
import { FaPlus, FaTrash, FaSync } from 'react-icons/fa';


const AboutAdmin = () => {
  const [aboutData, setAboutData] = useState({
    id: null,
    description: [],
    tag: [],
    tech_stack: [],
  });
  const [initialData, setInitialData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [currentTag, setCurrentTag] = useState('');

  const fetchAboutData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .maybeSingle(); 

      if (error) throw error;

      if (data) {
        const fetched = {
          id: data.id,
          description: data.description || [],
          tag: data.tag || [],
          tech_stack: (Array.isArray(data.tech_stack) ? data.tech_stack : []).map(tech => ({ name: tech.name || '', logo_url: tech.logo_url || '' })),
        };
        setAboutData(fetched);
        setInitialData(JSON.parse(JSON.stringify(fetched))); 
      } else {
        const emptyData = {
          id: null, 
          description: [],
          tag: [],
          tech_stack: []
        }
        setAboutData(emptyData);
        setInitialData(JSON.parse(JSON.stringify(emptyData)));
      }
    } catch (err) {
      console.error("Error fetching about data:", err);
      setError(`Gagal memuat data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutData();
  }, [fetchAboutData]);

  const hasChanged = JSON.stringify(aboutData) !== JSON.stringify(initialData);

  const handleDescriptionChange = (e) => {
    setAboutData(prev => ({ ...prev, description: e.target.value.split('\n') }));
  };

  const handleAddTag = () => {
    if (currentTag && !aboutData.tag.includes(currentTag.trim())) {
      setAboutData(prev => ({ ...prev, tag: [...prev.tag, currentTag.trim()] }));
      setCurrentTag('');
    }
  };

  const handleTagInputChange = (e) => {
    setCurrentTag(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setAboutData(prev => ({ ...prev, tag: prev.tag.filter(tag => tag !== tagToRemove) }));
  };

  // --- HANDLER UNTUK TECH STACK (BAGIAN BARU) ---
  const generateDeviconUrl = (name) => {
    if (!name) return '';
    const formattedName = name.toLowerCase()
                              .replace(/\s/g, '') // Hapus spasi (e.g., "Node.js" -> "nodejs")
                              .replace(/\./g, ''); // Hapus titik
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${formattedName}/${formattedName}-original.svg`;
  };

  const handleTechStackChange = (index, field, value) => {
    const updatedTechStack = [...aboutData.tech_stack];
    updatedTechStack[index] = { ...updatedTechStack[index], [field]: value };

    // Jika field 'name' yang berubah, coba generate ulang URL logo secara otomatis
    if (field === 'name') {
      updatedTechStack[index].logo_url = generateDeviconUrl(value);
    }

    setAboutData(prev => ({ ...prev, tech_stack: updatedTechStack }));
  };

  const handleAddTechStack = () => {
    setAboutData(prev => ({ ...prev, tech_stack: [...prev.tech_stack, { name: '', logo_url: '' }] }));
  };

  const handleRemoveTechStack = (index) => {
    const updatedTechStack = aboutData.tech_stack.filter((_, i) => i !== index);
    setAboutData(prev => ({ ...prev, tech_stack: updatedTechStack }));
  };

  // Simpan Perubahan
  const handleSaveChanges = async () => {
    setSaving(true);
    setError('');
    setSuccessMessage('');

    const dataToSave = { ...aboutData };
    // Jika id ada, ini akan menjadi update. Jika id null (kasus data baru), ini akan jadi insert.
    // Supabase upsert akan menangani ini jika primary key (id) ada.
    // Jika id belum ada dan tabel about Anda memerlukan id yang unik (misal UUID),
    // Anda mungkin perlu generate id di sini sebelum menyimpan data baru.
    // Untuk kesederhanaan, kita asumsikan 'id' sudah ada atau akan di-handle oleh Supabase (misal auto-increment/trigger)
    // atau kita ambil dari data yang sudah ada.

    try {
      const { error: saveError } = await supabase
        .from('about')
        .upsert({ ...dataToSave, tech_stack: aboutData.tech_stack }, { onConflict: 'id' });

      if (saveError) throw saveError;
      setSuccessMessage('Data berhasil disimpan!');
      setInitialData(JSON.parse(JSON.stringify(aboutData)));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Error saving about data:", err);
      setError(`Gagal menyimpan data: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return <div className="p-6 text-center">Memuat data...</div>;
  }

  return (
    <div className="bg-dark/70 backdrop-filter backdrop-blur-sm shadow-xl rounded-xl p-6 md:p-8 w-full mx-auto">
      <div className="mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-indigo-400">About</h3>

        {error && <div className="mb-4 p-3 bg-red-500/30 text-red-300 rounded-md">{error}</div>}
        {successMessage && <div className="mb-4 p-3 bg-green-500/30 text-green-300 rounded-md">{successMessage}</div>}

        {/* Description Section */}
        <div className="mb-8 p-6 bg-slate-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">Deskripsi</h2>
          <textarea
            rows="5"
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
            placeholder="Masukkan deskripsi per paragraf. Tekan Enter untuk paragraf baru."
            value={aboutData.description.join('\n')}
            onChange={handleDescriptionChange}
          />
          <p className="text-xs text-slate-400 mt-1">Setiap baris baru akan dianggap sebagai paragraf terpisah.</p>
        </div>

        {/* tag Section */}
        <div className="mb-8 p-6 bg-slate-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">Tag</h2>
          <div className="flex items-center mb-4">
            <input
              type="text"
              className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-l-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
              placeholder="Ketik tag baru lalu Enter"
              value={currentTag}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
            />
            <button
              onClick={handleAddTag}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-md transition-colors"
              aria-label="Tambah Tag"
            >
              <FaPlus size={20}/>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {aboutData.tag.map((tag, index) => (
              <span key={index} className="flex items-center bg-indigo-500/80 text-sm px-3 py-1.5 rounded-full">
                {tag}
                <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-indigo-100 hover:text-white" aria-label={`Hapus tag ${tag}`}>
                  <FaTrash size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

{/* === BAGIAN TECH STACK (PENGGANTI SKILL) === */}
        <div className="mb-8 p-6 bg-slate-800 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-indigo-300">Tech Stack</h2>
            <button
              onClick={handleAddTechStack}
              className="flex items-center p-2 bg-green-600 hover:bg-green-500 text-white rounded-md text-sm transition-colors"
            >
              <FaPlus className="mr-1" /> Tambah Teknologi
            </button>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Ketik nama teknologi (e.g., 'react', 'nodejs', 'tailwind css'), URL logo akan terisi otomatis. Jika gambar tidak muncul atau salah, Anda bisa mengubah URL logo secara manual.
          </p>
          <div className="space-y-4">
            {aboutData.tech_stack.map((tech, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-center p-3 bg-slate-700/50 rounded-md">
                
                {/* Input Nama Teknologi */}
                <input
                  type="text"
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="Nama Teknologi"
                  value={tech.name}
                  onChange={(e) => handleTechStackChange(index, 'name', e.target.value)}
                />

                {/* Input URL Logo (Bisa diedit manual) */}
                <div className="flex items-center gap-2">
                    <input
                        type="url"
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                        placeholder="URL Logo"
                        value={tech.logo_url}
                        onChange={(e) => handleTechStackChange(index, 'logo_url', e.target.value)}
                    />
                    {/* Tombol untuk refresh/regenerate URL berdasarkan nama */}
                    <button type="button" onClick={() => handleTechStackChange(index, 'logo_url', generateDeviconUrl(tech.name))} className="p-2 text-slate-300 hover:text-white" title="Generate ulang URL dari nama">
                        <FaSync />
                    </button>
                    {tech.logo_url && (
                        <img src={tech.logo_url} alt={tech.name} className="h-8 w-8 object-contain bg-white/10 rounded p-1" onError={(e) => { e.target.style.display = 'none'; }} onLoad={(e) => { e.target.style.display = 'block'; }} />
                    )}
                </div>

                {/* Tombol Hapus */}
                <button
                  onClick={() => handleRemoveTechStack(index)}
                  className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-md flex justify-center items-center transition-colors"
                  aria-label={`Hapus ${tech.name}`}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* === AKHIR BAGIAN TECH STACK === */}

        {/* Save Button */}
        <div className="mt-10 text-right">
          <button
            onClick={handleSaveChanges}
            disabled={saving || !hasChanged}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutAdmin;