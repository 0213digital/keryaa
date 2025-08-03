import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppWrapper } from './contexts/AppContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Importations des composants de base
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardLayout from './components/DashboardLayout';

// Importations des pages principales
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

// Importations des pages du tableau de bord utilisateur
import ProfilePage from './pages/dashboard/ProfilePage';
import UserBookingsPage from './pages/dashboard/UserBookingsPage';

// Importations des pages de l'agence
import AgencyDashboard from './pages/agency/AgencyDashboard';
import AddVehiclePage from './pages/agency/AddVehiclePage';
import EditVehiclePage from './pages/agency/EditVehiclePage';
import AgencyBookingsPage from './pages/agency/AgencyBookingsPage';

// Importations des pages d'administration
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';
import UserDetailsPage from './pages/admin/UserDetailsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';

function App() {
  return (
    <Router>
      <AppWrapper>
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
                <Route path="/booking/:id" element={<BookingPage />} />
                <Route path="/confirmation" element={<BookingConfirmationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Routes imbriquées dans le tableau de bord */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="bookings" element={<UserBookingsPage />} />
                  <Route path="agency" element={<AgencyDashboard />} />
                  <Route path="agency/bookings" element={<AgencyBookingsPage />} />
                  <Route path="admin" element={<AdminDashboard />} />
                </Route>

                {/* Autres routes (vous pouvez aussi les imbriquer si nécessaire) */}
                <Route path="/add-vehicle" element={<AddVehiclePage />} />
                <Route path="/edit-vehicle/:id" element={<EditVehiclePage />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/users/:id" element={<UserDetailsPage />} />
                <Route path="/admin/bookings" element={<AdminBookingsPage />} />

              </Routes>
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </AppWrapper>
    </Router>
  );
}

export default App;
