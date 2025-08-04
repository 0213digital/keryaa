import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';

const UserDetailsPage = () => {
  const { id } = useParams();
  const { translations } = useLanguage();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        // In a real-world scenario, you would have a secure RPC function 
        // to get a single user's full details, including their auth info.
        // For now, we fetch from the public 'profiles' table.
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading) {
    return <div>{translations.loading}...</div>;
  }

  if (!userDetails) {
    return <div>{translations.userNotFound}</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-8">
        <Link to="/admin/users" className="text-sm font-medium text-blue-600 hover:underline">
          &larr; {translations.backToUsers}
        </Link>
        <h1 className="text-3xl font-bold text-slate-800 mt-2">{translations.userDetails}</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <div className="flex items-center space-x-6">
            <img 
                src={userDetails.avatar_url || `https://ui-avatars.com/api/?name=${userDetails.full_name}&background=random&color=fff`} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full object-cover"
            />
            <div>
                <h2 className="text-2xl font-bold text-slate-800">{userDetails.full_name}</h2>
                <p className="text-slate-500">{userDetails.email || 'No email in profile'}</p>
                <span className={`mt-2 inline-block px-3 py-1 text-xs leading-5 font-semibold rounded-full ${
                    userDetails.role === 'admin' ? 'bg-red-100 text-red-800' : 
                    userDetails.role === 'agency' ? 'bg-green-100 text-green-800' : 
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {userDetails.role || 'user'}
                  </span>
            </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-700">User Information</h3>
            <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-slate-500">User ID</dt>
                    <dd className="mt-1 text-sm text-slate-900">{userDetails.id}</dd>
                </div>
                {/* Add more details here as they become available in your 'profiles' table */}
            </dl>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
