import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Create a dummy client if env vars are not set (for development)
// This allows the app to load even without Supabase configured
let supabaseClient: ReturnType<typeof createClient>;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    '⚠️ VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are not set. ' +
    'Authentication will not work. Please configure your .env file.'
  );
  // Create a dummy client with placeholder values
  // This prevents the app from crashing, but auth won't work
  supabaseClient = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else {
  supabaseClient = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = supabaseClient;

