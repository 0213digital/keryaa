import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';

const UserManagementPage = () => {
  const { translations } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Note: This RPC call needs to be set up in your Supabase project's SQL editor.
        // It's a secure way to get user list data as an admin.
        const { data, error } = await supabase.rpc('get_all_users');
        if (error) throw error;
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
        // You might want to show an error message to the user here
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div>{translations.loading}...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">{translations.manageUsers}</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto border border-slate-200">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{translations.fullName}</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{translations.email}</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{translations.role}</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{user.raw_user_meta_data?.full_name || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.raw_user_meta_data?.role === 'admin' ? 'bg-red-100 text-red-800' : 
                    user.raw_user_meta_data?.role === 'agency' ? 'bg-green-100 text-green-800' : 
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {user.raw_user_meta_data?.role || 'user'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
