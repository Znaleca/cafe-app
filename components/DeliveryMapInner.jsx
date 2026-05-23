'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiSearch, FiMapPin, FiCrosshair } from 'react-icons/fi';

// Fix missing marker icons in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DEFAULT_CENTER = { lat: 14.7456, lng: 120.5361 };

// Standalone fetch — no closures, no stale refs, no hoisting issues
async function fetchAddress(lat, lng) {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();

    const seen = new Set();
    const parts = [];

    const add = (val) => {
      if (val && val.trim() && !seen.has(val.trim())) {
        seen.add(val.trim());
        parts.push(val.trim());
      }
    };

    // Most specific: barangay/subdivision from administrative levels
    const admins = data.localityInfo?.administrative || [];
    // Higher adminLevel = more specific (barangay = 5+)
    const specific = admins
      .filter((a) => a.adminLevel >= 5)
      .sort((a, b) => b.adminLevel - a.adminLevel);
    if (specific.length > 0) add(specific[0].name);

    // Municipality / city
    add(data.city);

    // Postal code + Province together (e.g. "2112 Bataan")
    const postcode = data.postcode || '';
    const province = data.principalSubdivision || '';
    if (postcode || province) add(`${postcode} ${province}`.trim());

    return parts.length > 0 ? parts.join(', ') : null;
  } catch {
    return null;
  }
}

// Tiny component — just wires map click to a callback
function ClickHandler({ onClick }) {
  useMapEvents({ click: onClick });
  return null;
}

export default function DeliveryMapInner({ initialLocation, onConfirm, onCancel }) {
  const [position, setPosition] = useState(
    initialLocation?.lat ? { lat: initialLocation.lat, lng: initialLocation.lng } : null
  );
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mapRef, setMapRef] = useState(null);

  // Auto-geolocate on first load
  useEffect(() => {
    if (!position) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (loc) => setPosition({ lat: loc.coords.latitude, lng: loc.coords.longitude }),
          () => setPosition(DEFAULT_CENTER)
        );
      } else {
        setPosition(DEFAULT_CENTER);
      }
    }
  }, []);

  // Fly map whenever position changes (from search or geolocation)
  useEffect(() => {
    if (mapRef && position) {
      mapRef.flyTo([position.lat, position.lng], 16);
    }
  }, [position, mapRef]);

  // Called when user clicks anywhere on the map
  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    setPosition({ lat, lng });
    // Immediately try to reverse-geocode
    const fetched = await fetchAddress(lat, lng);
    if (fetched) {
      setAddress(fetched);
    }
    // If API failed, keep whatever the user already typed
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        const props = data.features[0].properties;
        const label = [props.name, props.city || props.county, props.country]
          .filter(Boolean).join(', ');
        setPosition({ lat, lng });
        setAddress(label || 'Selected Location');
      } else {
        alert('Location not found. Try a different search term.');
      }
    } catch (err) {
      console.warn('Search failed:', err.message);
      alert('Search is unavailable. Please pin your location manually on the map.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (loc) => setPosition({ lat: loc.coords.latitude, lng: loc.coords.longitude }),
        () => alert('Please allow location access in your browser.')
      );
    }
  };

  if (!position) {
    return (
      <div className="h-96 flex items-center justify-center bg-slate-50 rounded-2xl">
        <p className="text-slate-400 font-bold animate-pulse">Loading Map...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[85vh] sm:h-[70vh] w-full bg-white rounded-3xl overflow-hidden shadow-2xl relative">

      {/* Header & Search */}
      <div className="p-4 sm:p-6 bg-white border-b border-slate-100 z-10 shrink-0 shadow-sm relative">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2 mb-4">
          <FiMapPin className="text-sky-500" /> Pin Delivery Location
        </h2>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search address, city, e.g. Orani Bataan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Map */}
      <div className="flex-1 relative z-0">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={16}
          scrollWheelZoom={true}
          className="w-full h-full"
          zoomControl={false}
          ref={setMapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Click handler wired to parent — no stale closures */}
          <ClickHandler onClick={handleMapClick} />
          {/* Marker at current pin */}
          <Marker position={[position.lat, position.lng]} />
        </MapContainer>

        {/* Current Location button */}
        <button
          onClick={handleCurrentLocation}
          className="absolute bottom-6 right-6 z-[1000] p-4 bg-white text-sky-500 rounded-full shadow-lg border border-slate-100 hover:scale-105 transition-transform"
          title="Use my current location"
        >
          <FiCrosshair className="w-6 h-6" />
        </button>
      </div>

      {/* Footer — editable address */}
      <div className="p-4 sm:p-6 bg-white border-t border-slate-100 z-10 shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <label className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2 block">
          Delivery Address
          <span className="ml-2 normal-case font-normal tracking-normal">
            — auto-filled on map click, or type it yourself
          </span>
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Click the map to auto-fill, or type your address here..."
          rows={3}
          className="w-full text-sm font-medium text-slate-800 mb-4 bg-slate-50 p-4 rounded-xl border-2 border-slate-200 focus:border-sky-400 focus:outline-none focus:ring-0 resize-none transition-colors placeholder:text-slate-300"
        />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold uppercase tracking-wide text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ lat: position.lat, lng: position.lng, address })}
            disabled={!address.trim()}
            className="flex-1 py-3.5 bg-sky-500 text-white rounded-xl font-bold uppercase tracking-wide text-sm hover:bg-sky-400 transition-colors disabled:opacity-50"
          >
            Confirm Location
          </button>
        </div>
      </div>

    </div>
  );
}
