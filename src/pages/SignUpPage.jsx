import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'agency'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (authError) throw authError;

      // The user is signed up but needs to confirm their email.
      setMessage(translations.checkEmailForVerification);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">{translations.createAccount}</h1>
        
        {message ? (
          <p className="text-center text-green-600">{message}</p>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">{translations.fullName}</label>
              <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">{translations.email}</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">{translations.password}</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{translations.accountType}</label>
              <div className="flex items-center space-x-4 mt-1">
                <label><input type="radio" name="role" value="user" checked={role === 'user'} onChange={(e) => setRole(e.target.value)} /> {translations.user}</label>
                <label><input type="radio" name="role" value="agency" checked={role === 'agency'} onChange={(e) => setRole(e.target.value)} /> {translations.agency}</label>
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <button type="submit" disabled={loading} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                {loading ? `${translations.loading}...` : translations.signUp}
              </button>
            </div>
          </form>
        )}
        
        <p className="text-sm text-center text-gray-600">
          {translations.alreadyHaveAccount} <Link to="/login" className="font-medium text-blue-600 hover:underline">{translations.login}</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
