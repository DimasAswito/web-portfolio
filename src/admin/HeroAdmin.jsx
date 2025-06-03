import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function HeroAdmin() {
  
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    photo_url: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    const { data } = await supabase.from("header").select("*").single();
    if (data) {
      setFormData({
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        photo_url: data.photo_url,
      });
      setOriginalData(data);
    }
  };
  fetchData();
}, []);


  const handleSubmit = async () => {
  const { name, tagline, description, photo_url } = formData;
  const header = originalData; 
  
  const { error } = await supabase
    .from("header")
    .update({ name, tagline, description, photo_url })
    .eq("id", header.id); 

  if (error) {
    console.error("Gagal memperbarui:", error.message);
    alert("Gagal memperbarui data.");
  } else {
    alert("Data berhasil diperbarui!");
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setIsChanged(JSON.stringify(updated) !== JSON.stringify(originalData));
  };
  useEffect(() => {
}, [isChanged]);



  return (
    <div className="p-4">
      <div className="bg-dark/80 backdrop-blur-md rounded-2xl border border-blue-500 p-6 shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4">Edit Hero Section</h2>
        <div className="space-y-2">
          <div>
            <label className="text-white text-sm block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-dark text-white border border-blue-500"
            />
          </div>
          <div>
            <label className="text-white text-sm block mb-1">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-dark text-white border border-blue-500"
            />
          </div>
          <div>
            <label className="text-white text-sm block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-dark text-white border border-blue-500"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label className="text-white text-sm block mb-1">Photo URL</label>
            <input
              type="text"
              name="photo_url"
              value={formData.photo_url}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-dark text-white border border-blue-500"
            />
          </div>
        </div>
        <button
          disabled={!isChanged}
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
          Perbarui
        </button>

      </div>
    </div>
  );
}
