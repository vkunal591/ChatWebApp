"use client"
import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const Map = () => {
  useEffect(() => {
    // Initialize the map only after the component mounts
    const key = '0GNyoc4w4Y2N6kgPcVKo';
    const map = L.map('map').setView([49.2125578, 16.62662018], 14); // Starting position

    // Add MapTiler layer
    L.tileLayer(`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${key}`, {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
        '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
      crossOrigin: true,
    }).addTo(map);

    // Cleanup on unmount to prevent multiple maps
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: '500px', // Adjust height as needed
        borderRadius: '8px',
      }}
    ></div>
  );
};

export default Map;
