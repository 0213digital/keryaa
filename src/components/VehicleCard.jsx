import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

// Icons for vehicle specs
const SeatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const FuelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v-4m0 4h.01M8 10h.01M8 6h.01M16 6h.01M16 10h.01M16 14h.01M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>;

const VehicleCard = ({ vehicle }) => {
  const { translations } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
      <Link to={`/vehicle/${vehicle.id}`}>
        <img 
          src={vehicle.image_url || 'https://via.placeholder.com/400x300'} 
          alt={`${vehicle.make} ${vehicle.model}`} 
          className="w-full h-56 object-cover"
        />
      </Link>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-blue-600">{vehicle.make}</p>
            <h3 className="text-xl font-bold text-slate-800">{vehicle.model}</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">${vehicle.price_per_day}</p>
            <p className="text-sm text-slate-500">/ {translations.day}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center">
            <SeatIcon />
            <span>{vehicle.seats || 'N/A'} {translations.seats}</span>
          </div>
          <div className="flex items-center">
            <FuelIcon />
            <span>{vehicle.fuel_type || 'N/A'}</span>
          </div>
        </div>
        
        <Link 
          to={`/booking/${vehicle.id}`} 
          className="mt-6 block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
        >
          {translations.bookNow}
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;
