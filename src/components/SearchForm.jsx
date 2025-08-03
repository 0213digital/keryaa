import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { wilayas } from '../data/geoAndCarData';

const SearchForm = () => {
  // State for pickup location
  const [pickupWilaya, setPickupWilaya] = useState('');
  const [pickupBaladiya, setPickupBaladiya] = useState('');
  const [availablePickupBaladiyates, setAvailablePickupBaladiyates] = useState([]);

  // State for return location
  const [returnWilaya, setReturnWilaya] = useState('');
  const [returnBaladiya, setReturnBaladiya] = useState('');
  const [availableReturnBaladiyates, setAvailableReturnBaladiyates] = useState([]);
  
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  
  const navigate = useNavigate();
  const { translations } = useLanguage();

  const handleWilayaChange = (e, type) => {
    const selectedWilayaName = e.target.value;
    if (type === 'pickup') {
      setPickupWilaya(selectedWilayaName);
      setPickupBaladiya('');
      const selectedWilayaData = wilayas.find(w => w.name === selectedWilayaName);
      setAvailablePickupBaladiyates(selectedWilayaData ? selectedWilayaData.baladiyates : []);
    } else {
      setReturnWilaya(selectedWilayaName);
      setReturnBaladiya('');
      const selectedWilayaData = wilayas.find(w => w.name === selectedWilayaName);
      setAvailableReturnBaladiyates(selectedWilayaData ? selectedWilayaData.baladiyates : []);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      pickupLocation: `${pickupWilaya}, ${pickupBaladiya}`,
      returnLocation: `${returnWilaya}, ${returnBaladiya}`,
      pickupDate,
      returnDate,
    }).toString();
    navigate(`/search?${searchParams}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      {/* Pickup Location */}
      <div className="col-span-1 md:col-span-1">
        <label className="block text-sm font-medium text-gray-700">{translations.pickupLocation}</label>
        <div className="flex space-x-2 mt-1">
          <select value={pickupWilaya} onChange={(e) => handleWilayaChange(e, 'pickup')} required className="block w-1/2 p-2 border border-gray-300 rounded-md">
            <option value="">{translations.selectWilaya}</option>
            {wilayas.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
          </select>
          <select value={pickupBaladiya} onChange={(e) => setPickupBaladiya(e.target.value)} required disabled={!pickupWilaya} className="block w-1/2 p-2 border border-gray-300 rounded-md disabled:bg-gray-200">
            <option value="">{translations.selectBaladiya}</option>
            {availablePickupBaladiyates.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* Return Location */}
       <div className="col-span-1 md:col-span-1">
        <label className="block text-sm font-medium text-gray-700">{translations.returnLocation}</label>
        <div className="flex space-x-2 mt-1">
          <select value={returnWilaya} onChange={(e) => handleWilayaChange(e, 'return')} required className="block w-1/2 p-2 border border-gray-300 rounded-md">
            <option value="">{translations.selectWilaya}</option>
            {wilayas.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
          </select>
          <select value={returnBaladiya} onChange={(e) => setReturnBaladiya(e.target.value)} required disabled={!returnWilaya} className="block w-1/2 p-2 border border-gray-300 rounded-md disabled:bg-gray-200">
            <option value="">{translations.selectBaladiya}</option>
            {availableReturnBaladiyates.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* Dates & Submit */}
      <div className="col-span-1 md:col-span-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">{translations.pickupDate}</label>
          <input type="date" id="pickupDate" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">{translations.returnDate}</label>
          <input type="date" id="returnDate" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600">{translations.search}</button>
      </div>
    </form>
  );
};

export default SearchForm;
