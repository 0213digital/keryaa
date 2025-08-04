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
          .select('*, profiles (full_name, avatar_url)')
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
    <div className="bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={vehicle.image_url || 'https://via.placeholder.com/800x600'} 
                alt={`${vehicle.make} ${vehicle.model}`} 
                className="w-full h-96 object-cover"
              />
              <div className="p-6">
                <p className="text-sm font-semibold text-blue-600">{vehicle.make}</p>
                <h1 className="text-3xl font-bold text-slate-800">{vehicle.model}</h1>
                <p className="text-slate-500 mt-1">{vehicle.year}</p>
                
                <div className="mt-6 pt-6 border-t">
                  <h2 className="text-xl font-semibold text-slate-800">{translations.specifications}</h2>
                  <ul className="mt-4 grid grid-cols-2 gap-4 text-slate-600">
                    <li className="flex items-center"><span className="font-semibold w-24">{translations.fuelType}:</span> {vehicle.fuel_type}</li>
                    <li className="flex items-center"><span className="font-semibold w-24">{translations.transmission}:</span> {vehicle.transmission}</li>
                    <li className="flex items-center"><span className="font-semibold w-24">{translations.seats}:</span> {vehicle.seats}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900">${vehicle.price_per_day}<span className="text-lg font-normal text-slate-500">/{translations.day}</span></p>
              </div>
              <div className="mt-6">
                {session ? (
                  <Link to={`/booking/${vehicle.id}`} className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
                    {translations.bookNow}
                  </Link>
                ) : (
                  <div className="text-center">
                    <Link to="/login" className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
                      {translations.loginToBook}
                    </Link>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold text-slate-800">{translations.agency}</h3>
                <div className="flex items-center mt-4">
                  <img 
                      src={vehicle.profiles?.avatar_url || 'https://via.placeholder.com/50'} 
                      alt="Agency" 
                      className="w-12 h-12 rounded-full object-cover"
                  />
                  <p className="ml-4 font-medium text-slate-700">{vehicle.profiles?.full_name || 'N/A'}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
