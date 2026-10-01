import { createClient } from '@supabase/supabase-js';

// Create React App: variáveis precisam começar com REACT_APP_
export const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);
