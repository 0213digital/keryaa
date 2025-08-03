import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabaseClient';

// Simple SVG Icon for the logo
const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 17H5M5 17L3 7h18l-2 10zM5 7l1.5-4.5h9L17 7" />
  </svg>
);

const Navbar = () => {
  const { session, userProfile } = useAppContext();
  const { translations, switchLanguage, language } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const getLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <CarIcon />
              <span className="text-2xl font-bold text-slate-800">Keryaa</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/search" className={getLinkClass}>{translations.search}</NavLink>
            {session ? (
              <>
                <NavLink to="/dashboard/profile" className={getLinkClass}>{translations.dashboard}</NavLink>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  {translations.logout}
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-100">
                  {translations.login}
                </Link>
                <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  {translations.signUp}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink to="/search" className={getLinkClass}>{translations.search}</NavLink>
          {session ? (
            <>
              <NavLink to="/dashboard/profile" className={getLinkClass}>{translations.dashboard}</NavLink>
              <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">
                {translations.logout}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">{translations.login}</Link>
              <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">{translations.signUp}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
