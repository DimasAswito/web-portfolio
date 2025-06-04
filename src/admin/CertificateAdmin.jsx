import React, { useState, useEffect, useCallback, memo } from 'react';
import { supabase } from '../supabaseClient'; // Pastikan path ini benar
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCertificate, FaTag, FaLink, FaCalendarAlt, FaImage, FaUpload } from 'react-icons/fa';

// Helper function untuk format tanggal (tetap sama)
const formatDateToNamaBulanTahun = (dateStringYyyyMm) => {
  if (!dateStringYyyyMm || dateStringYyyyMm === 'Present') { // 'Present' tidak relevan di sini, tapi jaga-jaga
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

// Komponen Form untuk Sertifikat
const CertificateFormFields = memo(({
  data,
  onChange, // Untuk field standar
  isEditMode = false,
  currentTagValue,
  onCurrentTagChange,
  onAddTag,
  onRemoveTag,
  onImageFileChange, // Handler untuk perubahan file gambar
  imagePreviewUrl, // URL untuk preview gambar yang diupload/ada
  isUploadingImage // Status upload gambar
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"> {/* Gap y ditambah */}
        <div className="md:col-span-2">
          <label htmlFor={isEditMode ? "edit_cert_name" : "cert_name"} className="block mb-1 text-sm font-medium text-slate-300">Nama Sertifikat</label>
          <input
            type="text"
            name="certificate_name"
            id={isEditMode ? "edit_cert_name" : "cert_name"}
            value={data.certificate_name}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Contoh: Google Certified Cloud Architect"
            required
          />
        </div>

        {/* Bagian Input Tag (Maks 3) */}
        <div className="md:col-span-2">
            <label htmlFor={isEditMode ? "edit_cert_tag_input" : "cert_tag_input"} className="block mb-1 text-sm font-medium text-slate-300">Tag (Maks. 3, Tekan Enter untuk menambah)</label>
            <div className="flex items-center">
                <input
                    type="text"
                    id={isEditMode ? "edit_cert_tag_input" : "cert_tag_input"}
                    value={currentTagValue}
                    onChange={onCurrentTagChange}
                    onKeyDown={handleTagInputKeyDown}
                    className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-l-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
                    placeholder="Ketik tag (mis: Cloud, Google, AWS)"
                    disabled={Array.isArray(data.tag) && data.tag.length >= 3}
                />
                <button
                    type="button"
                    onClick={onAddTag}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-md transition-colors h-[46px] disabled:bg-slate-500 disabled:cursor-not-allowed"
                    aria-label="Tambah Tag"
                    disabled={Array.isArray(data.tag) && data.tag.length >= 3 || !currentTagValue.trim()}
                >
                    <FaPlus size={20}/>
                </button>
            </div>
            {Array.isArray(data.tag) && data.tag.length >= 3 && (
                <p className="text-xs text-yellow-400 mt-1">Maksimal 3 tag telah tercapai.</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
                {Array.isArray(data.tag) && data.tag.map((tag, index) => (
                <span key={index} className="flex items-center bg-teal-600/80 text-sm px-3 py-1.5 rounded-full text-teal-100">
                    {tag}
                    <button type="button" onClick={() => onRemoveTag(tag)} className="ml-2 text-teal-100 hover:text-white" aria-label={`Hapus tag ${tag}`}>
                    <FaTimes size={12} />
                    </button>
                </span>
                ))}
            </div>
        </div>

        {/* Upload Gambar Sertifikat */}
        <div className="md:col-span-2">
            <label htmlFor={isEditMode ? "edit_cert_img_upload" : "cert_img_upload"} className="block mb-1 text-sm font-medium text-slate-300">Gambar Sertifikat</label>
            <div className="mt-1 flex items-center gap-x-4">
                {imagePreviewUrl && (
                    <img src={imagePreviewUrl} alt="Preview Sertifikat" className="h-20 w-auto object-contain rounded-md bg-slate-700 p-1 border border-slate-600" />
                )}
                 {!imagePreviewUrl && data.img && ( // Jika ada data.img dari DB tapi belum ada preview baru
                    <img src={data.img} alt="Sertifikat Tersimpan" className="h-20 w-auto object-contain rounded-md bg-slate-700 p-1 border border-slate-600" />
                )}
                <input 
                    type="file" 
                    name="img_file" // Beri nama untuk file input
                    id={isEditMode ? "edit_cert_img_upload" : "cert_img_upload"}
                    onChange={onImageFileChange} 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/jpg, image/webp" 
                />
                <label
                    htmlFor={isEditMode ? "edit_cert_img_upload" : "cert_img_upload"}
                    className="cursor-pointer rounded-lg bg-slate-600 px-4 py-2.5 text-sm font-medium text-slate-200 shadow-sm hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {isUploadingImage ? <><FaUpload className="inline mr-2 animate-ping" /> Mengupload...</> : (imagePreviewUrl || data.img ? 'Ganti Gambar' : 'Pilih Gambar')}
                </label>
            </div>
             {isUploadingImage && <p className="text-xs text-slate-400 mt-1">Mohon tunggu...</p>}
        </div>


        <div>
          <label htmlFor={isEditMode ? "edit_cert_link" : "cert_link"} className="block mb-1 text-sm font-medium text-slate-300">Link Verifikasi/Sertifikat (Opsional)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <FaLink className="text-slate-400" /> </div>
            <input
                type="url"
                name="link"
                id={isEditMode ? "edit_cert_link" : "cert_link"}
                value={data.link}
                onChange={onChange}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://credential.net/..."
            />
          </div>
        </div>
        <div>
          <label htmlFor={isEditMode ? "edit_cert_get_month" : "cert_get_month"} className="block mb-1 text-sm font-medium text-slate-300">Tanggal Diperoleh (Bulan & Tahun)</label>
          <input
            type="month"
            name="get_month"
            id={isEditMode ? "edit_cert_get_month" : "cert_get_month"}
            value={data.get_month}
            onChange={handleMonthInputChange}
            className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
      </div>
    </>
  );
});


const CertificateAdmin = () => {
  const [certificates, setCertificates] = useState([]);
  const [newCertificate, setNewCertificate] = useState({
    certificate_name: '', tag: [], img: '', link: '', get_month: '',
  });
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentNewTag, setCurrentNewTag] = useState('');
  const [currentEditTag, setCurrentEditTag] = useState('');
  
  // State untuk preview gambar dan status upload
  const [newImagePreview, setNewImagePreview] = useState('');
  const [editImagePreview, setEditImagePreview] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = useCallback(() => { setTimeout(() => { setError(''); setSuccessMessage(''); }, 4000); }, []);

  const fetchCertificates = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('certificate')
        .select('*')
        .order('get_month', { ascending: false }); 

      if (fetchError) throw fetchError;
      setCertificates(data || []);
    } catch (err) {
      console.error("Error fetching certificate data:", err);
      setError(`Gagal memuat data sertifikat: ${err.message}`);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCertificates(); }, [fetchCertificates]);

  const HandleStandardInputChange = (setter) => useCallback((e) => {
    const { name, value, type } = e.target; // 'checked' tidak relevan di sini
    setter(prev => {
      if (!prev) return null;
      if (type === 'month') {
        return { ...prev, [name]: value }; 
      }
      return { ...prev, [name]: value };
    });
  }, [setter]);

  const handleNewCertificateChange = HandleStandardInputChange(setNewCertificate);
  const handleEditCertificateChange = HandleStandardInputChange(setEditingCertificate);

  // --- Tag Handlers ---
  const addTagLogic = (currentTag, currentTagsArray, maxTags = 3) => {
    if (currentTag && currentTagsArray.length < maxTags && !currentTagsArray.includes(currentTag.trim())) {
      return [...currentTagsArray, currentTag.trim()];
    }
    return currentTagsArray;
  };
  
  const handleAddCurrentNewTag = useCallback(() => {
    setNewCertificate(prev => ({ ...prev, tag: addTagLogic(currentNewTag, prev.tag) }));
    setCurrentNewTag('');
  }, [currentNewTag]);

  const handleRemoveNewTag = useCallback((tagToRemove) => {
    setNewCertificate(prev => ({ ...prev, tag: prev.tag.filter(tag => tag !== tagToRemove) }));
  }, []);

  const handleAddCurrentEditTag = useCallback(() => {
    if (editingCertificate) {
      setEditingCertificate(prev => ({ ...prev, tag: addTagLogic(currentEditTag, prev.tag) }));
      setCurrentEditTag('');
    }
  }, [currentEditTag, editingCertificate]);

  const handleRemoveEditTag = useCallback((tagToRemove) => {
    setEditingCertificate(prev => {
      if (!prev) return null;
      return { ...prev, tag: prev.tag.filter(tag => tag !== tagToRemove) };
    });
  }, []);

  // --- Image Upload Handler ---
  const handleImageUpload = async (file, formType) => {
    if (!file) return;
    setIsUploadingImage(true); setError('');

    const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const filePath = `public/certificate/${fileName}`; // Folder spesifik

    try {
      const { error: uploadError } = await supabase.storage
        .from("portfolio") // Nama bucket
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from("portfolio").getPublicUrl(filePath);
      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Gagal mendapatkan URL publik setelah upload.");
      }
      const publicUrl = publicUrlData.publicUrl;

      if (formType === 'new') {
        setNewCertificate(prev => ({ ...prev, img: publicUrl }));
        setNewImagePreview(publicUrl);
      } else if (formType === 'edit' && editingCertificate) {
        setEditingCertificate(prev => ({ ...prev, img: publicUrl }));
        setEditImagePreview(publicUrl);
      }
      setSuccessMessage("Gambar berhasil diupload.");

    } catch (err) {
      console.error("Image upload error:", err);
      setError("Upload gambar gagal: " + err.message);
    } finally {
      setIsUploadingImage(false);
      clearMessages();
    }
  };


  const resetNewCertificateForm = () => {
    setNewCertificate({
      certificate_name: '', tag: [], img: '', link: '', get_month: '',
    });
    setCurrentNewTag('');
    setNewImagePreview('');
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault(); setSaving(true); setError(''); setSuccessMessage('');
    // Pastikan img URL sudah ada di newCertificate.img sebelum menyimpan
    const dataToSave = { ...newCertificate };

    try {
      const { error: insertError } = await supabase.from('certificate').insert(dataToSave);
      if (insertError) throw insertError;
      setSuccessMessage('Data sertifikat berhasil ditambahkan!');
      resetNewCertificateForm(); fetchCertificates();
    } catch (err) {
      console.error("Error adding certificate:", err);
      setError(`Gagal menambahkan data: ${err.message}`);
    } finally { setSaving(false); clearMessages(); }
  };

  const openEditModal = (cert) => {
    setEditingCertificate({ 
        ...cert, 
        tag: Array.isArray(cert.tag) ? cert.tag : [],
        img: cert.img || ''
    });
    setEditImagePreview(cert.img || ''); // Set preview untuk gambar yang sudah ada
    setCurrentEditTag('');
    setIsModalOpen(true);
  };

  const closeEditModal = () => { setEditingCertificate(null); setIsModalOpen(false); setEditImagePreview(''); setCurrentEditTag('');};

  const handleUpdateCertificate = async (e) => {
    e.preventDefault();
    if (!editingCertificate || !editingCertificate.id) return;
    setSaving(true); setError(''); setSuccessMessage('');
    const { id, ...dataToUpdate } = editingCertificate;

    try {
      const { error: updateError } = await supabase.from('certificate').update(dataToUpdate).eq('id', id);
      if (updateError) throw updateError;
      setSuccessMessage('Data sertifikat berhasil diperbarui!');
      closeEditModal(); fetchCertificates();
    } catch (err) {
      console.error("Error updating certificate:", err);
      setError(`Gagal memperbarui data: ${err.message}`);
    } finally { setSaving(false); clearMessages(); }
  };

  const handleDeleteCertificate = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data sertifikat ini?")) return;
    setDeleting(true); setError(''); setSuccessMessage('');
    try {
      // Tambahan: Hapus gambar dari storage jika ada sebelum hapus record DB
      const certToDelete = certificates.find(c => c.id === id);
      if (certToDelete && certToDelete.img) {
        const GCS_BUCKET_BASE_URL_PART = `https://[PROJECT_ID].supabase.co/storage/v1/object/public/portfolio/`; // Sesuaikan!
        if(certToDelete.img.startsWith(GCS_BUCKET_BASE_URL_PART)) {
            const imagePath = certToDelete.img.replace(GCS_BUCKET_BASE_URL_PART, '');
            if (imagePath && imagePath !== 'public/certificate/') { // Jangan hapus folder
                await supabase.storage.from('portfolio').remove([imagePath]);
            }
        }
      }

      const { error: deleteError } = await supabase.from('certificate').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setSuccessMessage('Data sertifikat berhasil dihapus!');
      fetchCertificates();
    } catch (err) {
      console.error("Error deleting certificate:", err);
      setError(`Gagal menghapus data: ${err.message}`);
    } finally { setDeleting(false); clearMessages(); }
  };


  if (loading) { /* ... Tampilan loading ... */ }

  return (
    <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200">
      <div className="max-w mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-400">Pengaturan Sertifikat</h1>

        {error && <div className="mb-6 p-3 bg-red-500/30 text-red-300 rounded-md text-sm">{error}</div>}
        {successMessage && <div className="mb-6 p-3 bg-green-500/30 text-green-300 rounded-md text-sm">{successMessage}</div>}

        <form onSubmit={handleAddCertificate} className="mb-10 p-6 bg-slate-800 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-6 text-indigo-300">Tambah Sertifikat Baru</h2>
          <CertificateFormFields 
            data={newCertificate} 
            onChange={handleNewCertificateChange}
            currentTagValue={currentNewTag}
            onCurrentTagChange={(e) => setCurrentNewTag(e.target.value)}
            onAddTag={handleAddCurrentNewTag}
            onRemoveTag={handleRemoveNewTag}
            onImageFileChange={(e) => handleImageUpload(e.target.files[0], 'new')}
            imagePreviewUrl={newImagePreview}
            isUploadingImage={isUploadingImage}
          />
          <div className="mt-6 text-right">
            <button type="submit" disabled={saving || isUploadingImage} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
              {saving ? 'Menyimpan...' : <><FaPlus className="inline mr-2" /> Tambah Sertifikat</>}
            </button>
          </div>
        </form>

        <div className="bg-slate-800 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-indigo-300">Daftar Sertifikat</h2>
            {certificates.length === 0 && !loading ? ( <p className="text-slate-400">Belum ada data sertifikat.</p> ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-indigo-300 uppercase bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nama Sertifikat</th>
                            <th scope="col" className="px-6 py-3 hidden sm:table-cell">Tag</th>
                            <th scope="col" className="px-6 py-3">Diperoleh</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Gambar</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificates.map((cert) => ( 
                        <tr key={cert.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-100 whitespace-nowrap">
                                {cert.link ? (
                                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 flex items-center">
                                        <FaCertificate className="mr-2 text-yellow-400" /> {cert.certificate_name}
                                    </a>
                                ) : (
                                    <div className="flex items-center"><FaCertificate className="mr-2 text-slate-400" /> {cert.certificate_name}</div>
                                )}
                            </td>
                            <td className="px-6 py-4 hidden sm:table-cell">
                                {Array.isArray(cert.tag) && cert.tag.map((t, idx) => (
                                    <span key={idx} className="text-xs bg-teal-600/70 text-teal-100 px-2 py-0.5 rounded-full mr-1 mb-1 inline-block">{t}</span>
                                ))}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {formatDateToNamaBulanTahun(cert.get_month)}
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                                {cert.img && (
                                    <a href={cert.img} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                                        <img src={cert.img} alt={cert.certificate_name} className="h-10 w-auto object-contain rounded"/>
                                    </a>
                                )}
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                            <button onClick={() => openEditModal(cert)} className="font-medium text-indigo-400 hover:text-indigo-300 mr-3 p-1" aria-label="Edit"> <FaEdit size={16}/> </button>
                            <button onClick={() => handleDeleteCertificate(cert.id)} disabled={deleting} className="font-medium text-red-500 hover:text-red-400 p-1 disabled:opacity-50" aria-label="Hapus"> <FaTrash size={16}/> </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>

        {isModalOpen && editingCertificate && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-indigo-300">Edit Sertifikat</h2>
                <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-200 p-1" aria-label="Tutup modal"> <FaTimes size={24} /> </button>
              </div>
              <form onSubmit={handleUpdateCertificate}>
                <CertificateFormFields 
                    data={editingCertificate} 
                    onChange={handleEditCertificateChange} 
                    isEditMode={true}
                    currentTagValue={currentEditTag}
                    onCurrentTagChange={(e) => setCurrentEditTag(e.target.value)}
                    onAddTag={handleAddCurrentEditTag}
                    onRemoveTag={handleRemoveEditTag}
                    onImageFileChange={(e) => handleImageUpload(e.target.files[0], 'edit')}
                    imagePreviewUrl={editImagePreview}
                    isUploadingImage={isUploadingImage}
                />
                <div className="mt-8 flex justify-end gap-3">
                  <button type="button" onClick={closeEditModal} className="px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium rounded-lg transition-colors"> Batal </button>
                  <button type="submit" disabled={saving || isUploadingImage} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
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

export default CertificateAdmin;