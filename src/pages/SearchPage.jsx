import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import VehicleCard from '../components/VehicleCard';
import { useLanguage } from '../contexts/LanguageContext';
import { carData, carMakes, fuelTypes, transmissionTypes } from '../data/geoAndCarData';

const SearchPage = () => {
  const location = useLocation();
  const { translations } = useLanguage();
  
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');

  // Fetch all vehicles initially
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        // Note: In a real app, you would filter based on location/dates on the backend
        // For this example, we fetch all and filter on the client side.
        const { data, error } = await supabase.from('vehicles').select('*');
        if (error) throw error;
        setVehicles(data);
        setFilteredVehicles(data); // Initially, all vehicles are shown
      } catch (error) {
        console.error('Error fetching vehicles:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);
  
  // Apply filters whenever a filter state changes
  useEffect(() => {
    let result = vehicles;

    if (selectedMake) {
      result = result.filter(v => v.make === selectedMake);
    }
    if (selectedModel) {
      result = result.filter(v => v.model === selectedModel);
    }
    if (selectedFuel) {
      result = result.filter(v => v.fuel_type === selectedFuel);
    }
    if (selectedTransmission) {
      result = result.filter(v => v.transmission === selectedTransmission);
    }

    setFilteredVehicles(result);
  }, [selectedMake, selectedModel, selectedFuel, selectedTransmission, vehicles]);


  const handleMakeChange = (e) => {
    const make = e.target.value;
    setSelectedMake(make);
    setSelectedModel(''); // Reset model when make changes
    setAvailableModels(make ? carData[make] || [] : []);
  };

  const clearFilters = () => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedFuel('');
    setSelectedTransmission('');
    setAvailableModels([]);
  };

  if (loading) {
    return <div className="text-center p-10">{translations.loading}...</div>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="w-full md:w-1/4 lg:w-1/5 p-4 bg-gray-50 rounded-lg shadow-sm h-fit">
        <h2 className="text-xl font-bold mb-4">{translations.filters}</h2>
        <div className="space-y-4">
          {/* Make Filter */}
          <div>
            <label htmlFor="make-filter" className="block text-sm font-medium text-gray-700">{translations.make}</label>
            <select id="make-filter" value={selectedMake} onChange={handleMakeChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option value="">{translations.allMakes}</option>
              {carMakes.map(make => <option key={make} value={make}>{make}</option>)}
            </select>
          </div>
          {/* Model Filter */}
          <div>
            <label htmlFor="model-filter" className="block text-sm font-medium text-gray-700">{translations.model}</label>
            <select id="model-filter" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedMake} className="mt-1 block w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-200">
              <option value="">{translations.allModels}</option>
              {availableModels.map(model => <option key={model} value={model}>{model}</option>)}
            </select>
          </div>
          {/* Fuel Type Filter */}
          <div>
            <label htmlFor="fuel-filter" className="block text-sm font-medium text-gray-700">{translations.fuelType}</label>
            <select id="fuel-filter" value={selectedFuel} onChange={(e) => setSelectedFuel(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option value="">{translations.all}</option>
              {fuelTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          {/* Transmission Filter */}
          <div>
            <label htmlFor="transmission-filter" className="block text-sm font-medium text-gray-700">{translations.transmission}</label>
            <select id="transmission-filter" value={selectedTransmission} onChange={(e) => setSelectedTransmission(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option value="">{translations.all}</option>
              {transmissionTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <button onClick={clearFilters} className="w-full text-sm text-blue-500 hover:underline mt-2">{translations.clearFilters}</button>
        </div>
      </aside>

      {/* Search Results */}
      <main className="w-full md:w-3/4 lg:w-4/5">
        <h1 className="text-2xl font-bold mb-4">{translations.searchResults}</h1>
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <p>{translations.noVehiclesFound}</p>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
