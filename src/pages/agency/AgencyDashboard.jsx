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
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('agency_id', user.id);

          if (error) {
            throw error;
          }
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

  if (loading) {
    return <div>{translations.loading}...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{translations.agencyDashboard}</h1>
      <Link to="/add-vehicle" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        {translations.addVehicle}
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
};

export default AgencyDashboard;