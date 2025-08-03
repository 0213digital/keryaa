import { createClient } from '@supabase/supabase-js'

// Lire les variables d'environnement de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Créer et exporter le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
