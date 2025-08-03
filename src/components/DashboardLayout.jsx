import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

const DashboardLayout = () => {
  const { userProfile } = useAppContext();
  const { translations } = useLanguage();
  const navigate = useNavigate();

  // Redirect if no user profile is found
  React.useEffect(() => {
    if (!userProfile) {
      // navigate('/login');
    }
  }, [userProfile, navigate]);

  const getLinkClass = ({ isActive }) => 
    `block px-4 py-2 rounded-md ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`;

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <nav className="space-y-2">
          <NavLink to="profile" className={getLinkClass}>
            {translations.profile}
          </NavLink>
          <NavLink to="bookings" className={getLinkClass}>
            {translations.myBookings}
          </NavLink>
          
          {/* Conditional links based on user role */}
          {userProfile?.role === 'agency' && (
            <>
              <hr className="my-4"/>
              <NavLink to="agency" className={getLinkClass}>
                {translations.agencyDashboard}
              </NavLink>
              <NavLink to="agency/bookings" className={getLinkClass}>
                {translations.agencyBookings}
              </NavLink>
            </>
          )}

          {userProfile?.role === 'admin' && (
            <>
               <hr className="my-4"/>
               <NavLink to="admin" className={getLinkClass}>
                {translations.adminDashboard}
              </NavLink>
            </>
          )}
        </nav>
      </aside>
      <main className="w-full md:w-3/4 lg:w-4/5">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
