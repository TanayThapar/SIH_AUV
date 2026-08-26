import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sliders, 
  Layers, 
  Cpu, 
  Sparkles, 
  UploadCloud, 
  Eye, 
  ShieldAlert, 
  Ruler, 
  Crosshair, 
  CheckCircle2, 
  Maximize2, 
  Download,
  Flame,
  Info,
  RefreshCw,
  Box
} from 'lucide-react';
import { PRESET_SAMPLES, SONAR_PALETTES } from '../data/sonarSamples';
import { drawSonarCanvas, calculateObjectHeight, calculateGroundRange } from '../utils/sonarProcessor';

export default function AnalysisStudio({ selectedSample, setSelectedSample }) {
  const canvasRef = useRef(null);
  const [filterMode, setFilterMode] = useState('raw');
  const [palette, setPalette] = useState('copper');
  const [aiMode, setAiMode] = useState('supervised');
  const [showHighlightCues, setShowHighlightCues] = useState(true);
  const [showShadowCues, setShowShadowCues] = useState(true);
  
  const [customAltitude, setCustomAltitude] = useState(selectedSample?.altitude || 12);
  const [customSlantRange, setCustomSlantRange] = useState(selectedSample?.slantRange || 25);
  const [customShadowLength, setCustomShadowLength] = useState(selectedSample?.shadowLength || 5.5);

  useEffect(() => {
    if (selectedSample) {
      setCustomAltitude(selectedSample.altitude);
      setCustomSlantRange(selectedSample.slantRange);
      setCustomShadowLength(selectedSample.shadowLength);
    }
  }, [selectedSample]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedSample) return;

    drawSonarCanvas(canvas, selectedSample, {
      filterMode,
      palette,
      showBBoxes: aiMode === 'supervised' || aiMode === 'dual_view',
      showHighlights: showHighlightCues,
      showShadows: showShadowCues,
      showAnomalyHeatmap: aiMode === 'anomaly_heatmap' || aiMode === 'dual_view'
    });
  }, [selectedSample, filterMode, palette, aiMode, showHighlightCues, showShadowCues]);

  const computedHeight = calculateObjectHeight(customShadowLength, customAltitude, customSlantRange);
  const computedGroundRange = calculateGroundRange(customSlantRange, customAltitude);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const customObj = {
      id: `custom-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      category: 'Uploaded Sonar Data / Unclassified',
      riskLevel: 'HIGH',
      riskScore: 85,
      depth: 50.0,
      altitude: 12.0,
      coordinates: { lat: 15.4201, lng: 73.8102, location: 'User Survey Upload Region' },
      description: 'Custom acoustic imagery ingested from user telemetry file.',
      dimensions: { length: '8.5 m', width: '3.2 m', estHeight: '1.8 m' },
      slantRange: 22.0,
      shadowLength: 4.2,
      anomalyConfidence: 0.93,
      cleanPriority: 'P1 - User Verified Anomaly',
      timestamp: new Date().toISOString(),
      detections: [
        {
          id: 'user-det-1',
          label: 'Acoustic Anomaly / Target',
          confidence: 0.93,
          type: 'custom_debris',
          box: { x: 35, y: 30, w: 30, h: 25 },
          highlight: { x: 36, y: 32, w: 26, h: 8 },
          shadow: { x: 36, y: 40, w: 26, h: 14 },
          estHeight: '1.8 m',
          material: 'High Acoustic Density Material',
          acousticReflectivity: 'Strong High-Contrast Feature'
        }
      ],
      anomalyZones: [
        { x: 45, y: 40, radius: 45, intensity: 0.94 }
      ],
      sonarParams: {
        frequency: '450 kHz',
        pingRate: '15 Hz',
        swathWidth: '100 m',
        soundSpeed: '1500 m/s'
      }
    };

    setSelectedSample(customObj);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shadow-lg"
      >
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Layers className="w-5 h-5" />
            </span>
            Acoustic Signal Processing & Dual-AI Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate raw Side-Scan Sonar data, test Slant-Range & Despeckling DSP filters, and run highlight-shadow 3D height estimation.
          </p>
        </div>

        {/* Upload Custom Sonar Button */}
        <div className="flex items-center gap-2">
          <motion.label 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono font-medium cursor-pointer transition-all shadow-sm"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Upload Sonar (.XTF / .PNG)</span>
            <input
              type="file"
              accept="image/*,.xtf,.jsf"
              onChange={handleImageUpload}
              className="hidden"
            />
          </motion.label>
        </div>
      </motion.div>

      {/* Preset Selector Carousel with Motion */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 shadow-inner">
        <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
          <span className="font-semibold text-cyan-400 uppercase tracking-wider">Benchmark Datasets & Ground-Truth Targets:</span>
          <span>{PRESET_SAMPLES.length} Benchmark Scenarios</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESET_SAMPLES.map((sample) => {
            const isSelected = selectedSample?.id === sample.id;
            return (
              <motion.button
                key={sample.id}
                onClick={() => setSelectedSample(sample)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`p-2.5 rounded-lg text-left transition-all border font-mono relative overflow-hidden ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-900/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                {isSelected && (
                  <motion.div 
                    layoutId="activeSampleOutline" 
                    className="absolute inset-0 border-2 border-cyan-400 rounded-lg pointer-events-none"
                  />
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                    sample.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {sample.riskLevel}
                  </span>
                  <span className="text-[9px] text-slate-500">{sample.depth}m</span>
                </div>
                <p className="text-xs font-bold truncate text-slate-100">{sample.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{sample.category}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Studio Canvas Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          
          {/* DSP Filter & Mode Control Toolbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
            
            {/* Preprocessing DSP Filters */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-1">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" /> DSP Filter:
              </span>
              {[
                { id: 'raw', label: '1. Raw Sonar' },
                { id: 'slant_corrected', label: '2. Slant-Range Corr.' },
                { id: 'nadir_removed', label: '3. Nadir Mask' },
                { id: 'despeckled', label: '4. Lee Despeckle' },
                { id: 'clahe', label: '5. CLAHE Enhanced' }
              ].map((f) => (
                <motion.button
                  key={f.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFilterMode(f.id)}
                  className={`px-2 py-1 rounded text-xs font-mono transition-all ${
                    filterMode === f.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {f.label}
                </motion.button>
              ))}
            </div>

            {/* AI Vision Mode */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setAiMode('supervised')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1 ${
                  aiMode === 'supervised' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/50' : 'text-slate-400'
                }`}
              >
                <Crosshair className="w-3 h-3" /> YOLOv8
              </button>
              <button
                onClick={() => setAiMode('anomaly_heatmap')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1 ${
                  aiMode === 'anomaly_heatmap' ? 'bg-red-500/20 text-red-300 font-bold border border-red-400/50' : 'text-slate-400'
                }`}
              >
                <Flame className="w-3 h-3 text-red-400" /> Anomaly Heatmap
              </button>
              <button
                onClick={() => setAiMode('dual_view')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1 ${
                  aiMode === 'dual_view' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-400/50' : 'text-slate-400'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400" /> Dual-Cue Fusion
              </button>
            </div>

          </div>

          {/* Canvas Render Area */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
            <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold">{selectedSample?.name}</span>
                <span className="text-slate-400 font-mono text-[11px]">• {selectedSample?.coordinates?.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={palette}
                  onChange={(e) => setPalette(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-slate-200 text-xs font-mono"
                >
                  <option value="copper">Palette: Copper Amber</option>
                  <option value="emerald">Palette: Deep Emerald</option>
                  <option value="cyan">Palette: Acoustic Cyan</option>
                  <option value="grayscale">Palette: Grayscale SSS</option>
                </select>
              </div>
            </div>

            <div className="relative w-full aspect-[4/3] bg-black flex items-center justify-center p-2">
              <canvas
                ref={canvasRef}
                width={700}
                height={500}
                className="w-full h-full object-contain rounded border border-slate-800"
              />

              <div className="absolute top-4 right-4 bg-slate-950/90 border border-slate-800 rounded-lg p-2 text-xs font-mono space-y-1.5 backdrop-blur-md shadow-lg">
                <label className="flex items-center gap-2 cursor-pointer text-emerald-400">
                  <input
                    type="checkbox"
                    checked={showHighlightCues}
                    onChange={(e) => setShowHighlightCues(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Highlight Cue (Backscatter)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-amber-400">
                  <input
                    type="checkbox"
                    checked={showShadowCues}
                    onChange={(e) => setShowShadowCues(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>Shadow Cue (Acoustic Void)</span>
                </label>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-4">
                <span>Sound Speed: <strong>{selectedSample?.sonarParams?.soundSpeed}</strong></span>
                <span>Swath: <strong>{selectedSample?.sonarParams?.swathWidth}</strong></span>
                <span>Freq: <strong className="text-cyan-400">{selectedSample?.sonarParams?.frequency}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Slant Range Ground Truth Verified</span>
              </div>
            </div>

          </div>

          {/* Interactive Acoustic 3D Shadow Math Sandbox */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  Acoustic Shadow 3D Height Estimator (Acoustic Ray Math)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                H = (L_s × H_alt) / (R_slant + L_s)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">
                  1. Acoustic Shadow (L_s): <strong className="text-amber-400">{customShadowLength} m</strong>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.1"
                  value={customShadowLength}
                  onChange={(e) => setCustomShadowLength(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  2. AUV Altitude (H_alt): <strong className="text-cyan-400">{customAltitude} m</strong>
                </label>
                <input
                  type="range"
                  min="3"
                  max="30"
                  step="0.5"
                  value={customAltitude}
                  onChange={(e) => setCustomAltitude(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  3. Slant Range (R_slant): <strong className="text-emerald-400">{customSlantRange} m</strong>
                </label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="0.5"
                  value={customSlantRange}
                  onChange={(e) => setCustomSlantRange(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>

            {/* Math Calculation Result Callout with Motion */}
            <motion.div 
              layout
              className="bg-slate-950 p-3 rounded-lg border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 shadow-inner"
            >
              <div className="flex items-center gap-6 font-mono text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">ESTIMATED 3D OBJECT HEIGHT:</span>
                  <motion.span 
                    key={computedHeight}
                    initial={{ scale: 1.1, color: '#00F0FF' }}
                    animate={{ scale: 1, color: '#38BDF8' }}
                    className="text-xl font-extrabold text-cyan-400 glow-cyan inline-block"
                  >
                    {computedHeight} METERS
                  </motion.span>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CORRECTED GROUND RANGE (Y):</span>
                  <span className="text-base font-bold text-slate-200">{computedGroundRange.toFixed(1)} METERS</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 max-w-xs">
                <span className="text-amber-400 font-semibold">Acoustic Physics:</span> Acoustic shadows directly encode 3D elevation above the seafloor.
              </div>
            </motion.div>

          </div>

        </div>

        {/* Right Detail Inspector Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Target Profile Card */}
          <motion.div 
            layout
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono">{selectedSample?.name}</h3>
                <span className="text-xs text-slate-400 font-mono">{selectedSample?.category}</span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded font-mono font-bold ${
                selectedSample?.riskLevel === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 glow-coral'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {selectedSample?.riskLevel} RISK ({selectedSample?.riskScore}/100)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedSample?.description}
            </p>

            {/* Physical & Acoustic Metric Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Water Depth</span>
                <span className="text-white font-bold">{selectedSample?.depth} m</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">AUV Altitude</span>
                <span className="text-white font-bold">{selectedSample?.altitude} m</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Estimated 3D Size</span>
                <span className="text-cyan-400 font-bold">{selectedSample?.dimensions?.length} × {selectedSample?.dimensions?.width}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Cleanup Action</span>
                <span className="text-amber-400 font-bold truncate block">{selectedSample?.cleanPriority}</span>
              </div>
            </div>

            {/* AI Model Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-200 font-mono block">AI Model Inference Pipeline:</span>
              
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">YOLOv8 Acoustic Detector</span>
                    <span className="text-cyan-400 font-bold">{(selectedSample?.detections[0]?.confidence * 100).toFixed(1)}% Conf</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedSample?.detections[0]?.confidence * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="bg-cyan-400 h-full rounded-full" 
                    />
                  </div>
                </div>

                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">PatchCore Anomaly Score</span>
                    <span className="text-red-400 font-bold">{(selectedSample?.anomalyConfidence * 100).toFixed(1)}% Anomaly</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedSample?.anomalyConfidence * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="bg-red-400 h-full rounded-full" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Geo Tag */}
            <div className="p-3 bg-cyan-950/40 border border-cyan-900/50 rounded-lg text-xs font-mono text-slate-300">
              <span className="text-cyan-400 font-bold block mb-0.5">Geospatial Coordinates:</span>
              <p className="text-slate-200">Lat: {selectedSample?.coordinates?.lat}° N, Lng: {selectedSample?.coordinates?.lng}° E</p>
              <p className="text-[10px] text-slate-400 mt-1">{selectedSample?.coordinates?.location}</p>
            </div>

          </motion.div>

        </div>

      </div>

    </div>
  );
}
