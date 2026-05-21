import { supabase } from '@/utils/supabase/client';

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error during sign out:', error);
  }
};
