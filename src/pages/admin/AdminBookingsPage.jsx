import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { translations } = useLanguage();

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('bookings')
          .select('*, vehicles(make, model, agencies(name)), profiles(full_name, email)');
        
        if (error) throw error;
        setBookings(data);
      } catch (error) {
        console.error('Error fetching all bookings:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBookings();
  }, []);

  if (loading) {
    return <div>{translations.loading}...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{translations.allBookings}</h1>
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{booking.vehicles.make} {booking.vehicles.model}</h2>
            <p>{translations.agency}: {booking.vehicles.agencies.name}</p>
            <p>{translations.bookedBy}: {booking.profiles.full_name} ({booking.profiles.email})</p>
            <p>{translations.totalPrice}: ${booking.total_price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
