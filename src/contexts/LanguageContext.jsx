import React, { createContext, useState, useContext } from 'react';
import { translations } from '../data/translations';

// 1. Création du contexte
const LanguageContext = createContext();

// 2. Création du composant "Provider" qui enveloppera votre application
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr'); // Langue par défaut : français

  const switchLanguage = (lang) => {
    setLanguage(lang);
  };

  // L'objet "value" qui sera accessible à tous les composants enfants
  const value = {
    language,
    translations: translations[language],
    switchLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// 3. Création du "hook" personnalisé pour utiliser le contexte facilement
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  // Ajout d'une vérification pour s'assurer que le hook est utilisé au bon endroit
  if (context === undefined) {
    // Correction de l'apostrophe échappée
    throw new Error('useLanguage doit être utilisé à l\'intérieur d\'un LanguageProvider');
  }
  return context;
};
