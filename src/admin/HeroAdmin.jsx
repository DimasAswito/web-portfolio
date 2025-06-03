import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient"; 

export default function HeroAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    photo_url: "",
    id: null,
  });
  const [initialData, setInitialData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from("header")
        .select("*")
        .single(); 

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
            console.warn("No header data found, initializing empty form.");
            const emptyData = { name: "", tagline: "", description: "", photo_url: "", id: null };
            setFormData(emptyData);
            setInitialData(JSON.parse(JSON.stringify(emptyData)));
        } else {
            throw fetchError;
        }
      }

      if (data) {
        const fetchedData = {
          name: data.name || "",
          tagline: data.tagline || "",
          description: data.description || "",
          photo_url: data.photo_url || "",
          id: data.id, 
        };
        setFormData(fetchedData);
        setInitialData(JSON.parse(JSON.stringify(fetchedData))); 
      }
    } catch (err) {
      console.error("Error fetching hero data:", err);
      setError(`Gagal memuat data hero: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hasChanged = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (successMessage) setSuccessMessage('');
    if (error) setError('');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccessMessage('');

    const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const filePath = `public/hero/${fileName}`; 

    try {
      // Cek sesi tidak diperlukan di sini jika RLS storage memperbolehkan upload publik
      // atau jika logic auth sudah dihandle di level atas.
      // Untuk RLS yang aman, biasanya token JWT diperlukan.
      // Supabase client JS v2 otomatis menyertakan token jika user login.

      const { error: uploadError } = await supabase.storage
        .from("portfolio") 
        .upload(filePath, file, {
          upsert: true, // Timpa file jika sudah ada dengan nama yang sama
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath);
      
      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Gagal mendapatkan URL publik setelah upload.");
      }

      const publicUrl = publicUrlData.publicUrl;
      setFormData((prev) => ({ ...prev, photo_url: publicUrl }));
      setSuccessMessage("Foto berhasil diupload.");

    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      setError("Upload gagal: " + uploadError.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setSaving(true);
    setError('');
    setSuccessMessage('');

    const { id, name, tagline, description, photo_url } = formData;

    if (!id && initialData && initialData.id) {
        console.warn("Form data ID is missing, attempting to use initial data ID if available for update.")
    }
    
    const currentId = id || (initialData ? initialData.id : null);

    if (!currentId) {
        const dataToUpsert = { name, tagline, description, photo_url };
        if(currentId) dataToUpsert.id = currentId;

        try {
            const { error: upsertError } = await supabase
              .from("header")
              .upsert(dataToUpsert, { onConflict: 'id' });

            if (upsertError) throw upsertError;

            setSuccessMessage("Data hero berhasil disimpan!");

            const updatedDataForInitial = { ...formData };
            if(!formData.id && dataToUpsert.id) { 
            } else if (!formData.id && currentId) {
                updatedDataForInitial.id = currentId;
            }
            
            setInitialData(JSON.parse(JSON.stringify(updatedDataForInitial)));
            if (!currentId) { 
                fetchData(); 
            }


        } catch (err) {
            console.error("Gagal menyimpan data hero:", err.message);
            setError(`Gagal menyimpan data: ${err.message}`);
        } finally {
            setSaving(false);
        }

    } else {
        try {
            const { error: updateError } = await supabase
              .from("header")
              .update({ name, tagline, description, photo_url })
              .eq("id", currentId);

            if (updateError) throw updateError;

            setSuccessMessage("Data hero berhasil diperbarui!");
            setInitialData(JSON.parse(JSON.stringify(formData)));
        } catch (err) {
            console.error("Gagal memperbarui data hero:", err.message);
            setError(`Gagal memperbarui data: ${err.message}`);
        } finally {
            setSaving(false);
        }
    }
     setTimeout(() => {
        setSuccessMessage('');
        setError('');
    }, 4000);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200 flex justify-center items-center">
        <p className="text-xl">Memuat data Hero...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200">
      <div className="mx-auto"> {/* Sesuaikan max-w jika perlu */}
        <form
          className="bg-slate-800/90 backdrop-filter backdrop-blur-md shadow-2xl rounded-xl p-6 md:p-8"
          onSubmit={handleSubmit}
        >
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-2 text-indigo-400">
              Pengaturan Hero Section
            </h3>
            <p className="text-sm text-slate-400">
              Atur konten yang ditampilkan di bagian hero website Anda.
            </p>
          </div>

          {error && <div className="mb-6 p-3 bg-red-500/30 text-red-300 rounded-md text-sm">{error}</div>}
          {successMessage && <div className="mb-6 p-3 bg-green-500/30 text-green-300 rounded-md text-sm">{successMessage}</div>}

          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-full"> {/* Dibuat full untuk konsistensi, atau sm:col-span-4 */}
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-300">
                Nama Tampilan
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                id="name"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-150"
                placeholder="Nama yang ditampilkan (cth: John Doe)"
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="tagline" className="block mb-2 text-sm font-medium text-slate-300">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                id="tagline"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-150"
                placeholder="Tagline menarik Anda (cth: Web Developer & UI Enthusiast)"
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-slate-300">
                Deskripsi Singkat
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-150"
                placeholder="Deskripsi singkat mengenai diri atau apa yang Anda lakukan"
              ></textarea>
            </div>

            <div className="col-span-full">
              <label htmlFor="photo-upload-hero" className="block mb-2 text-sm font-medium text-slate-300">
                Foto Profil
              </label>
              <div className="mt-1 flex items-center gap-x-4">
                {formData.photo_url ? (
                  <img src={formData.photo_url} alt="Preview" className="h-20 w-20 rounded-lg object-cover bg-slate-700" />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-slate-700 flex items-center justify-center text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                )}
                <div>
                  <input id="photo-upload-hero" name="photo_hero" type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                  <label
                    htmlFor="photo-upload-hero"
                    className="cursor-pointer rounded-lg bg-slate-600 px-4 py-2.5 text-sm font-medium text-slate-200 shadow-sm hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150"
                  >
                    {uploading ? "Mengupload..." : "Ubah Foto"}
                  </label>
                  {uploading && <p className="text-xs text-slate-400 mt-1">Mohon tunggu...</p>}
                </div>
              </div>
            </div>

            <div className="col-span-full pt-6 border-t border-slate-700 mt-4">
              <button
                type="submit"
                disabled={saving || uploading || !hasChanged}
                className="w-full sm:w-auto rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan Hero"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}