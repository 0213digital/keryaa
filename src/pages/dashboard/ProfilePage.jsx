import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAppContext } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';

// Simple SVG Icon for the upload button
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const ProfilePage = () => {
  const { user, userProfile, session } = useAppContext();
  const { translations } = useLanguage();
  
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setAvatarUrl(userProfile.avatar_url || '');
    }
  }, [userProfile]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updates = {
        id: user.id,
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      alert(translations.profileUpdatedSuccess);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">{translations.myProfile}</h1>
        
        <form onSubmit={handleProfileUpdate} className="space-y-8">
          {/* Profile Header Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-6">
            <img 
              src={avatarUrl || `https://ui-avatars.com/api/?name=${fullName || session?.user.email}&background=random`} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-200"
            />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{fullName || 'Utilisateur'}</h2>
              <p className="text-slate-500">{session?.user.email}</p>
              <button type="button" className="mt-3 inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                <UploadIcon />
                {translations.uploadPhoto}
              </button>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-slate-800 border-b pb-4 mb-6">{translations.personalInformation}</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-600">{translations.fullName}</label>
                <input 
                  id="fullName" 
                  type="text" 
                  value={fullName || ''} 
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                  className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-600">{translations.avatarUrl}</label>
                <input 
                  id="avatarUrl" 
                  type="text" 
                  value={avatarUrl || ''} 
                  onChange={(e) => setAvatarUrl(e.target.value)} 
                  className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading} 
              className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 transition-colors duration-300"
            >
              {loading ? `${translations.updating}...` : translations.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;