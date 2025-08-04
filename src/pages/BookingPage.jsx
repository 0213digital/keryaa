import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user } = useAppContext();
  const { translations } = useLanguage();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const searchParams = new URLSearchParams(location.search);
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('vehicles').select('*').eq('id', id).single();
        if (error) throw error;
        setVehicle(data);
      } catch (error) {
        console.error('Error fetching vehicle:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
        navigate('/login');
    } else {
        fetchVehicle();
    }
  }, [id, user, navigate]);

  useEffect(() => {
    if (startDate && endDate && vehicle) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setTotalPrice(diffDays * vehicle.price_per_day);
      } else {
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, vehicle]);

  const handleBooking = async () => {
    if (!startDate || !endDate || totalPrice <= 0) {
      alert(translations.selectValidDates);
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('bookings').insert([
        {
          vehicle_id: vehicle.id,
          user_id: user.id,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice,
          status: 'confirmed'
        },
      ]);

      if (error) throw error;

      navigate('/confirmation', { state: { vehicle, startDate, endDate, totalPrice } });
    } catch (error) {
      console.error('Error creating booking:', error.message);
      alert(translations.errorCreatingBooking);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !vehicle) {
    return <div className="text-center p-10">{translations.loading}...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">{translations.confirmBooking}</h1>
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Vehicle Info */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <img src={vehicle.image_url} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">{vehicle.make} {vehicle.model}</h2>
            <p className="text-slate-500">{vehicle.year}</p>
            <p className="mt-4 text-3xl font-bold text-blue-600">${vehicle.price_per_day}<span className="text-lg font-normal text-slate-500">/{translations.day}</span></p>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-3 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 border-b pb-4">{translations.bookingDetails}</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-slate-600">{translations.pickupDate}</label>
                  <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-slate-600">{translations.returnDate}</label>
                  <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div className="mt-6 border-t pt-6">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span className="text-slate-700">{translations.totalPrice}:</span>
                  <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={handleBooking} disabled={loading || totalPrice <= 0} className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors duration-300">
                {loading ? `${translations.processing}...` : translations.confirmAndPay}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
