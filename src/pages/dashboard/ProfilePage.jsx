import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAppContext } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';

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
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{translations.myProfile}</h1>
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">{translations.email}</label>
          <input id="email" type="text" value={session?.user.email || ''} disabled className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
        </div>
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">{translations.fullName}</label>
          <input id="fullName" type="text" value={fullName || ''} onChange={(e) => setFullName(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">{translations.avatarUrl}</label>
          <input id="avatarUrl" type="text" value={avatarUrl || ''} onChange={(e) => setAvatarUrl(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <button type="submit" disabled={loading} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? `${translations.updating}...` : translations.updateProfile}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
