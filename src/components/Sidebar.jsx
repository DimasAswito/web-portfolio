import { useEffect, useState } from "react"
import { LogOut, LayoutDashboard, Image, Info, GraduationCap, Briefcase, Folder, Mail, HelpCircle } from "lucide-react"
// import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"
import { supabase } from '../supabaseClient';

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
  { name: "Hero", path: "/admin/hero", icon: <Image size={18} /> },
  { name: "About", path: "/admin/about", icon: <Info size={18} /> },
  { name: "Education", path: "/admin/education", icon: <GraduationCap size={18} /> },
  { name: "Experience", path: "/admin/experience", icon: <Briefcase size={18} /> },
  { name: "Project", path: "/admin/project", icon: <Folder size={18} /> },
  { name: "Contact", path: "/admin/contact", icon: <Mail size={18} /> },
  { name: "QnA", path: "/admin/qna", icon: <HelpCircle size={18} /> },
]

export default function Sidebar() {
  const [session, setSession] = useState(null)
  const location = useLocation()
  const [showMenu, setShowMenu] = useState(false)
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

      const fetchPhoto = async () => {
    const { data } = await supabase.from("header").select("photo_url").single();
    if (data && data.photo_url) {
      setPhotoUrl(data.photo_url);
    }
  };
  fetchPhoto();

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/admin/login"
  }

  return (
    <aside className="w-64 h-screen fixed bg-dark/80 backdrop-blur-md z-50 text-white flex flex-col justify-between">
      <div className="p-4 space-y-2">
        <h2 className="text-2xl font-bold gradient-text cursor-pointer text-center mb-5">Wito Admin</h2>
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-900 transition ${
              location.pathname === item.path ? "bg-blue-800" : ""
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-blue-800">
  {session ? (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={photoUrl || "/photo_2.jpg"}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold">{session.user.user_metadata?.name || "User"}</p>
          <p className="text-xs text-gray-300">{session.user.email}</p>
        </div>
      </div>

      <div className="relative">
  <button
    onClick={() => setShowMenu((prev) => !prev)}
    className="p-1 focus:outline-none"
  >
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
      <circle cx="10" cy="4" r="1.5" />
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="10" cy="16" r="1.5" />
    </svg>
  </button>

  {showMenu && (
    <div
      className="absolute left-0 bottom-full mb-2 w-36 rounded-md bg-dark/80 backdrop-blur-md z-50 shadow-lg"
    >
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white hover:bg-white/10"
      >
        <LogOut size={16} />
        Log out
      </button>
    </div>
  )}
</div>

    </div>
  ) : (
    <p className="text-sm">Belum login</p>
  )}
</div>


    </aside>
  )
}
