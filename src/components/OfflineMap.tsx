'use client';

import { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import Image from 'next/image';

interface MarkerType {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
}

export default function OfflineVectorMap() {
  const [viewport, setViewport] = useState<any>({
    latitude: 47.3769,
    longitude: 8.5417,
    zoom: 13,
  });

  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

  const [form, setForm] = useState({
    latitude: '',
    longitude: '',
    title: '',
    description: '',
  });

  // Load marker from URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get('lat');
    const lng = params.get('lng');
    const title = params.get('title');
    const desc = params.get('desc');
    if (lat && lng) {
      const m: MarkerType = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        title: title || 'Marker',
        description: desc || '',
      };
      setMarkers([m]);
      setViewport((prev: any) => ({
        ...prev,
        latitude: m.latitude,
        longitude: m.longitude,
        zoom: 15,
      }));
    }
  }, []);

  const handleAddMarker = () => {
    const { latitude, longitude, title, description } = form;
    if (!latitude || !longitude) return alert('Enter valid coordinates');

    const newMarker: MarkerType = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      title,
      description,
    };

    setMarkers((prev) => [...prev, newMarker]);
    setViewport((prev: any) => ({
      ...prev,
      latitude: newMarker.latitude,
      longitude: newMarker.longitude,
      zoom: 15,
    }));

    // Update URL for sharing
    const url = `${window.location.origin}?lat=${latitude}&lng=${longitude}&title=${encodeURIComponent(
      title
    )}&desc=${encodeURIComponent(description)}`;
    navigator.clipboard.writeText(url);
    alert('Marker added! Shareable link copied to clipboard.');
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      {/* Marker Input Form */}
      <div
        style={{
          position: 'absolute',
          zIndex: 1000,
          padding: 10,
          background: 'white',
          borderRadius: 4,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }}
      >
        <input
          placeholder="Latitude"
          value={form.latitude}
          onChange={(e) => setForm({ ...form, latitude: e.target.value })}
          style={{ margin: 2 }}
        />
        <input
          placeholder="Longitude"
          value={form.longitude}
          onChange={(e) => setForm({ ...form, longitude: e.target.value })}
          style={{ margin: 2 }}
        />
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ margin: 2 }}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ margin: 2 }}
        />
        <button style={{ margin: 2 }} onClick={handleAddMarker}>
          Add Marker
        </button>
      </div>

      {/* Map */}
      <Map
        viewState={viewport}
        mapStyle="http://localhost:8080/styles/basic-preview/style.json"
        style={{ width: '100%', height: '100%' }}
        onMove={(evt) => setViewport(evt.viewState)}
      >
        {markers.map((m, index) => (
          <Marker
            key={index}
            longitude={m.longitude}
            latitude={m.latitude}
            anchor="bottom"
            onClick={() => setSelectedMarker(index)}
          >
            <span role="img" aria-label="marker" style={{ cursor: 'pointer' }}>
              📍
            </span>
          </Marker>
        ))}

        {selectedMarker !== null && (
          <Popup
            longitude={markers[selectedMarker].longitude}
            latitude={markers[selectedMarker].latitude}
            anchor="top"
            closeOnClick={true}
            onClose={() => setSelectedMarker(null)}
          >
            <strong>{markers[selectedMarker].title}</strong>
            <br />
            {markers[selectedMarker].description}
          </Popup>
        )}
      </Map>

      {/* Thumbnails / Link */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          background: 'white',
          padding: 8,
          borderRadius: 4,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }}
      >
        {markers.map((m, idx) => (
          <div key={idx} style={{ marginBottom: 4 }}>
            <Image
              // src={`https://maps.googleapis.com/maps/api/staticmap?center=${m.latitude},${m.longitude}&zoom=15&size=200x100&markers=color:red%7C${m.latitude},${m.longitude}&key=YOUR_API_KEY`}
              src={'/assets/icons/mark.png'}
              width={50}
              height={50}
              alt={m.title}
              // style={{ cursor: 'pointer' }}
              onClick={() => {
                const url = `${window.location.origin}?lat=${m.latitude}&lng=${m.longitude}&title=${encodeURIComponent(
                  m.title
                )}&desc=${encodeURIComponent(m.description)}`;
                window.open(url, '_blank'); // opens in a new tab
              }}

            />
          </div>
        ))}
      </div>
    </div>
  );
}
