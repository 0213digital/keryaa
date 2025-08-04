import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

const DashboardLayout = () => {
  const { userProfile } = useAppContext();
  const { translations } = useLanguage();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userProfile) {
      // navigate('/login');
    }
  }, [userProfile, navigate]);

  const getLinkClass = ({ isActive }) => 
    `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white font-semibold shadow-md' 
        : 'text-slate-600 hover:bg-slate-200'
    }`;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <div className="p-4 bg-white rounded-lg shadow-md sticky top-24">
              <nav className="space-y-2">
                <NavLink to="/dashboard/profile" className={getLinkClass}>
                  {translations.profile}
                </NavLink>
                <NavLink to="/dashboard/bookings" className={getLinkClass}>
                  {translations.myBookings}
                </NavLink>
                
                {userProfile?.role === 'agency' && (
                  <>
                    <hr className="my-3 border-slate-200"/>
                    <NavLink to="/agency-dashboard" className={getLinkClass}>
                      {translations.agencyDashboard}
                    </NavLink>
                    <NavLink to="/agency-bookings" className={getLinkClass}>
                      {translations.agencyBookings}
                    </NavLink>
                  </>
                )}

                {userProfile?.role === 'admin' && (
                  <>
                     <hr className="my-3 border-slate-200"/>
                     <NavLink to="/admin-dashboard" className={getLinkClass}>
                      {translations.adminDashboard}
                    </NavLink>
                  </>
                )}
              </nav>
            </div>
          </aside>
          <main className="w-full md:w-3/4 lg:w-4/5">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
