import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

const SignUpPage = () => {
  const { translations } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role: role } },
      });
      if (error) throw error;
      setMessage(translations.checkEmailForVerification);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-slate-800">{translations.createAccount}</h1>
        
        {message ? (
          <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
            <p>{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-600">{translations.fullName}</label>
              <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-4 py-3 mt-1 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600">{translations.email}</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 mt-1 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-600">{translations.password}</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 mt-1 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">{translations.accountType}</label>
              <div className="flex items-center space-x-4 mt-2">
                <label className="flex items-center"><input type="radio" name="role" value="user" checked={role === 'user'} onChange={(e) => setRole(e.target.value)} className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"/> <span className="ml-2 text-slate-700">{translations.user}</span></label>
                <label className="flex items-center"><input type="radio" name="role" value="agency" checked={role === 'agency'} onChange={(e) => setRole(e.target.value)} className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"/> <span className="ml-2 text-slate-700">{translations.agency}</span></label>
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <button type="submit" disabled={loading} className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 transition-colors">
                {loading ? `${translations.loading}...` : translations.signUp}
              </button>
            </div>
          </form>
        )}
        
        <p className="text-sm text-center text-slate-600">
          {translations.alreadyHaveAccount} <Link to="/login" className="font-medium text-blue-600 hover:underline">{translations.login}</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
