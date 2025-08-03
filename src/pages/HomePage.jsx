import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import SearchForm from '../components/SearchForm'; // Correction: Importation par défaut

const HomePage = () => {
  const { translations } = useLanguage();

  return (
    <div className="home-page">
      <header 
        className="hero-section text-center text-white py-20 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1966&auto=format&fit=crop')" }}
      >
        <div className="bg-black bg-opacity-50 py-10">
          <h1 className="text-5xl font-bold">{translations.heroTitle}</h1>
          <p className="mt-4 text-xl">{translations.heroSubtitle}</p>
        </div>
      </header>
      <main className="container mx-auto p-4 -mt-16 relative z-10">
        <SearchForm />
        {/* Vous pouvez ajouter d'autres sections ici */}
      </main>
    </div>
  );
};

export default HomePage;
