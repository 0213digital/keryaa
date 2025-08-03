import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';

const UserDetailsPage = () => {
  const { id } = useParams();
  const { translations } = useLanguage();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        // This is a placeholder. You'd need a secure admin function
        // to get a single user's details.
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading) {
    return <div>{translations.loading}...</div>;
  }

  if (!userDetails) {
    return <div>{translations.userNotFound}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{translations.userDetails}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p><strong>{translations.fullName}:</strong> {userDetails.full_name}</p>
        <p><strong>{translations.email}:</strong> {userDetails.email || 'N/A'}</p>
        <p><strong>{translations.role}:</strong> {userDetails.role}</p>
        {/* Add more user details as needed */}
      </div>
    </div>
  );
};

export default UserDetailsPage;
