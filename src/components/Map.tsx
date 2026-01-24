"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { Map, Marker } from "maplibre-gl";
import Modal from "./Modal";
import LocalChatDefForm from "./LocalChatDefForm";
import "maplibre-gl/dist/maplibre-gl.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type MarkerType = {
  lat: number;
  lng: number;
  info: string;
  type: "Normal" | "Security";
};

export default function MapboxMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRefs = useRef<Marker[]>([]);

  const [isClient, setIsClient] = useState(false);
  const [zoom] = useState(12);

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  const [modalLat, setModalLat] = useState("");
  const [modalLng, setModalLng] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [searchLat, setSearchLat] = useState("");
  const [searchLng, setSearchLng] = useState("");
   const [open, setOpen] = useState<boolean>(false);
  const [selectedMarkerType, setSelectedMarkerType] = useState("Normal");

  useEffect(() => setIsClient(true), []);

  // ================= PDF =================
  const generateRoutePDF = async () => {
    // const mapEl = document.getElementById("map");
    // if (!mapEl) return;

    // const canvas = await html2canvas(mapEl);
    // const imgData = canvas.toDataURL("image/png");

    // const pdf = new jsPDF("landscape");
    // pdf.text(`Route: ${fromCity} → ${toCity}`, 10, 10);
    // pdf.addImage(imgData, "PNG", 10, 20, 270, 150);
    // pdf.save("route-map.pdf");
  };

  // ================= MAP INIT =================
  useEffect(() => {
    if (!isClient || mapRef.current || !mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "http://localhost:8080/styles/basic-preview/style.json",
      center: [77.1025, 28.6139], // default Delhi
      zoom,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [isClient, zoom]);

  // ================= MARKERS =================
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markerRefs.current.forEach((m) => m.remove());
    markerRefs.current = [];

    // markers.forEach((m, index) => {
    //   const el = document.createElement("div");
    //   el.innerText = m.type === "Security" ? "🛡️" : "📍";
    //   el.style.fontSize = "28px";

    //   const marker = new maplibregl.Marker({
    //     element: el,
    //     draggable: true,
    //   })
    //     .setLngLat([m.lng, m.lat])
    //     .setPopup(
    //       new maplibregl.Popup().setHTML(
    //         `<strong>${m.info}</strong><br/>Lat: ${m.lat}<br/>Lng: ${m.lng}`,
    //       ),
    //     )
    //     .addTo(map);

    //   marker.on("dragend", () => {
    //     const p = marker.getLngLat();
    //     setMarkers((prev) =>
    //       prev.map((x, i) =>
    //         i === index ? { ...x, lat: p.lat, lng: p.lng } : x,
    //       ),
    //     );
    //   });

    //   markerRefs.current.push(marker);
    // });
  }, [markers]);

  // ================= ROUTE =================
  useEffect(() => {
    const map = mapRef.current;
    if (!map || markers.length < 2) return;

    const drawRoute = async () => {
      const geometry = await fetchRoadRoute(markers);
      if (!geometry) return;

      const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
        type: "Feature",
        geometry,
        properties: {},
      };

      const source = map.getSource("route") as maplibregl.GeoJSONSource;

      if (source) {
        source.setData(geojson);
      } else {
        map.addSource("route", {
          type: "geojson",
          data: geojson,
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#00ff6a",
            "line-width": 5,
          },
        });
      }

      setTimeout(generateRoutePDF, 800);
    };

    if (map.isStyleLoaded()) {
      drawRoute();
    } else {
      map.once("load", drawRoute);
    }
  }, [markers]);

  // ================= HANDLERS =================
  const handleAddMarker = () => {
    if (!lat || !lng) return;

    setMarkers((prev) => [
      ...prev,
      {
        lat: Number(lat),
        lng: Number(lng),
        info: "Manual Marker",
        type: "Normal",
      },
    ]);
  };

  const geocodeCity = async (city: string) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${city}`,
    );
    const data = await res.json();

    if (!data.length) throw new Error("City not found");

    return {
      lat: Number(data[0].lat),
      lng: Number(data[0].lon),
    };
  };
  const fetchRoadRoute = async (points: MarkerType[]) => {
    if (points.length < 2) return null;

    const coords = points.map((p) => `${p.lng},${p.lat}`).join(";");

    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`,
    );

    const data = await res.json();
    return data.routes[0].geometry;
  };

  const setManualLocation = () => {
    const latitude = parseFloat(modalLat);
    const longitude = parseFloat(modalLng);

    if (isNaN(latitude) || isNaN(longitude)) return;

    // ✅ keep input states string
    setLat(modalLat);
    setLng(modalLng);

    setMarkers((prev) => [
      ...prev,
      {
        lat: latitude,
        lng: longitude,
        info: "Manual Location",
        type: selectedMarkerType as "Normal" | "Security",
      },
    ]);

    setModalOpen(false);
  };

  const handleFindRoute = async () => {
    try {
      const from = await geocodeCity(fromCity);
      const to = await geocodeCity(toCity);

      setMarkers([
        { ...from, info: fromCity, type: "Normal" },
        { ...to, info: toCity, type: "Normal" },
      ]);
    } catch {
      alert("Invalid city name");
    }
  };

  // ================= UI (UNCHANGED) =================
  return (
    <div className="flex h-screen bg-[#2c3e50] text-white">
      {/* LEFT PANEL */}
      <div className="w-1/4 p-6 bg-[#14724c] space-y-6">
        {/* ===== ADD MARKER SECTION ===== */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Add Marker</h2>
          <button
            onClick={() => setOpen(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer"
          >
            Defence Form
          </button>

          <Modal open={open} onClose={() => setOpen(false)}>
            <LocalChatDefForm />
          </Modal>
          <button
            onClick={() => setModalOpen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded cursor-pointer"
          >
            Select Location
          </button>

          <input
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="w-full p-2 rounded text-black"
          />

          <input
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="w-full p-2 rounded text-black"
          />

          <select
            value={selectedMarkerType}
            onChange={(e) => setSelectedMarkerType(e.target.value)}
            className="w-full p-2 rounded text-black cursor-pointer"
          >
            <option value="normal">Normal</option>
            <option value="security">Security</option>
          </select>

          <button
            onClick={handleAddMarker}
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded cursor-pointer"
          >
            Add Marker
          </button>
        </div>

        <hr className="border-white/20" />

        {/* ===== FIND ROUTE SECTION ===== */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Find Route</h2>

          <input
            placeholder="From City (e.g. Delhi)"
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            className="w-full p-2 rounded text-black"
          />

          <input
            placeholder="To City (e.g. Noida)"
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            className="w-full p-2 rounded text-black"
          />

          <button
            onClick={handleFindRoute}
            className="w-full bg-green-600 hover:bg-green-700 p-2 rounded cursor-pointer"
          >
            Find Route
          </button>
        </div>
      </div>

      {/* MAP */}
      <div id="map" ref={mapContainer} className="w-3/4 h-full" />

      {/* ===== SELECT LOCATION MODAL ===== */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#2c3e50] p-6 rounded w-80 space-y-3">
            <h3 className="text-lg font-semibold">Set Location</h3>

            <input
              placeholder="Latitude"
              value={modalLat}
              onChange={(e) => setModalLat(e.target.value)}
              className="w-full p-2 rounded text-black"
            />

            <input
              placeholder="Longitude"
              value={modalLng}
              onChange={(e) => setModalLng(e.target.value)}
              className="w-full p-2 rounded text-black"
            />

            <div className="flex gap-2">
              <button
                onClick={setManualLocation}
                className="flex-1 bg-green-600 hover:bg-green-700 p-2 rounded cursor-pointer"
              >
                Set
              </button>

              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 bg-red-600 hover:bg-red-700 p-2 rounded cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
