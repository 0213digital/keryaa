import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import SearchForm from '../components/SearchForm';
import VehicleCard from '../components/VehicleCard'; // We'll use the redesigned card

// Sample data for featured vehicles
const featuredVehicles = [
  { id: 1, make: 'Toyota', model: 'Yaris', year: 2023, price_per_day: 45, image_url: 'https://images.unsplash.com/photo-1617469747575-65c631387554?q=80&w=1964&auto=format&fit=crop' },
  { id: 2, make: 'Hyundai', model: 'Tucson', year: 2022, price_per_day: 60, image_url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=1931&auto=format&fit=crop' },
  { id: 3, make: 'Peugeot', model: '3008', year: 2023, price_per_day: 65, image_url: 'https://images.unsplash.com/photo-1617551821940-835d383793ea?q=80&w=1964&auto=format&fit=crop' },
];

const HomePage = () => {
  const { translations } = useLanguage();

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <header 
        className="relative text-white h-[60vh] min-h-[400px] flex items-center justify-center text-center"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1966&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{translations.heroTitle}</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">{translations.heroSubtitle}</p>
        </div>
      </header>

      {/* Search Form Section */}
      <div className="relative z-20 -mt-16 container mx-auto px-4">
        <SearchForm />
      </div>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* How It Works Section */}
        <section className="text-center my-16">
          <h2 className="text-3xl font-bold text-slate-800">{translations.howItWorks}</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl text-blue-600 mb-4">1.</div>
              <h3 className="text-xl font-semibold">{translations.search}</h3>
              <p className="mt-2 text-slate-600">{translations.howItWorksSearch}</p>
            </div>
            <div className="p-6">
              <div className="text-4xl text-blue-600 mb-4">2.</div>
              <h3 className="text-xl font-semibold">{translations.book}</h3>
              <p className="mt-2 text-slate-600">{translations.howItWorksBook}</p>
            </div>
            <div className="p-6">
              <div className="text-4xl text-blue-600 mb-4">3.</div>
              <h3 className="text-xl font-semibold">{translations.drive}</h3>
              <p className="mt-2 text-slate-600">{translations.howItWorksDrive}</p>
            </div>
          </div>
        </section>

        {/* Featured Vehicles Section */}
        <section className="my-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center">{translations.featuredVehicles}</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
