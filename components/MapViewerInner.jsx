'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiMapPin } from 'react-icons/fi';

// Fix missing marker icons in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapViewerInner({ lat, lng, address }) {
  if (!lat || !lng) return null;

  return (
    <div className="w-full h-64 bg-slate-50 rounded-2xl overflow-hidden border-2 border-sky-100 relative">
      <MapContainer 
        center={[lat, lng]} 
        zoom={16} 
        scrollWheelZoom={false} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <div className="text-sm font-semibold text-slate-800">{address}</div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="absolute top-2 right-2 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-sky-200 shadow-sm flex items-center gap-2">
        <FiMapPin className="w-3.5 h-3.5 text-sky-500" />
        <span className="text-xs font-bold text-sky-800 uppercase tracking-widest">Delivery Target</span>
      </div>
    </div>
  );
}
