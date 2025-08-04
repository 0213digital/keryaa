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
        setLoading(true);
        try {
          const { data: vehicles, error: vehiclesError } = await supabase.from('vehicles').select('id').eq('agency_id', user.id);
          if (vehiclesError) throw vehiclesError;
          const vehicleIds = vehicles.map(v => v.id);
          const { data, error } = await supabase.from('bookings').select('*, vehicles(*), profiles(*)').in('vehicle_id', vehicleIds);
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

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">{translations.agencyBookings}</h1>
      <div className="space-y-6">
        {loading ? <p>{translations.loading}...</p> : bookings.length > 0 ? (
          bookings.map(booking => (
            <div key={booking.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{booking.vehicles.make} {booking.vehicles.model}</h2>
                  <p className="text-sm text-slate-500">{translations.bookedBy}: <strong>{booking.profiles.full_name}</strong> ({booking.profiles.email})</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg font-bold text-slate-900">${booking.total_price}</p>
                  <p className="text-sm text-slate-500">{new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}</p>
                </div>
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

export default AgencyBookingsPage;