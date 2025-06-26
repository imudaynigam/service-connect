"use client";
import { useState } from "react";
import { supabase } from '../../lib/supabaseClient';

export default function ServicePopup({ 
  onSave, 
  onClose, 
  initialData 
}: { 
  onSave: (serviceData: any) => void, 
  onClose: () => void, 
  initialData?: any 
}) {
  const [serviceName, setServiceName] = useState(initialData?.service_name || "");
  const [customServiceName, setCustomServiceName] = useState("");
  const [cost, setCost] = useState(initialData?.cost || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Get the final service name (either from dropdown or custom input)
  const getFinalServiceName = () => {
    return serviceName === "Custom Service" ? customServiceName : serviceName;
  };

  async function uploadImage(file: File, userId: string) {
    const fileExt = file.name.split('.').pop();
    const filePath = `service-images/${userId}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('service-images').upload(filePath, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('service-images').getPublicUrl(filePath);
    return data.publicUrl;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");
      
      let imageUrl = initialData?.image_url || null;
      if (image) {
        imageUrl = await uploadImage(image, user.id);
      }
      
      const serviceData = {
        provider_id: user.id,
        service_name: getFinalServiceName(),
        service_type: initialData?.service_type || 'main',
        cost,
        description,
        image_url: imageUrl,
      };

      if (initialData?.id) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        // Insert new service
        const { data, error } = await supabase.from('services').insert(serviceData).select().single();
        if (error) throw error;
        
        // Insert notification
        const { error: notifError } = await supabase.from('notifications').insert({
          provider_id: user.id,
          message: `New service added: ${getFinalServiceName()}`,
        });
        if (notifError) {
          console.error('Notification insert error:', notifError);
        }
        
        onSave(data);
      }
      
      setMessage("Service saved!");
      onClose();
    } catch (err: any) {
      console.error('Service creation error:', err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 relative w-full max-w-lg mx-4">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Edit Service' : 'Add New Service'}
          </h2>
          <p className="text-gray-600 mt-2">
            {initialData ? 'Update your service details' : 'Create a new service to showcase your skills'}
          </p>
        </div>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm ${
            message.includes('error') || message.includes('failed') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Service Type
            </label>
            <select
              value={serviceName}
              onChange={e => setServiceName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select a service type</option>
              <option value="Catering Service">Catering Service</option>
              <option value="Photography">Photography</option>
              <option value="Decoration">Decoration</option>
              <option value="Music & Entertainment">Music & Entertainment</option>
              <option value="Transportation">Transportation</option>
              <option value="Makeup & Styling">Makeup & Styling</option>
              <option value="Venue Booking">Venue Booking</option>
              <option value="Wedding Planning">Wedding Planning</option>
              <option value="Event Management">Event Management</option>
              <option value="Custom Service">Custom Service</option>
            </select>
          </div>
          
          {serviceName === "Custom Service" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Custom Service Name</label>
              <input
                type="text"
                placeholder="Enter custom service name"
                value={customServiceName}
                onChange={e => setCustomServiceName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Service Cost
            </label>
            <input
              type="number"
              placeholder="Enter service cost"
              value={cost}
              onChange={e => setCost(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Description
            </label>
            <textarea
              placeholder="Describe your service, what's included, and any special features..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Service Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                {initialData ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              initialData ? 'Update Service' : 'Create Service'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
