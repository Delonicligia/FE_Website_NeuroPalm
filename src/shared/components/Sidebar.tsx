import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, type UserResponse } from '../../services/userService';

interface SidebarProps {
  activePage: 'dashboard' | 'harga' | 'riwayat' | 'users';
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getCurrentUser();
        setUser(data);
        localStorage.setItem('user_role', data.role);
        localStorage.setItem('user_email', data.email);
        localStorage.setItem('username', data.username);
      } catch (err) {
        console.error('Failed to fetch user profiles:', err);
        // API interceptor will redirect if 401, but just in case:
        localStorage.removeItem('access_token');
        navigate('/');
      }
    };

    if (localStorage.getItem('access_token')) {
      fetchUser();
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('username');
    navigate('/');
  };

  const getInitials = (name: string) => {
    if (!name) return 'US';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Floating Toggle Button for Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl shadow-lg md:hidden transition duration-200 focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed md:sticky md:top-0 inset-y-0 left-0 z-40 w-72 h-screen p-6 bg-emerald-50 border-r border-emerald-100 flex flex-col justify-between items-start shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="self-stretch flex flex-col justify-start items-start gap-12">
          {/* Brand Header */}
          <div className="self-stretch flex flex-col justify-start items-start cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="justify-center text-emerald-900 text-2xl font-black font-['Inter'] leading-7 tracking-tight">
              NeuroPalm
            </div>
          </div>

          {/* Navigation Links */}
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            {/* Dashboard Link */}
            <button
              onClick={() => {
                navigate('/dashboard');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 rounded-xl flex justify-start items-center gap-4 transition-all duration-200 ${
                activePage === 'dashboard'
                  ? 'bg-emerald-900 text-white shadow-md'
                  : 'text-emerald-700/75 hover:bg-emerald-100/50 hover:text-emerald-950'
              }`}
            >
              <svg
                className={`w-5 h-5 ${activePage === 'dashboard' ? 'text-white' : 'text-emerald-700/75'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              <span className="text-base font-semibold font-['Inter'] leading-6">Dashboard</span>
            </button>

            {/* Harga Pasaran Link */}
            <button
              onClick={() => {
                navigate('/harga');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 rounded-xl flex justify-start items-center gap-4 transition-all duration-200 ${
                activePage === 'harga'
                  ? 'bg-emerald-900 text-white shadow-md'
                  : 'text-emerald-700/75 hover:bg-emerald-100/50 hover:text-emerald-950'
              }`}
            >
              <svg
                className={`w-5 h-5 ${activePage === 'harga' ? 'text-white' : 'text-emerald-700/75'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-base font-semibold font-['Inter'] leading-6">Harga Pasaran</span>
            </button>

            {/* Riwayat Klasifikasi Link */}
            <button
              onClick={() => {
                navigate('/riwayat');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 rounded-xl flex justify-start items-center gap-4 transition-all duration-200 ${
                activePage === 'riwayat'
                  ? 'bg-emerald-900 text-white shadow-md'
                  : 'text-emerald-700/75 hover:bg-emerald-100/50 hover:text-emerald-950'
              }`}
            >
              <svg
                className={`w-5 h-5 ${activePage === 'riwayat' ? 'text-white' : 'text-emerald-700/75'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="text-base font-semibold font-['Inter'] leading-6">Riwayat Klasifikasi</span>
            </button>

            {/* Manajemen Pengguna Link */}
            <button
              onClick={() => {
                navigate('/users');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 rounded-xl flex justify-start items-center gap-4 transition-all duration-200 ${
                activePage === 'users'
                  ? 'bg-emerald-900 text-white shadow-md'
                  : 'text-emerald-700/75 hover:bg-emerald-100/50 hover:text-emerald-950'
              }`}
            >
              <svg
                className={`w-5 h-5 ${activePage === 'users' ? 'text-white' : 'text-emerald-700/75'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-base font-semibold font-['Inter'] leading-6">Manajemen Pengguna</span>
            </button>
          </div>
        </div>

        {/* User Session profile and Logout */}
        <div className="self-stretch pt-6 border-t border-emerald-200/50 flex flex-col justify-start items-start gap-4">
          {user && (
            <div className="self-stretch p-2 flex justify-start items-center gap-3">
              <div className="w-10 h-10 bg-emerald-800 rounded-full flex justify-center items-center shadow-sm">
                <div className="text-center justify-center text-emerald-300 text-sm font-bold font-['Inter'] leading-6">
                  {getInitials(user.username)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-900 text-sm font-bold font-['Inter'] leading-4 truncate">
                  {user.username}
                </div>
                <div className="text-slate-500 text-xs font-['Inter'] truncate capitalize">
                  {user.role}
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-bold font-['Inter'] rounded-xl transition duration-200 flex justify-center items-center gap-2 border border-rose-200/40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
