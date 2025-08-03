import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAppContext } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AgencyBookingsPage = () => {
  const { user } = useAppContext();
  const { translations } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        try {
          setLoading(true);
          const { data: vehicles, error: vehiclesError } = await supabase
            .from('vehicles')
            .select('id')
            .eq('agency_id', user.id);

          if (vehiclesError) throw vehiclesError;

          const vehicleIds = vehicles.map(v => v.id);

          const { data, error } = await supabase
            .from('bookings')
            .select('*, vehicles(*), profiles(*)')
            .in('vehicle_id', vehicleIds);

          if (error) throw error;
          setBookings(data);
        } catch (error) {
          console.error('Error fetching bookings:', error.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBookings();
  }, [user]);

  if (loading) {
    return <div>{translations.loading}...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{translations.agencyBookings}</h1>
      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map(booking => (
            <div key={booking.id} className="p-4 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">{booking.vehicles.make} {booking.vehicles.model}</h2>
              <p>{translations.bookedBy}: {booking.profiles.full_name}</p>
              <p>{translations.email}: {booking.profiles.email}</p>
              <p>{translations.startDate}: {new Date(booking.start_date).toLocaleDateString()}</p>
              <p>{translations.endDate}: {new Date(booking.end_date).toLocaleDateString()}</p>
              <p>{translations.totalPrice}: ${booking.total_price}</p>
            </div>
          ))
        ) : (
          <p>{translations.noBookingsFound}</p>
        )}
      </div>
    </div>
  );
};

export default AgencyBookingsPage;
