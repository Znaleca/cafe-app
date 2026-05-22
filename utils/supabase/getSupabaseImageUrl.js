import { supabase } from '@/utils/supabase/client';

export function getSupabaseImageUrl(imageValue) {
  if (!imageValue) {
    return '';
  }

  if (/^https?:\/\//i.test(imageValue)) {
    return imageValue;
  }

  if (imageValue.startsWith('/')) {
    return imageValue;
  }

  const { data } = supabase.storage.from('menu-images').getPublicUrl(imageValue);
  return data?.publicUrl || '';
}