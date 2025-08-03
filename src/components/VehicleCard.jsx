import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const VehicleCard = ({ vehicle }) => {
  const { translations } = useLanguage();

  return (
    <div className="border rounded-lg p-4 shadow-lg">
      <img src={vehicle.image_url || 'https://via.placeholder.com/300'} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-48 object-cover rounded-t-lg" />
      <div className="p-4">
        <h3 className="text-xl font-bold">{vehicle.make} {vehicle.model}</h3>
        <p className="text-gray-600">{vehicle.year}</p>
        <p className="text-lg font-semibold mt-2">${vehicle.price_per_day}/day</p>
        <div className="mt-4 flex justify-between items-center">
            <Link to={`/vehicle/${vehicle.id}`} className="text-blue-500 hover:underline">{translations.viewDetails}</Link>
            <Link to={`/booking/${vehicle.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{translations.bookNow}</Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
