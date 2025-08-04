import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAppContext } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import VehicleCard from '../../components/VehicleCard';

const AgencyDashboard = () => {
  const { user } = useAppContext();
  const { translations } = useLanguage();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data, error } = await supabase.from('vehicles').select('*').eq('agency_id', user.id);
          if (error) throw error;
          setVehicles(data);
        } catch (error) {
          console.error('Error fetching vehicles:', error.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchVehicles();
  }, [user]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">{translations.agencyDashboard}</h1>
        <Link to="/add-vehicle" className="px-5 py-2.5 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          {translations.addVehicle}
        </Link>
      </div>
      {loading ? <p>{translations.loading}...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgencyDashboard;