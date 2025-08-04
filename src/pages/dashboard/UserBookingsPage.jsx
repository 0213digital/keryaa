import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAppContext } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const UserBookingsPage = () => {
  const { user } = useAppContext();
  const { translations } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('bookings')
            .select('*, vehicles(*)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          if (error) throw error;
          setBookings(data);
        } catch (error) {
          console.error('Error fetching user bookings:', error.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserBookings();
  }, [user]);

  if (loading) {
    return <div>{translations.loading}...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">{translations.myBookings}</h1>
      <div className="space-y-6">
        {bookings.length > 0 ? (
          bookings.map(booking => (
            <div key={booking.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
              <img src={booking.vehicles.image_url} alt={booking.vehicles.make} className="w-full sm:w-40 h-32 sm:h-24 object-cover rounded-lg"/>
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-slate-800">{booking.vehicles.make} {booking.vehicles.model}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {translations.from} <strong>{new Date(booking.start_date).toLocaleDateString()}</strong> {translations.to} <strong>{new Date(booking.end_date).toLocaleDateString()}</strong>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-900">${booking.total_price}</p>
                <span className={`mt-1 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {translations[booking.status] || booking.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800">{translations.noBookingsFound}</h3>
            <p className="mt-2 text-slate-600">{translations.startBySearching}</p>
            <Link to="/search" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
              {translations.searchForACar}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookingsPage;