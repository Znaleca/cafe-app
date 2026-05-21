'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadImage(formData) {
  try {
    const file = formData.get('image');
    
    if (!file || file.size === 0) {
      throw new Error('No file uploaded');
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename based on current time to avoid collisions
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // Keep original extension if present, otherwise default to .jpg
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${uniqueSuffix}.${extension}`;
    
    // Ensure the uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
    
    const filePath = join(uploadsDir, filename);
    await writeFile(filePath, buffer);
    
    // Return the public URL path
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Upload Error:', error);
    throw new Error('Failed to upload image.');
  }
}
