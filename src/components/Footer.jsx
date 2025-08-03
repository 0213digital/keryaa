import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { translations } = useLanguage();
  const currentYear = new Date().getFullYear();

  // Simple social icons
  const socialLinks = [
    { name: 'Facebook', href: '#', icon: 'fab fa-facebook-f' },
    { name: 'Twitter', href: '#', icon: 'fab fa-twitter' },
    { name: 'Instagram', href: '#', icon: 'fab fa-instagram' },
  ];

  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold text-white">Keryaa</h3>
            <p className="mt-4 text-sm">{translations.heroSubtitle}</p>
          </div>
          {/* Links */}
          <div>
            <h4 className="font-semibold text-white">{translations.company}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white">{translations.aboutUs}</Link></li>
              <li><Link to="/contact" className="hover:text-white">{translations.contact}</Link></li>
            </ul>
          </div>
          {/* Support */}
          <div>
            <h4 className="font-semibold text-white">{translations.support}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-white">{translations.faq}</Link></li>
              <li><Link to="/terms" className="hover:text-white">{translations.termsOfService}</Link></li>
            </ul>
          </div>
          {/* Language Selector could go here */}
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-slate-400">&copy; {currentYear} Keryaa. {translations.allRightsReserved}</p>
          {/* Social Media Links can be added here */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
