import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppContext } from '../../contexts/AppContext';

const UserManagementPage = () => {
  const { translations } = useLanguage();
  const { userProfile } = useAppContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Protect this route for admins
    if (userProfile && userProfile.role !== 'admin') {
      // Redirect non-admin users
      // navigate('/'); 
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        // This requires an admin-level function on Supabase
        const { data, error } = await supabase.rpc('get_all_users');
        if (error) throw error;
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userProfile]);

  if (loading) {
    return <div>{translations.loading}...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{translations.manageUsers}</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{translations.fullName}</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{translations.email}</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{translations.role}</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{user.raw_user_meta_data?.full_name || 'N/A'}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                    user.raw_user_meta_data?.role === 'admin' ? 'text-red-900 bg-red-200' : 
                    user.raw_user_meta_data?.role === 'agency' ? 'text-green-900 bg-green-200' : 
                    'text-gray-900 bg-gray-200'
                  } rounded-full`}>
                    {user.raw_user_meta_data?.role || 'user'}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <Link to={`/admin/users/${user.id}`} className="text-blue-600 hover:text-blue-900">{translations.viewDetails}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
