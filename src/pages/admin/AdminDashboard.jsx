import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminDashboard = () => {
  const { translations } = useLanguage();

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">{translations.adminDashboard}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/users" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-bold text-slate-800">{translations.manageUsers}</h2>
          <p className="mt-2 text-slate-600">{translations.viewAndManageAllUsers}</p>
        </Link>
        <Link to="/admin/bookings" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-bold text-slate-800">{translations.viewAllBookings}</h2>
          <p className="mt-2 text-slate-600">{translations.browseAllBookings}</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;