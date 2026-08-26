import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Compass, 
  Eye,
  Download,
  FileSpreadsheet,
  Layers,
  CheckCircle2,
  Share2
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
  const [exportNotice, setExportNotice] = useState(null);

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

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

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
        color: '#ffffff',
        weight: 2,
        dashArray: '4, 6',
        opacity: 0.9
      });
      markersLayer.addLayer(polyline);

      const swathPolygon = L.polygon([
        [19.5, 71.0], [19.1, 73.2], [15.0, 74.2],
        [9.5, 76.5], [11.5, 80.2], [13.5, 80.5],
        [15.5, 74.0], [19.5, 71.0]
      ], {
        color: '#ffffff',
        fillColor: '#ffffff',
        fillOpacity: 0.05,
        weight: 1,
        dashArray: '3, 3'
      });
      markersLayer.addLayer(swathPolygon);
    }

    if (showHeatmapZones) {
      filteredSamples.forEach(sample => {
        const circle = L.circle([sample.coordinates.lat, sample.coordinates.lng], {
          color: sample.riskLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b',
          fillColor: sample.riskLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b',
          fillOpacity: 0.15,
          weight: 1.5,
          radius: sample.riskLevel === 'CRITICAL' ? 35000 : 25000
        });
        markersLayer.addLayer(circle);
      });
    }

    filteredSamples.forEach(sample => {
      const pinColor = sample.riskLevel === 'CRITICAL' ? '#ef4444' : sample.riskLevel === 'HIGH' ? '#f59e0b' : '#3b82f6';
      
      const pinHtml = `
        <div style="
          width: 26px; height: 26px;
          background: #000000;
          border: 2px solid ${pinColor};
          border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 10px ${pinColor}88;
          cursor: pointer;
        ">
          <div style="width: 8px; height: 8px; background: ${pinColor}; border-radius: 2px;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-sonar-pin',
        html: pinHtml,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
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

  // Export GeoJSON hydrographic layer
  const handleExportGeoJSON = () => {
    const geoJsonData = {
      type: 'FeatureCollection',
      name: 'AeroAqua_DeepScan_Seabed_Hazards_2026',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' }
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        surveyor: 'National Institute of Oceanography (NIO) / Indian Coast Guard',
        missionId: 'SIH-2026-AUV-DEEPSCAN-ALPHA',
        totalFeatures: PRESET_SAMPLES.length
      },
      features: PRESET_SAMPLES.map(sample => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [sample.coordinates.lng, sample.coordinates.lat, -sample.depth]
        },
        properties: {
          id: sample.id,
          name: sample.name,
          category: sample.category,
          riskLevel: sample.riskLevel,
          riskScore: sample.riskScore,
          waterDepthMeters: sample.depth,
          auvAltitudeMeters: sample.altitude,
          slantRangeMeters: sample.slantRange,
          shadowLengthMeters: sample.shadowLength,
          estHeightMeters: sample.dimensions.estHeight,
          dimensions: `${sample.dimensions.length} x ${sample.dimensions.width}`,
          cleanupPriority: sample.cleanPriority,
          locationName: sample.coordinates.location,
          timestamp: sample.timestamp,
          acousticFrequency: sample.sonarParams?.frequency || '450 kHz'
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DeepScan_Seabed_Debris_Survey_${new Date().toISOString().slice(0,10)}.geojson`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotice('Exported GeoJSON (QGIS/ArcGIS ready)');
    setTimeout(() => setExportNotice(null), 3000);
  };

  // Export CSV table
  const handleExportCSV = () => {
    const headers = ['ID', 'Target Name', 'Category', 'Risk Level', 'Risk Score', 'Lat', 'Lng', 'Depth (m)', 'Est Height', 'Priority', 'Location'];
    const rows = PRESET_SAMPLES.map(s => [
      s.id,
      `"${s.name}"`,
      `"${s.category}"`,
      s.riskLevel,
      s.riskScore,
      s.coordinates.lat,
      s.coordinates.lng,
      s.depth,
      `"${s.dimensions.estHeight}"`,
      `"${s.cleanPriority}"`,
      `"${s.coordinates.location}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DeepScan_Marine_Debris_Log_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotice('Exported CSV Debris Table');
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div className="space-y-4 font-mono">
      
      {/* Top Banner & GIS Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black border border-neutral-800 rounded p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xl"
      >
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded bg-neutral-900 border border-neutral-700 text-white">
              <MapPin className="w-4 h-4" />
            </span>
            &gt; GEOSPATIAL_BATHYMETRIC_GIS_HUB
          </h2>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Georeferencing of AUV Side-Scan Sonar tracklines with seabed debris clustering &amp; standard GIS export.
          </p>
        </div>

        {/* Export & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Quick Notice Pill */}
          <AnimatePresence>
            {exportNotice && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] bg-neutral-900 text-white border border-neutral-600 px-2 py-1 rounded flex items-center gap-1 font-bold"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {exportNotice}
              </motion.span>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportGeoJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-white text-white hover:text-black border border-neutral-700 hover:border-white rounded text-xs font-mono font-bold transition-all cursor-pointer shadow-md"
            title="Download standard GeoJSON for QGIS / ArcGIS (Key: E)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>[ EXPORT_GEOJSON ]</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 rounded text-xs font-mono font-bold transition-all cursor-pointer"
            title="Download CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </motion.button>

          {/* Layer Filter Pills */}
          <div className="flex items-center gap-1 bg-black p-0.5 rounded border border-neutral-800 text-[11px]">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedFilter(lvl)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
                  selectedFilter === lvl ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                [{lvl}]
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 text-[11px] text-neutral-300 bg-black px-2.5 py-1 rounded border border-neutral-800">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showSwathCorridor}
                onChange={(e) => setShowSwathCorridor(e.target.checked)}
                className="accent-white"
              />
              SWATH_PATH
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showHeatmapZones}
                onChange={(e) => setShowHeatmapZones(e.target.checked)}
                className="accent-white"
              />
              HEATMAP
            </label>
          </div>
        </div>
      </motion.div>

      {/* Main Map & Interactive Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Leaflet Map (8 Cols) */}
        <div className="lg:col-span-8 bg-black border border-neutral-800 rounded overflow-hidden shadow-2xl relative">
          <div className="bg-black px-3 py-1.5 border-b border-neutral-800 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2 text-white font-bold">
              <Compass className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '30s' }} />
              <span>[COASTAL_MISSION_SECTOR: ARABIAN_SEA &amp; BAY_OF_BENGAL]</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-400">
              <span>SWEEP_AREA: <strong className="text-white">{SURVEY_STATS.totalSweepAreaSqKm} km²</strong></span>
            </div>
          </div>

          {/* Map Canvas Container */}
          <div className="relative w-full h-[540px]">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-black/95 border border-neutral-800 p-2.5 rounded text-[10px] font-mono space-y-1 shadow-xl">
              <span className="font-bold text-white block mb-0.5">[GEOSPATIAL_LEGEND]:</span>
              {[
                { label: '[P0_CRITICAL]: Ghost Net / Munition Hazard', color: 'bg-red-500' },
                { label: '[P1_HIGH]: Metal Drum / Container Debris', color: 'bg-amber-500' },
                { label: '[P2_MEDIUM]: Acoustic Anomaly / Biological Reef', color: 'bg-blue-500' }
              ].map((leg) => (
                <div key={leg.label} className="flex items-center gap-1.5 text-neutral-300">
                  <span className={`w-2 h-2 rounded-sm ${leg.color}`}></span>
                  <span>{leg.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-white pt-1 border-t border-neutral-800">
                <span className="w-3 h-0.5 bg-white"></span>
                <span>AUV Swath Survey Corridor</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Active Pin Inspector & Geotagged List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3 font-mono">
          
          {/* Active Target Card */}
          <AnimatePresence mode="wait">
            {activePin && (
              <div className="bg-black border border-neutral-800 rounded p-3.5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-[10px] text-neutral-400 uppercase">
                    &gt; GEOTAG_INSPECTOR
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-neutral-900 text-white border border-neutral-700">
                    [{activePin.riskLevel}]
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">&gt; {activePin.name}</h3>
                  <p className="text-[10px] text-neutral-400">{activePin.coordinates.location}</p>
                </div>

                <div className="p-2 bg-neutral-950 rounded border border-neutral-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-neutral-500 text-[9px] block">[LATITUDE]</span>
                    <span className="text-white font-bold">{activePin.coordinates.lat}° N</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[9px] block">[LONGITUDE]</span>
                    <span className="text-white font-bold">{activePin.coordinates.lng}° E</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[9px] block">[DEPTH]</span>
                    <span className="text-white font-bold">{activePin.depth}m</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[9px] block">[CONFIDENCE]</span>
                    <span className="text-white font-bold">{(activePin.anomalyConfidence * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-300">{activePin.description}</p>

                <button
                  onClick={() => onSelectSampleForStudio(activePin)}
                  className="w-full py-1.5 bg-neutral-900 hover:bg-white text-white hover:text-black border border-neutral-700 hover:border-white rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>[ ANALYZE_IN_ACOUSTIC_STUDIO ]</span>
                </button>
              </div>
            )}
          </AnimatePresence>

          {/* Quick Jump Geotagged List */}
          <div className="bg-black border border-neutral-800 rounded p-3 flex flex-col h-[280px] shadow-xl">
            <span className="text-xs font-bold text-white block mb-1.5 pb-1.5 border-b border-neutral-800">
              &gt; SURVEY_TARGETS ({PRESET_SAMPLES.length}):
            </span>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {PRESET_SAMPLES.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleFlyTo(sample)}
                  className={`p-2 rounded cursor-pointer transition-all border text-xs ${
                    activePin?.id === sample.id
                      ? 'bg-neutral-900 border-white text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">{sample.name}</span>
                    <span className="text-[9px] text-neutral-500">{sample.depth}m</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                    <span>{sample.coordinates.location}</span>
                    <span className="text-white hover:underline">[FLY_TO ▶]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
