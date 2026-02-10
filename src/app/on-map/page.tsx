"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { Map, Marker } from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { kml as kmlToGeoJSON } from "@tmcw/togeojson";
import tokml from "tokml";
import jsPDF from "jspdf";

import Modal from "@/components/Modal";
import LocalChatDefForm from "@/components/LocalChatDefForm";

import "maplibre-gl/dist/maplibre-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

type MarkerType = {
  lat: number;
  lng: number;
  info: string;
  type: "Normal" | "Security";
};

export default function MapboxMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const markerRefs = useRef<Marker[]>([]);

  const [isClient, setIsClient] = useState(false);
  const [zoom] = useState(12);

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [modalLat, setModalLat] = useState("");
  const [modalLng, setModalLng] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedMarkerType, setSelectedMarkerType] = useState<
    "Normal" | "Security"
  >("Normal");

  useEffect(() => setIsClient(true), []);

  // ================= MAP INIT =================
  useEffect(() => {
    if (!isClient || mapRef.current || !mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "http://localhost:8080/styles/basic-preview/style.json",
      center: [77.1025, 28.6139],
      zoom,
      preserveDrawingBuffer: true, // critical
    } as any);

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,
        line_string: true,
        polygon: true,
        trash: true,
      },
      styles: [
        // POLYGON FILL
        {
          id: "gl-draw-polygon-fill",
          type: "fill",
          filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
          paint: {
            "fill-color": "#00ff99",
            "fill-opacity": 0.3,
          },
        },

        // POLYGON OUTLINE
        {
          id: "gl-draw-polygon-stroke",
          type: "line",
          filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
          paint: {
            "line-color": "#00ff99",
            "line-width": 2,
          },
        },

        // LINE STRING
        {
          id: "gl-draw-line",
          type: "line",
          filter: [
            "all",
            ["==", "$type", "LineString"],
            ["!=", "mode", "static"],
          ],
          paint: {
            "line-color": "#ffcc00",
            "line-width": 2,
            "line-dasharray": ["literal", [2, 2]], // ✅ FIX
          },
        },

        // POINT
        {
          id: "gl-draw-point",
          type: "circle",
          filter: ["all", ["==", "$type", "Point"], ["!=", "mode", "static"]],
          paint: {
            "circle-radius": 6,
            "circle-color": "#ff4444",
          },
        },
      ],
    });

    map.addControl(draw as any); // UI hidden via CSS

    mapRef.current = map;
    drawRef.current = draw;

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

    markers.forEach((m, index) => {
      const el = document.createElement("div");
      el.innerText = m.type === "Security" ? "🛡️" : "📍";
      el.style.fontSize = "28px";

      const marker = new maplibregl.Marker({
        element: el,
        draggable: true,
      })
        .setLngLat([m.lng, m.lat])
        .setPopup(
          new maplibregl.Popup().setHTML(
            `<strong>${m.info}</strong><br/>Lat: ${m.lat}<br/>Lng: ${m.lng}`,
          ),
        )
        .addTo(map);

      marker.on("dragend", () => {
        const p = marker.getLngLat();
        setMarkers((prev) =>
          prev.map((x, i) =>
            i === index ? { ...x, lat: p.lat, lng: p.lng } : x,
          ),
        );
      });

      markerRefs.current.push(marker);
    });
  }, [markers]);

  // ================= DRAW CONTROLS =================
  const drawPoint = () => drawRef.current?.changeMode("draw_point");
  const drawLine = () => drawRef.current?.changeMode("draw_line_string");
  const drawPolygon = () => drawRef.current?.changeMode("draw_polygon");
  const stopDrawing = () => drawRef.current?.changeMode("simple_select");

  const deleteSelected = () => drawRef.current?.trash();

  // ================= MARKER HANDLERS =================
  const handleAddMarker = () => {
    if (!lat || !lng) return;

    setMarkers((prev) => [
      ...prev,
      {
        lat: Number(lat),
        lng: Number(lng),
        info: "Manual Marker",
        type: selectedMarkerType,
      },
    ]);
  };

  const setManualLocation = () => {
    const latitude = parseFloat(modalLat);
    const longitude = parseFloat(modalLng);
    if (isNaN(latitude) || isNaN(longitude)) return;

    setMarkers((prev) => [
      ...prev,
      {
        lat: latitude,
        lng: longitude,
        info: "Manual Location",
        type: selectedMarkerType,
      },
    ]);

    setModalOpen(false);
  };

  // ================= MAP ACTIONS =================
  const resetMap = () => {
    drawRef.current?.deleteAll();
    markerRefs.current.forEach((m) => m.remove());
    markerRefs.current = [];
    setMarkers([]);
  };

  // ================= KML EXPORT =================
  const exportKML = () => {
    if (!drawRef.current) return;

    const drawData = drawRef.current.getAll();

    const markerFeatures = markers.map((m) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [m.lng, m.lat],
      },
      properties: {
        name: m.info,
        type: m.type,
      },
    }));

    const geojson = {
      type: "FeatureCollection",
      features: [...drawData.features, ...markerFeatures],
    };

    const kml = tokml(geojson as any);
    const blob = new Blob([kml], {
      type: "application/vnd.google-earth.kml+xml",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "defence-map.kml";
    a.click();
  };

  // ================= KML IMPORT =================
  const importKML = async (file: File) => {
    if (!drawRef.current) return;

    const text = await file.text();
    const xml = new DOMParser().parseFromString(text, "application/xml");
    const geojson = kmlToGeoJSON(xml) as GeoJSON.FeatureCollection;

    drawRef.current.add({
      type: "FeatureCollection",
      features: geojson.features.map((f, i) => ({
        ...f,
        id: f.id ?? `kml-${i}`,
      })),
    });
  };

  // ================= PDF EXPORT =================
  // ------------------ REVERSE GEOCODING ------------------
  async function getPlaceName(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      );
      const data = await res.json();
      return data.display_name || "Unknown location";
    } catch (err) {
      console.error("Failed to fetch place name", err);
      return "Unknown location";
    }
  }

  // ------------------ EXPORT PDF ------------------
  // ------------------ EXPORT PDF ------------------
  const exportPDF = async () => {
    const map = mapRef.current;
    if (!map) return;

    // wait until map fully renders
    await new Promise<void>((resolve) => {
      if (map.loaded()) resolve();
      else map.once("idle", () => resolve());
    });

    const mapCanvas = map.getCanvas();
    const width = mapCanvas.width;
    const height = mapCanvas.height;

    // Create a new canvas for final rendering
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ------------------ 1️⃣ Draw map background ------------------
    ctx.drawImage(mapCanvas, 0, 0);

    // ------------------ 2️⃣ Project function ------------------
    const project = ([lng, lat]: [number, number]) => {
      const p = map.project([lng, lat]);
      return [p.x, p.y];
    };

    const drawData = drawRef.current?.getAll() ?? {
      type: "FeatureCollection",
      features: [],
    };

    // ------------------ 3️⃣ Draw polygons ------------------
    drawData.features
      .filter((f) => f.geometry.type === "Polygon")
      .forEach((f: any) => {
        ctx.fillStyle = "rgba(0,255,153,0.35)";
        ctx.strokeStyle = "#00ff99";
        ctx.lineWidth = 2;

        ctx.beginPath();
        f.geometry.coordinates.forEach((ring: any) => {
          ring.forEach(([lng, lat]: [number, number], i: number) => {
            const [x, y] = project([lng, lat]);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

    // ------------------ 4️⃣ Draw dashed lines ------------------
    drawData.features
      .filter((f) => f.geometry.type === "LineString")
      .forEach((f: any) => {
        ctx.strokeStyle = "#ffcc00";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);

        ctx.beginPath();
        f.geometry.coordinates.forEach(
          ([lng, lat]: [number, number], i: number) => {
            const [x, y] = project([lng, lat]);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          },
        );
        ctx.stroke();
        ctx.setLineDash([]);
      });

    // ------------------ 5️⃣ Draw points from MapboxDraw ------------------
    drawData.features
      .filter((f) => f.geometry.type === "Point")
      .forEach((f: any) => {
        const [x, y] = project(f.geometry.coordinates);
        ctx.fillStyle = "#ff4444";
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

    // ------------------ 6️⃣ Draw custom markers with place names ------------------
    // Fetch all place names in parallel for faster performance
    const placeNames = await Promise.all(
      markers.map((m) => getPlaceName(m.lat, m.lng)),
    );

    markers.forEach((m, index) => {
      const [x, y] = project([m.lng, m.lat]);
      const placeName = placeNames[index];

      ctx.fillStyle = m.type === "Security" ? "#1E90FF" : "#FF4500";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw text label
      ctx.font = "14px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.strokeText(placeName, x + 10, y - 10);
      ctx.fillText(placeName, x + 10, y - 10);
    });

    // ------------------ 7️⃣ Export as PDF ------------------
    // IMPORTANT: Use your **final canvas** here
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: width > height ? "landscape" : "portrait",
      unit: "px",
      format: [width, height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("defence-map.pdf");
  };

  // ================= UI =================
  return (
    <div className="flex h-screen bg-[#05160fee] text-[#e5e7eb] relative">
      {/* HEADER */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex flex-wrap gap-2 bg-[#020617]/90 border border-emerald-500/30 px-4 py-2 rounded-lg">
        <button onClick={resetMap} className="px-3 py-1 bg-red-600 rounded">
          New Map
        </button>
        <button
          onClick={drawPoint}
          className="px-3 py-1 bg-emerald-600 rounded"
        >
          Placemark
        </button>
        <button onClick={drawLine} className="px-3 py-1 bg-sky-600 rounded">
          Path
        </button>
        <button
          onClick={drawPolygon}
          className="px-3 py-1 bg-orange-600 rounded"
        >
          Polygon
        </button>
        <button
          onClick={deleteSelected}
          className="px-3 py-1 bg-yellow-600 rounded"
        >
          Delete
        </button>
        <button onClick={stopDrawing} className="px-3 py-1 bg-gray-600 rounded">
          Stop
        </button>
        <button onClick={exportKML} className="px-3 py-1 bg-blue-600 rounded">
          Export KML
        </button>
        <button onClick={exportPDF} className="px-3 py-1 bg-purple-600 rounded">
          Export PDF
        </button>
      </div>

      {/* LEFT PANEL */}
      <div className="w-1/4 p-6 bg-[#07522c] space-y-4">
        <h1 className="text-xl font-bold text-emerald-400 text-center">
          DEFENCE CONTROL
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="w-full bg-emerald-600 py-2 rounded"
        >
          Defence Form
        </button>

        <Modal open={open} onClose={() => setOpen(false)}>
          <LocalChatDefForm />
        </Modal>

        <button
          onClick={() => setModalOpen(true)}
          className="w-full bg-indigo-600 py-2 rounded"
        >
          Select Location
        </button>

        <input
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="w-full p-2 bg-black border rounded"
        />
        <input
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="w-full p-2 bg-black border rounded"
        />

        <select
          value={selectedMarkerType}
          onChange={(e) => setSelectedMarkerType(e.target.value as any)}
          className="w-full p-2 bg-black border rounded"
        >
          <option value="Normal">Normal</option>
          <option value="Security">Security</option>
        </select>

        <button
          onClick={handleAddMarker}
          className="w-full bg-blue-600 py-2 rounded"
        >
          Add Marker
        </button>

        <label className="block bg-purple-600 py-2 rounded text-center cursor-pointer">
          Import KML
          <input
            type="file"
            hidden
            accept=".kml"
            onChange={(e) => e.target.files && importKML(e.target.files[0])}
          />
        </label>
      </div>

      {/* MAP */}
      <div ref={mapContainer} className="w-3/4 h-full" />

      {/* COORD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-[#020617] p-6 rounded space-y-3">
            <input
              placeholder="Latitude"
              value={modalLat}
              onChange={(e) => setModalLat(e.target.value)}
              className="w-full p-2 bg-black border rounded"
            />
            <input
              placeholder="Longitude"
              value={modalLng}
              onChange={(e) => setModalLng(e.target.value)}
              className="w-full p-2 bg-black border rounded"
            />
            <div className="flex gap-2">
              <button
                onClick={setManualLocation}
                className="flex-1 bg-green-600 rounded"
              >
                Set
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 bg-red-600 rounded"
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
