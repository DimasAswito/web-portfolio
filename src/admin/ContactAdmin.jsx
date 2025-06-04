import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient'; // Pastikan path ini benar
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaInstagram, FaFacebook, FaLink, FaSave } from 'react-icons/fa';

const ContactAdmin = () => {
  const [formData, setFormData] = useState({
    id: null, // Untuk menyimpan ID record kontak
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    instagram: '',
    facebook: '',
    linktree: ''
  });
  const [initialData, setInitialData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = useCallback(() => {
    setTimeout(() => {
      setError('');
      setSuccessMessage('');
    }, 4000);
  }, []);

  const fetchContactData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Asumsi hanya ada satu baris data kontak, atau ambil yang pertama/terbaru
      const { data, error: fetchError } = await supabase
        .from('contact')
        .select('*')
        .limit(1) // Ambil satu baris saja
        .single(); // Gunakan single jika Anda yakin hanya ada 1 record atau error jika tidak ada/lebih dari 1

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
        throw fetchError;
      }

      if (data) {
        setFormData({
          id: data.id,
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          linktree: data.linktree || ''
        });
        setInitialData(JSON.parse(JSON.stringify({ // Deep copy
          id: data.id,
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          linktree: data.linktree || ''
        })));
      } else {
        // Jika tidak ada data, biarkan form kosong atau set default
        const defaultEmptyData = {
            id: null, email: '', phone: '', location: '', linkedin: '',
            github: '', instagram: '', facebook: '', linktree: ''
        };
        setFormData(defaultEmptyData);
        setInitialData(JSON.parse(JSON.stringify(defaultEmptyData)));
        console.warn("No contact data found in Supabase. Form is empty.");
      }
    } catch (err) {
      console.error("Error fetching contact data:", err);
      setError(`Gagal memuat data kontak: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContactData();
  }, [fetchContactData]);

  const hasChanged = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'phone') {
      // Hapus semua kecuali digit dan '+'
      let phoneValue = value.replace(/[^\d+]/g, '');
      if (phoneValue.startsWith('08')) {
        phoneValue = '+62' + phoneValue.substring(1);
      } else if (phoneValue.startsWith('8') && !phoneValue.startsWith('+62') && !phoneValue.startsWith('+')) {
        // Jika dimulai dengan 8 (dan bukan +628 atau +8), tambahkan +62
        phoneValue = '+62' + phoneValue;
      }
      // Batasi agar tidak terlalu panjang dan hanya format yang diharapkan
      // Untuk simple, kita biarkan validasi lebih lanjut di backend atau saat submit
      processedValue = phoneValue;
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (successMessage) setSuccessMessage('');
    if (error) setError('');
  };

  const handleUpdateContact = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    const { id, ...dataToUpdate } = formData;

    // Normalisasi akhir nomor telepon sebelum simpan, jika diperlukan
    if (dataToUpdate.phone && !dataToUpdate.phone.startsWith('+62')) {
        if (dataToUpdate.phone.startsWith('0')) {
            dataToUpdate.phone = '+62' + dataToUpdate.phone.substring(1);
        } else if (dataToUpdate.phone.startsWith('8')) {
            dataToUpdate.phone = '+62' + dataToUpdate.phone;
        } else {
            // Jika format tidak dikenali, mungkin tampilkan error atau biarkan
            // Untuk sekarang, kita asumsikan input sudah cukup baik atau user akan perbaiki
        }
    }


    if (!id && initialData && initialData.id === null) {
        // Ini adalah kasus di mana record kontak belum ada sama sekali (insert baru)
         try {
            const { data: insertedData, error: upsertError } = await supabase
                .from('contact')
                .insert(dataToUpdate) // Menggunakan insert karena belum ada ID
                .select()
                .single(); 
            
            if (upsertError) throw upsertError;
            
            setSuccessMessage('Data kontak berhasil disimpan!');
             if(insertedData){
                const newData = { ...formData, id: insertedData.id };
                setFormData(newData);
                setInitialData(JSON.parse(JSON.stringify(newData)));
            } else {
                 fetchContactData(); // fetch ulang untuk dapat ID baru jika insert
            }
        } catch (err) {
            console.error("Gagal menyimpan data kontak baru:", err);
            setError(`Gagal menyimpan data: ${err.message}`);
        } finally {
            setSaving(false);
            clearMessages();
        }
    } else if (id) {
        // Ini adalah kasus update record yang sudah ada
        try {
            const { error: updateError } = await supabase
                .from('contact')
                .update(dataToUpdate)
                .eq('id', id);

            if (updateError) throw updateError;
            
            setSuccessMessage('Data kontak berhasil diperbarui!');
            setInitialData(JSON.parse(JSON.stringify(formData))); // Update initialData
        } catch (err) {
            console.error("Gagal memperbarui data kontak:", err);
            setError(`Gagal memperbarui data: ${err.message}`);
        } finally {
            setSaving(false);
            clearMessages();
        }
    } else {
        setError('Tidak ada ID data kontak untuk diperbarui atau dibuat.');
        setSaving(false);
        clearMessages();
    }
  };
  
  const InputField = ({ id, name, type = "text", label, value, onChange, placeholder, icon, helpText }) => (
    <div>
      <label htmlFor={id} className="block mb-1 text-sm font-medium text-slate-300">{label}</label>
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          type={type}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          className={`w-full ${icon ? 'pl-10' : 'px-3'} py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          placeholder={placeholder}
        />
      </div>
      {helpText && <p className="mt-1 text-xs text-slate-400">{helpText}</p>}
    </div>
  );


  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200 flex justify-center items-center">
        <p className="text-xl">Memuat data Kontak...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200">
      <div className="max-w mx-auto">
        <form
          className="bg-slate-800/90 backdrop-filter backdrop-blur-md shadow-2xl rounded-xl p-6 md:p-8"
          onSubmit={handleUpdateContact}
        >
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-2 text-indigo-400">
              Pengaturan Informasi Kontak
            </h3>
            <p className="text-sm text-slate-400">
              Perbarui detail kontak yang akan ditampilkan di website Anda.
            </p>
          </div>

          {error && <div className="mb-6 p-3 bg-red-500/30 text-red-300 rounded-md text-sm">{error}</div>}
          {successMessage && <div className="mb-6 p-3 bg-green-500/30 text-green-300 rounded-md text-sm">{successMessage}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <InputField
              id="email" name="email" type="email" label="Email"
              value={formData.email} onChange={handleChange}
              placeholder="kontak@email.com"
              icon={<FaEnvelope className="text-slate-400" />}
            />
            <InputField
              id="phone" name="phone" type="tel" label="Nomor Telepon (WhatsApp)"
              value={formData.phone} onChange={handleChange}
              placeholder="+6281234567890"
              icon={<FaPhone className="text-slate-400" />}
              helpText="Awali dengan +62 untuk integrasi WhatsApp (misal: +62812...)."
            />
            <div className="md:col-span-2">
                <InputField
                id="location" name="location" label="Lokasi"
                value={formData.location} onChange={handleChange}
                placeholder="Kota, Negara"
                icon={<FaMapMarkerAlt className="text-slate-400" />}
                />
            </div>
             <InputField
              id="linkedin" name="linkedin" type="url" label="LinkedIn URL"
              value={formData.linkedin} onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              icon={<FaLinkedin className="text-slate-400" />}
            />
             <InputField
              id="github" name="github" type="url" label="GitHub URL"
              value={formData.github} onChange={handleChange}
              placeholder="https://github.com/username"
              icon={<FaGithub className="text-slate-400" />}
            />
             <InputField
              id="instagram" name="instagram" type="url" label="Instagram URL"
              value={formData.instagram} onChange={handleChange}
              placeholder="https://instagram.com/username"
              icon={<FaInstagram className="text-slate-400" />}
            />
             <InputField
              id="facebook" name="facebook" type="url" label="Facebook URL"
              value={formData.facebook} onChange={handleChange}
              placeholder="https://facebook.com/username"
              icon={<FaFacebook className="text-slate-400" />}
            />
            <div className="md:col-span-2">
                <InputField
                id="linktree" name="linktree" type="url" label="Linktree URL (atau link bio lainnya)"
                value={formData.linktree} onChange={handleChange}
                placeholder="https://linktr.ee/username"
                icon={<FaLink className="text-slate-400" />}
                />
            </div>
          </div>

          <div className="col-span-full pt-8 mt-6 border-t border-slate-700">
            <button
              type="submit"
              disabled={saving || !hasChanged}
              className="w-full sm:w-auto rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {saving ? "Menyimpan..." : <><FaSave className="inline mr-2" /> Perbarui Kontak</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactAdmin;