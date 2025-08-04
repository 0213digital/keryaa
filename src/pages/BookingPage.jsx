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
  
  // Get dates from URL or set default
  const searchParams = new URLSearchParams(location.search);
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', id)
          .single();
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

  // Calculate total price whenever dates or vehicle change
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
          status: 'confirmed' // or 'pending'
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
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{translations.confirmBooking}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vehicle Info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">{vehicle.make} {vehicle.model}</h2>
          <img src={vehicle.image_url} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-48 object-cover rounded-lg my-4" />
          <p className="text-xl font-bold text-blue-600">${vehicle.price_per_day} / {translations.day}</p>
        </div>

        {/* Booking Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{translations.bookingDetails}</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">{translations.pickupDate}</label>
              <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">{translations.returnDate}</label>
              <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>{translations.totalPrice}:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handleBooking} disabled={loading} className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-400">
            {loading ? `${translations.processing}...` : translations.confirmAndPay}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;