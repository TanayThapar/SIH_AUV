import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Compass, 
  Eye
} from 'lucide-react';
import { PRESET_SAMPLES, SURVEY_STATS } from '../data/sonarSamples';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function GeospatialMapView({ onSelectSampleForStudio }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [showSwathCorridor, setShowSwathCorridor] = useState(true);
  const [showHeatmapZones, setShowHeatmapZones] = useState(true);
  const [activePin, setActivePin] = useState(PRESET_SAMPLES[0]);

  const centerLat = 14.5;
  const centerLng = 75.5;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 6,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap',
        maxZoom: 18,
      }).addTo(map);

      // Layer group to easily manage markers/polygons without recreating the map
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Invalidate size to handle Framer Motion / flex layout sizing
      const resizeTimer = setTimeout(() => {
        map.invalidateSize();
      }, 200);

      return () => {
        clearTimeout(resizeTimer);
        map.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      };
    }
  }, []);

  // Update Layers & Markers on filter or toggle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const filteredSamples = PRESET_SAMPLES.filter(s => {
      if (selectedFilter === 'ALL') return true;
      return s.riskLevel === selectedFilter;
    });

    if (showSwathCorridor) {
      const trackPoints = PRESET_SAMPLES.map(s => [s.coordinates.lat, s.coordinates.lng]);
      const polyline = L.polyline(trackPoints, {
        color: '#00f0ff',
        weight: 3,
        dashArray: '6, 8',
        opacity: 0.85
      });
      markersLayer.addLayer(polyline);

      const swathPolygon = L.polygon([
        [19.5, 71.0], [19.1, 73.2], [15.0, 74.2],
        [9.5, 76.5], [11.5, 80.2], [13.5, 80.5],
        [15.5, 74.0], [19.5, 71.0]
      ], {
        color: '#00f0ff',
        fillColor: '#00f0ff',
        fillOpacity: 0.08,
        weight: 1,
        dashArray: '4, 4'
      });
      markersLayer.addLayer(swathPolygon);
    }

    if (showHeatmapZones) {
      filteredSamples.forEach(sample => {
        const circle = L.circle([sample.coordinates.lat, sample.coordinates.lng], {
          color: sample.riskLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b',
          fillColor: sample.riskLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b',
          fillOpacity: 0.25,
          radius: sample.riskLevel === 'CRITICAL' ? 35000 : 25000
        });
        markersLayer.addLayer(circle);
      });
    }

    filteredSamples.forEach(sample => {
      const isCritical = sample.riskLevel === 'CRITICAL';
      const isHigh = sample.riskLevel === 'HIGH';

      const pinHtml = `
        <div style="
          width: 28px; height: 28px;
          background: ${isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#10b981'};
          border: 2px solid #ffffff; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 14px ${isCritical ? 'rgba(239,68,68,0.8)' : 'rgba(245,158,11,0.8)'};
          cursor: pointer;
        ">
          <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-sonar-pin',
        html: pinHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([sample.coordinates.lat, sample.coordinates.lng], { icon: customIcon })
        .on('click', () => setActivePin(sample));

      markersLayer.addLayer(marker);
    });

  }, [selectedFilter, showSwathCorridor, showHeatmapZones]);

  const handleFlyTo = (sample) => {
    setActivePin(sample);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([sample.coordinates.lat, sample.coordinates.lng], 9, {
        duration: 1.5
      });
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner & GIS Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shadow-lg"
      >
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <MapPin className="w-5 h-5" />
            </span>
            Geospatial Debris Mapping & Bathymetric GIS Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time georeferencing of AUV Side-Scan Sonar tracklines with seabed debris clustering and density heatmaps.
          </p>
        </div>

        {/* Layer Toggles & Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((lvl) => (
              <motion.button
                key={lvl}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedFilter(lvl)}
                className={`px-2.5 py-1 rounded transition-all relative ${
                  selectedFilter === lvl ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {selectedFilter === lvl && (
                  <motion.div
                    layoutId="filterPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-cyan-500/20 border border-cyan-400/50 rounded"
                  />
                )}
                <span className="relative z-10">{lvl}</span>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showSwathCorridor}
                onChange={(e) => setShowSwathCorridor(e.target.checked)}
                className="accent-cyan-500 rounded"
              />
              AUV Swath Path
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showHeatmapZones}
                onChange={(e) => setShowHeatmapZones(e.target.checked)}
                className="accent-red-500 rounded"
              />
              Density Heatmap
            </label>
          </div>
        </div>
      </motion.div>

      {/* Main Map & Interactive Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Leaflet Map (8 Cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative"
        >
          <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '30s' }} />
              <span>COASTAL MISSION SECTOR: ARABIAN SEA & BAY OF BENGAL</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span>Sweep Area: <strong className="text-emerald-400">{SURVEY_STATS.totalSweepAreaSqKm} km²</strong></span>
            </div>
          </div>

          {/* Map Canvas Container */}
          <div className="relative w-full h-[540px]">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-slate-950/95 border border-slate-800 p-3 rounded-lg text-xs font-mono space-y-1.5 shadow-xl backdrop-blur-md">
              <span className="font-bold text-slate-200 block text-[11px] mb-1">Geospatial Risk Legend:</span>
              {[
                { color: 'bg-red-500', text: 'text-red-400', label: 'Critical Risk (P0 / P1 Extraction)' },
                { color: 'bg-amber-500', text: 'text-amber-400', label: 'High Hazard (Navigational obstacle)' },
                { color: 'bg-emerald-500', text: 'text-emerald-400', label: 'Medium Hazard (Biological / Wreck)' }
              ].map((leg) => (
                <div key={leg.label} className={`flex items-center gap-2 ${leg.text}`}>
                  <span className={`w-3 h-3 rounded-full ${leg.color}`}></span>
                  <span>{leg.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-cyan-400 pt-1 border-t border-slate-800">
                <span className="w-3 h-0.5 bg-cyan-400"></span>
                <span>AUV Swath Survey Corridor</span>
              </div>
            </div>
          </div>

        </motion.div>

        {/* Right Active Pin Inspector & Geotagged List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Target Card */}
          <AnimatePresence mode="wait">
            {activePin && (
              <motion.div
                key={activePin.id}
                initial={{ opacity: 0, x: 16, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -16, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                    Target Geotag Inspector
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    activePin.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {activePin.riskLevel} PRIORITY
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-mono">{activePin.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{activePin.coordinates.location}</p>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Latitude</span>
                    <span className="text-slate-200 font-bold">{activePin.coordinates.lat}° N</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Longitude</span>
                    <span className="text-slate-200 font-bold">{activePin.coordinates.lng}° E</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Seafloor Depth</span>
                    <span className="text-cyan-400 font-bold">{activePin.depth} m</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">AI Confidence</span>
                    <span className="text-emerald-400 font-bold">{(activePin.anomalyConfidence * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300">{activePin.description}</p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectSampleForStudio(activePin)}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-900/30"
                >
                  <Eye className="w-4 h-4" />
                  Analyze Sonar In Acoustic Studio
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Jump Geotagged List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-[280px] shadow-xl">
            <span className="text-xs font-bold text-slate-200 font-mono block mb-2 pb-2 border-b border-slate-800">
              Survey Targets ({PRESET_SAMPLES.length}):
            </span>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {PRESET_SAMPLES.map((sample) => (
                <motion.div
                  key={sample.id}
                  onClick={() => handleFlyTo(sample)}
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-2 rounded-lg cursor-pointer transition-all border font-mono text-xs ${
                    activePin?.id === sample.id
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 truncate">{sample.name}</span>
                    <span className="text-[10px] text-slate-500">{sample.depth}m</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>{sample.coordinates.location}</span>
                    <span className="text-cyan-400">Fly To ▶</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
