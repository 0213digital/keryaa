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

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('vehicles').select('*');
        if (error) throw error;
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);
  
  useEffect(() => {
    let result = vehicles;
    if (selectedMake) result = result.filter(v => v.make === selectedMake);
    if (selectedModel) result = result.filter(v => v.model === selectedModel);
    if (selectedFuel) result = result.filter(v => v.fuel_type === selectedFuel);
    if (selectedTransmission) result = result.filter(v => v.transmission === selectedTransmission);
    setFilteredVehicles(result);
  }, [selectedMake, selectedModel, selectedFuel, selectedTransmission, vehicles]);

  const handleMakeChange = (e) => {
    const make = e.target.value;
    setSelectedMake(make);
    setSelectedModel('');
    setAvailableModels(make ? carData[make] || [] : []);
  };

  const clearFilters = () => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedFuel('');
    setSelectedTransmission('');
    setAvailableModels([]);
  };

  return (
    <div className="bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <div className="p-6 bg-white rounded-lg shadow-md sticky top-24">
              <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">{translations.filters}</h2>
              <div className="space-y-5">
                <div>
                  <label htmlFor="make-filter" className="block text-sm font-medium text-slate-600">{translations.make}</label>
                  <select id="make-filter" value={selectedMake} onChange={handleMakeChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">{translations.allMakes}</option>
                    {carMakes.map(make => <option key={make} value={make}>{make}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="model-filter" className="block text-sm font-medium text-slate-600">{translations.model}</label>
                  <select id="model-filter" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedMake} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100">
                    <option value="">{translations.allModels}</option>
                    {availableModels.map(model => <option key={model} value={model}>{model}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="fuel-filter" className="block text-sm font-medium text-slate-600">{translations.fuelType}</label>
                  <select id="fuel-filter" value={selectedFuel} onChange={(e) => setSelectedFuel(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">{translations.all}</option>
                    {fuelTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="transmission-filter" className="block text-sm font-medium text-slate-600">{translations.transmission}</label>
                  <select id="transmission-filter" value={selectedTransmission} onChange={(e) => setSelectedTransmission(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">{translations.all}</option>
                    {transmissionTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <button onClick={clearFilters} className="w-full text-sm font-medium text-blue-600 hover:underline pt-3">{translations.clearFilters}</button>
              </div>
            </div>
          </aside>

          {/* Search Results */}
          <main className="w-full md:w-3/4 lg:w-4/5">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">{translations.searchResults}</h1>
            {loading ? (
              <p>{translations.loading}...</p>
            ) : filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredVehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-slate-800">{translations.noVehiclesFound}</h3>
                <p className="mt-2 text-slate-600">{translations.tryAdjustingFilters}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
