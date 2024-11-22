import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para o Supabase
export type Tables = {
  ordinances: {
    id: string;
    number: string;
    date: string;
    summary: string;
    link: string;
    created_at: string;
  };
  subscriptions: {
    id: string;
    email: string;
    whatsapp: string;
    created_at: string;
  };
};