import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppContext } from '../contexts/AppContext';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const { translations } = useLanguage();
  const { userProfile } = useAppContext();

  const { vehicle, startDate, endDate, totalPrice } = location.state || {};

  if (!vehicle) {
    return (
      <div className="container mx-auto text-center p-10">
        <h1 className="text-2xl font-bold text-red-600">{translations.error}</h1>
        <p className="mt-4">{translations.noBookingDataFound}</p>
        <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          {translations.backToHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="mt-5 text-3xl font-extrabold text-slate-900">{translations.bookingConfirmed}</h1>
        <p className="mt-2 text-slate-600">{translations.confirmationEmailSent} <strong>{userProfile?.email}</strong></p>

        <div className="mt-8 text-left border-t border-slate-200 pt-8">
          <h2 className="text-lg font-semibold text-slate-800">{translations.summary}</h2>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
              <span className="font-medium text-slate-600">{translations.vehicle}:</span>
              <span className="font-semibold text-slate-800">{vehicle.make} {vehicle.model}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
              <span className="font-medium text-slate-600">{translations.pickupDate}:</span>
              <span className="font-semibold text-slate-800">{new Date(startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
              <span className="font-medium text-slate-600">{translations.returnDate}:</span>
              <span className="font-semibold text-slate-800">{new Date(endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg text-xl">
              <span className="font-bold text-slate-700">{translations.totalPrice}:</span>
              <span className="font-extrabold text-blue-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/" className="w-full inline-flex justify-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
            {translations.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
