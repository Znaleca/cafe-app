import { supabase } from '@/utils/supabase/client';

export const getMenu = async () => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
};
