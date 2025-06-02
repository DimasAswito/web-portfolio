import { useEffect} from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Gagal logout: ' + error.message);
    } else {
      navigate('/admin/login'); // arahkan kembali ke halaman login
    }
  };

  useEffect(() => {
  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      navigate('/admin/login');
    }
  };
  checkAuth();
}, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white font-poppins p-8">
      <h1 className="text-3xl font-bold mb-6">Selamat datang di Dashboard</h1>

      {/* Tombol Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg font-medium transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
