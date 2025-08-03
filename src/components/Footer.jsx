import React from 'react';
import { useLanguage } from '../contexts/LanguageContext'; // Correction ici

const Footer = () => {
  const { translations } = useLanguage(); // Correction ici
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} Keryaa. {translations.allRightsReserved}</p>
      </div>
    </footer>
  );
};

export default Footer;
