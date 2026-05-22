import { supabase } from '@/utils/supabase/client';

export async function uploadImage(formData) {
  try {
    const file = formData.get('image');
    
    if (!file || file.size === 0) {
      throw new Error('No file uploaded');
    }
    
    // Create unique filename based on current time to avoid collisions
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // Keep original extension if present, otherwise default to .jpg
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${uniqueSuffix}.${extension}`;

    const filePath = `menu-images/${filename}`;
    const { error } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return filePath;
  } catch (error) {
    console.error('Upload Error:', error);
    throw new Error('Failed to upload image.');
  }
}
