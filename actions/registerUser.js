import { supabase } from '@/utils/supabase/client';

export const registerUser = async (email, password, nickname) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname },
    },
  });

  if (error) {
    throw error;
  }

  return data;
};
