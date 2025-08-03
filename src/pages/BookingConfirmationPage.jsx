import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppContext } from '../contexts/AppContext';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const { translations } = useLanguage();
  const { userProfile } = useAppContext();

  // Les données de la réservation sont passées via l'état de la navigation
  const { vehicle, startDate, endDate, totalPrice } = location.state || {};

  if (!vehicle) {
    return (
      <div className="container mx-auto text-center p-10">
        <h1 className="text-2xl font-bold text-red-600">{translations.error}</h1>
        <p className="mt-4">{translations.noBookingDataFound}</p>
        <Link to="/" className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          {translations.backToHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">{translations.bookingConfirmed}</h1>
          <p className="mt-2 text-gray-600">{translations.confirmationEmailSent} {userProfile?.email}</p>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-800">{translations.summary}</h2>
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-700">{translations.vehicle}:</span>
              <span className="font-semibold text-gray-900">{vehicle.make} {vehicle.model}</span>
            </div>
            <div className="flex justify-between py-2 border-t">
              <span className="font-medium text-gray-700">{translations.pickupDate}:</span>
              <span className="font-semibold text-gray-900">{new Date(startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-2 border-t">
              <span className="font-medium text-gray-700">{translations.returnDate}:</span>
              <span className="font-semibold text-gray-900">{new Date(endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-2 border-t text-xl">
              <span className="font-medium text-gray-700">{translations.totalPrice}:</span>
              <span className="font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300">
            {translations.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
