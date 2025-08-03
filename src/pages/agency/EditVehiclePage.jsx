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
    make: '',
    model: '',
    year: '',
    price_per_day: '',
    fuel_type: '',
    transmission: '',
    seats: '',
    image_url: '',
  });
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const { error } = await supabase
        .from('vehicles')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
      alert(translations.vehicleUpdatedSuccess);
      navigate('/dashboard/agency');
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
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">{translations.editVehicle}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Make */}
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700">{translations.make}</label>
          <select id="make" name="make" value={formData.make || ''} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            <option value="">{translations.selectMake}</option>
            {carMakes.map((makeName) => <option key={makeName} value={makeName}>{makeName}</option>)}
          </select>
        </div>
        {/* Model */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">{translations.model}</label>
          <select id="model" name="model" value={formData.model || ''} onChange={handleChange} required disabled={!formData.make} className="mt-1 block w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-200">
            <option value="">{translations.selectModel}</option>
            {availableModels.map((modelName) => <option key={modelName} value={modelName}>{modelName}</option>)}
          </select>
        </div>
        
        {/* Other fields */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">{translations.year}</label>
          <input type="number" id="year" name="year" value={formData.year || ''} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="price_per_day" className="block text-sm font-medium text-gray-700">{translations.pricePerDay}</label>
          <input type="number" id="price_per_day" name="price_per_day" value={formData.price_per_day || ''} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="fuel_type" className="block text-sm font-medium text-gray-700">{translations.fuelType}</label>
          <select id="fuel_type" name="fuel_type" value={formData.fuel_type || ''} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            <option value="">{translations.selectFuelType}</option>
            {fuelTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">{translations.transmission}</label>
          <select id="transmission" name="transmission" value={formData.transmission || ''} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            <option value="">{translations.selectTransmission}</option>
            {transmissionTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="seats" className="block text-sm font-medium text-gray-700">{translations.seats}</label>
          <input type="number" id="seats" name="seats" value={formData.seats || ''} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">{translations.imageUrl}</label>
          <input type="url" id="image_url" name="image_url" value={formData.image_url || ''} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        
        <button type="submit" disabled={loading} className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400">
          {loading ? `${translations.updating}...` : translations.updateVehicle}
        </button>
      </form>
    </div>
  );
};

export default EditVehiclePage;
