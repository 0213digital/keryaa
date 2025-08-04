import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';
import { carData, carMakes, fuelTypes, transmissionTypes } from '../../data/geoAndCarData';

const EditVehiclePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { translations } = useLanguage();
  
  const [formData, setFormData] = useState({
    make: '', model: '', year: '', price_per_day: '',
    fuel_type: '', transmission: '', seats: '', image_url: '',
  });
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('vehicles').select('*').eq('id', id).single();
        if (error) throw error;
        setFormData(data);
        if (data && data.make) {
          setAvailableModels(carData[data.make] || []);
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    if (name === 'make') {
      newFormData.model = '';
      setAvailableModels(carData[value] || []);
    }
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { id: vehicleId, created_at, ...updateData } = formData;
      const { error } = await supabase.from('vehicles').update(updateData).eq('id', id);
      if (error) throw error;
      alert(translations.vehicleUpdatedSuccess);
      navigate('/agency-dashboard');
    } catch (error) {
      console.error('Error updating vehicle:', error.message);
      alert(translations.errorUpdatingVehicle);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>{translations.loading}...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">{translations.editVehicle}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-slate-600">{translations.make}</label>
            <select id="make" name="make" value={formData.make || ''} onChange={handleChange} required className="mt-1 block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="">{translations.selectMake}</option>
              {carMakes.map((makeName) => <option key={makeName} value={makeName}>{makeName}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-slate-600">{translations.model}</label>
            <select id="model" name="model" value={formData.model || ''} onChange={handleChange} required disabled={!formData.make} className="mt-1 block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100">
              <option value="">{translations.selectModel}</option>
              {availableModels.map((modelName) => <option key={modelName} value={modelName}>{modelName}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="year" className="block text-sm font-medium text-slate-600">{translations.year}</label>
                <input type="number" id="year" name="year" value={formData.year || ''} onChange={handleChange} required className="mt-1 block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label htmlFor="price_per_day" className="block text-sm font-medium text-slate-600">{translations.pricePerDay}</label>
                <input type="number" id="price_per_day" name="price_per_day" value={formData.price_per_day || ''} onChange={handleChange} required className="mt-1 block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label htmlFor="fuel_type" className="block text-sm font-medium text-slate-600">{translations.fuelType}</label>
                <select id="fuel_type" name="fuel_type" value={formData.fuel_type || ''} onChange={handleChange} required className="mt-1 block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">{translations.selectFuelType}</option>
                    {fuelTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="transmission" className="block text-sm font-medium text-slate-600">{translations.transmission}</label>
                <select id="transmission" name="transmission" value={formData.transmission || ''} onChange={handleChange} required className="mt-1 block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">{translations.selectTransmission}</option>
                    {transmissionTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="seats" className="block text-sm font-medium text-slate-600">{translations.seats}</label>
                <input type="number" id="seats" name="seats" value={formData.seats || ''} onChange={handleChange} required className="mt-1 block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </div>
        <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-slate-600">{translations.imageUrl}</label>
            <input type="url" id="image_url" name="image_url" value={formData.image_url || ''} onChange={handleChange} required className="mt-1 block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-slate-400 transition-colors">
            {loading ? `${translations.updating}...` : translations.updateVehicle}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVehiclePage;