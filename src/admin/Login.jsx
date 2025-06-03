import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert('Login gagal: ' + error.message);
    } else {
      navigate('/admin/dashboard');
    }
  };

  useEffect(() => {
  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      navigate('/admin/dashboard');
    }
  };
  checkSession();
}, []);


  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-800 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
          <div className="absolute top-2 left-4 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <div className="absolute bottom-2 right-4 w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                <i className="fas fa-user-astronaut text-3xl text-blue-400"></i>
              </div>
              <h1 className="text-2xl font-bold text-blue-400 mb-2">Dimas Aswito</h1>
              <div className="w-24 mx-auto my-3 border-t border-blue-400" />
              <p className="text-gray-400 text-sm">Enter your email and password to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className={`fas fa-envelope ${isEmailFocused ? 'text-blue-300' : 'text-blue-400'}`}></i>
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="input-field w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none text-white placeholder-gray-500 bg-gray-700"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className={`fas fa-lock ${isPasswordFocused ? 'text-blue-300' : 'text-blue-400'}`}></i>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="input-field w-full pl-10 pr-10 py-3 rounded-lg focus:outline-none text-white placeholder-gray-500 bg-gray-700"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember" type="checkbox" className="h-4 w-4 text-blue-500 border-gray-600 rounded bg-gray-700" />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">Remember me</label>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center space-x-2">
                <span>LOGIN</span>
                <i className="fas fa-arrow-right"></i>
              </button>
            </form>

            {/* Alternative Login */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400 mb-5">Or continue with</span>
                </div>
              </div>
              <button
                onClick={() =>
                  supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: `${window.location.origin}/admin/dashboard`,
                    },
                  })
                }
                className="w-full inline-flex justify-center py-2 px-4 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 transition"
                >
                <i className="fab fa-google mr-2"></i></button>


            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
