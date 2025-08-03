import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminDashboard = () => {
  const { translations } = useLanguage();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{translations.adminDashboard}</h1>
      <nav className="space-x-4">
        <Link to="/admin/users" className="text-blue-500 hover:underline">
          {translations.manageUsers}
        </Link>
        <Link to="/admin/bookings" className="text-blue-500 hover:underline">
          {translations.viewAllBookings}
        </Link>
      </nav>
      <div className="mt-8">
        {/* You can add some stats or quick info here */}
        <p>{translations.welcomeAdmin}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
