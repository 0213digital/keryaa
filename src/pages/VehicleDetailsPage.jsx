import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const { translations } = useLanguage();
  const { session } = useAppContext();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*, profiles (full_name, avatar_url)') // Assuming a 'profiles' table for agency info
          .eq('id', id)
          .single();

        if (error) throw error;
        setVehicle(data);
      } catch (error) {
        console.error('Error fetching vehicle details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return <div className="text-center p-10">{translations.loading}...</div>;
  }

  if (!vehicle) {
    return <div className="text-center p-10">{translations.vehicleNotFound}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:flex">
        <div className="md:w-1/2">
          <img 
            src={vehicle.image_url || 'https://via.placeholder.com/600x400'} 
            alt={`${vehicle.make} ${vehicle.model}`} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-8 md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900">{vehicle.make} {vehicle.model}</h1>
          <p className="text-gray-600 mt-1">{vehicle.year}</p>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800">{translations.specifications}</h2>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li><strong>{translations.fuelType}:</strong> {vehicle.fuel_type}</li>
              <li><strong>{translations.transmission}:</strong> {vehicle.transmission}</li>
              <li><strong>{translations.seats}:</strong> {vehicle.seats}</li>
            </ul>
          </div>

          <div className="mt-6">
             <h2 className="text-xl font-semibold text-gray-800">{translations.agency}</h2>
             <div className="flex items-center mt-4">
                <img 
                    src={vehicle.profiles?.avatar_url || 'https://via.placeholder.com/50'} 
                    alt="Agency" 
                    className="w-12 h-12 rounded-full object-cover"
                />
                <p className="ml-4 text-gray-700">{vehicle.profiles?.full_name || 'N/A'}</p>
             </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <p className="text-3xl font-bold text-blue-600">${vehicle.price_per_day}<span className="text-lg font-normal text-gray-500">/{translations.day}</span></p>
            {session ? (
              <Link to={`/booking/${vehicle.id}`} className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300">
                {translations.bookNow}
              </Link>
            ) : (
              <Link to="/login" className="bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold cursor-not-allowed">
                {translations.loginToBook}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
