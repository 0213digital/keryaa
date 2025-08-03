import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// 1. Création du contexte
const AppContext = createContext();

// 2. Création du composant "Provider"
export const AppWrapper = ({ children }) => {
    const [session, setSession] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Récupérer la session au chargement initial
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Écouter les changements d'état d'authentification (connexion, déconnexion)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        // Nettoyer l'écouteur lorsque le composant est démonté
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    useEffect(() => {
        // Récupérer le profil de l'utilisateur lorsque la session change
        if (session?.user) {
            supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()
                .then(({ data, error }) => {
                    if (error) {
                        console.error('Error fetching user profile:', error.message);
                    } else {
                        setUserProfile(data);
                    }
                });
        } else {
            // Vider le profil si l'utilisateur se déconnecte
            setUserProfile(null);
        }
    }, [session]);

    const value = {
        session,
        user: session?.user, // L'utilisateur est dérivé de la session
        userProfile,
        loading,
        setSession // Utile pour la déconnexion manuelle si nécessaire
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// 3. Création du "hook" personnalisé pour utiliser le contexte
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext doit être utilisé à l\'intérieur d\'un AppWrapper');
    }
    return context;
};
