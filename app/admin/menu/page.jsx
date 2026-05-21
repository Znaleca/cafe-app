'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { uploadImage } from '@/actions/uploadImage';
import { FiEdit2, FiTrash2, FiCoffee, FiPlus } from 'react-icons/fi';
import Image from 'next/image';

export default function MenuManagementPage() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'add'
  
  const [menuItems, setMenuItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Add Item State
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: 'Coffee' });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  // Edit Item State
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '', price: '', category: 'Coffee' });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editMessage, setEditMessage] = useState('');

  useEffect(() => {
    async function fetchMenuItems() {
      setIsFetching(true);
      try {
        const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setMenuItems(data || []);
      } catch (error) {
        console.error("Error fetching menu items:", error.message);
      } finally {
        setIsFetching(false);
      }
    }
    
    if (activeTab === 'menu') {
      fetchMenuItems();
    }
  }, [activeTab]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!imageFile) {
      setMessage('Error: Please select an image to upload.');
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append('image', imageFile);
      const imageUrl = await uploadImage(uploadData);

      const { error } = await supabase
        .from('menu_items')
        .insert([{
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image_url: imageUrl
        }]);

      if (error) {
        if (error.code === '42501') throw new Error("Permission denied. Are you an admin?");
        throw error;
      }
      
      setMessage('Item added successfully!');
      setFormData({ name: '', description: '', price: '', category: 'Coffee' });
      setImageFile(null);
      const fileInput = document.getElementById('add_image_upload');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const startEditing = (item) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category
    });
    setEditImageFile(null);
    setEditMessage('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditMessage('');
    try {
      let imageUrl = editingItem.image_url;
      
      if (editImageFile) {
        const uploadData = new FormData();
        uploadData.append('image', editImageFile);
        imageUrl = await uploadImage(uploadData);
      }

      const { error } = await supabase
        .from('menu_items')
        .update({
          name: editFormData.name,
          description: editFormData.description,
          price: parseFloat(editFormData.price),
          category: editFormData.category,
          image_url: imageUrl
        })
        .eq('id', editingItem.id);

      if (error) throw error;
      
      setMenuItems(menuItems.map(item => item.id === editingItem.id ? { ...item, ...editFormData, image_url: imageUrl } : item));
      setEditingItem(null);
    } catch (error) {
      setEditMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Menu Management</h1>
        <p className="text-slate-500 mt-1">Add, edit, or remove items from your cafe's menu.</p>
      </div>

      {/* TABS */}
      <div className="flex space-x-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
        {[
          { id: 'menu', label: 'Manage Menu', icon: FiCoffee },
          { id: 'add', label: 'Add Item', icon: FiPlus }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setEditingItem(null); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              activeTab === tab.id 
                ? 'bg-white text-sky-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* MANAGE MENU */}
      {activeTab === 'menu' && !editingItem && (
        <div className="glass-panel p-8 rounded-3xl">
          {isFetching ? (
            <div className="text-center py-12 text-slate-400">Loading menu items...</div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No items found. Add some!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-sky-100 text-slate-400 text-sm uppercase tracking-wider">
                    <th className="pb-4 font-semibold">Item</th>
                    <th className="pb-4 font-semibold">Category</th>
                    <th className="pb-4 font-semibold">Price</th>
                    <th className="pb-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {menuItems.map(item => (
                    <tr key={item.id} className="hover:bg-sky-50/50 transition-colors">
                      <td className="py-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-sky-100 relative overflow-hidden shrink-0 border border-slate-100">
                          {item.image_url && <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="48px" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-400 line-clamp-1 max-w-[250px]">{item.description}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="tag-pill bg-sky-100/50 text-sky-700">{item.category}</span>
                      </td>
                      <td className="py-4 font-bold text-sky-600">${Number(item.price).toFixed(2)}</td>
                      <td className="py-4 text-right space-x-2">
                        <button onClick={() => startEditing(item)} className="p-2 text-sky-500 hover:bg-sky-100 rounded-lg transition-colors">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* EDITING MODE */}
      {activeTab === 'menu' && editingItem && (
        <div className="glass-panel p-8 rounded-3xl max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Edit Item: {editingItem.name}</h2>
            <button onClick={() => setEditingItem(null)} className="text-sm font-bold text-slate-400 hover:text-slate-600">Cancel</button>
          </div>
          {editMessage && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${editMessage.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-sky-50 text-sky-700'}`}>
              {editMessage}
            </div>
          )}
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                <select value={editFormData.category} onChange={(e) => setEditFormData({...editFormData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-400">
                  <option value="Coffee">Coffee</option><option value="Tea">Tea</option><option value="Pastry">Pastry</option><option value="Merch">Merch</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
              <textarea value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} rows="3" className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-400"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Price ($)</label>
                <input type="number" step="0.01" value={editFormData.price} onChange={(e) => setEditFormData({...editFormData, price: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">New Image (Optional)</label>
                <input type="file" accept="image/*" onChange={(e) => setEditImageFile(e.target.files[0])} className="w-full px-4 py-1.5 rounded-xl border border-sky-100 bg-white/70 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 text-sm" />
              </div>
            </div>
            <button type="submit" className="w-full py-3.5 mt-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold shadow-lg shadow-sky-200 transition-all active:scale-95">Save Changes</button>
          </form>
        </div>
      )}

      {/* ADD ITEM */}
      {activeTab === 'add' && (
        <div className="glass-panel p-8 rounded-3xl max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Menu Item</h2>
          {message && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-400">
                  <option value="Coffee">Coffee</option><option value="Tea">Tea</option><option value="Pastry">Pastry</option><option value="Merch">Merch</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-400"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Price ($)</label>
                <input type="number" name="price" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Image Upload</label>
                <input id="add_image_upload" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required className="w-full px-4 py-1.5 rounded-xl border border-sky-100 bg-white/70 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 text-sm" />
              </div>
            </div>
            <button type="submit" className="w-full py-3.5 mt-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold shadow-lg shadow-sky-200 transition-all active:scale-95">Add Item</button>
          </form>
        </div>
      )}
    </div>
  );
}
