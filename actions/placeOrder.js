'use server';

import { createClient } from '@supabase/supabase-js';

export async function placeOrder({ userId, items, totalAmount }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const orderItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    quantity: item.quantity,
    category: item.category,
    image_url: item.image_url || null,
  }));

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        user_id: userId,
        status: 'pending',
        total_amount: totalAmount,
        items: orderItems,
      },
    ])
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
}
