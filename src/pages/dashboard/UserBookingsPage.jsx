import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAppContext } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';

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
            .select('*, vehicles(*)') // Fetch booking and related vehicle info
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
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{translations.myBookings}</h1>
      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map(booking => (
            <div key={booking.id} className="flex flex-col md:flex-row items-center p-4 border rounded-lg gap-4">
              <img src={booking.vehicles.image_url} alt={booking.vehicles.make} className="w-32 h-20 object-cover rounded-md"/>
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{booking.vehicles.make} {booking.vehicles.model}</h2>
                <p className="text-sm text-gray-600">
                  {translations.from} {new Date(booking.start_date).toLocaleDateString()} {translations.to} {new Date(booking.end_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${booking.total_price}</p>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  booking.status === 'confirmed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                }`}>
                  {translations[booking.status] || booking.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>{translations.noBookingsFound}</p>
        )}
      </div>
    </div>
  );
};

export default UserBookingsPage;
