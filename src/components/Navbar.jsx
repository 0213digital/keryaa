import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext'; // Correction ici: useLanguage au lieu de useTranslation
import { supabase } from '../lib/supabaseClient';

const Navbar = () => {
  const { session, setSession, userProfile } = useAppContext();
  const { translations, switchLanguage, language } = useLanguage(); // Correction ici

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      setSession(null);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Keryaa</Link>
        <div className="flex items-center space-x-4">
          <Link to="/search" className="hover:text-gray-300">{translations.search}</Link>
          {session ? (
            <>
              <span className="font-semibold">{userProfile?.full_name || 'User'}</span>
              <Link to="/dashboard/profile" className="hover:text-gray-300">{translations.dashboard}</Link>
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">{translations.logout}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">{translations.login}</Link>
              <Link to="/signup" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">{translations.signUp}</Link>
            </>
          )}
          <div className="flex items-center">
            <button onClick={() => switchLanguage('fr')} className={`px-2 py-1 text-sm ${language === 'fr' ? 'font-bold' : ''}`}>FR</button>
            <button onClick={() => switchLanguage('en')} className={`px-2 py-1 text-sm ${language === 'en' ? 'font-bold' : ''}`}>EN</button>
            <button onClick={() => switchLanguage('ar')} className={`px-2 py-1 text-sm ${language === 'ar' ? 'font-bold' : ''}`}>AR</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
