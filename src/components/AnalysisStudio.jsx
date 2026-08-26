import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sliders, 
  Layers, 
  UploadCloud, 
  Ruler, 
  Crosshair, 
  CheckCircle2, 
  Flame,
  Sparkles,
  Columns,
  Maximize2,
  Box,
  Radio,
  Eye,
  Info
} from 'lucide-react';
import { PRESET_SAMPLES, SONAR_PALETTES } from '../data/sonarSamples';
import { drawSonarCanvas, calculateObjectHeight, calculateGroundRange } from '../utils/sonarProcessor';

export default function AnalysisStudio({ selectedSample, setSelectedSample }) {
  const canvasRef = useRef(null);
  const rawCanvasRef = useRef(null);
  
  const [filterMode, setFilterMode] = useState('raw');
  const [palette, setPalette] = useState('copper');
  const [aiMode, setAiMode] = useState('supervised');
  const [showHighlightCues, setShowHighlightCues] = useState(true);
  const [showShadowCues, setShowShadowCues] = useState(true);
  
  // Split Comparison Slider state
  const [splitMode, setSplitMode] = useState('enhanced'); // 'raw', 'split', 'enhanced'
  const [splitPos, setSplitPos] = useState(50); // percentage

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

  // Main Enhanced Canvas
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

  // Raw Comparison Canvas (for split mode)
  useEffect(() => {
    const canvas = rawCanvasRef.current;
    if (!canvas || !selectedSample || splitMode !== 'split') return;

    drawSonarCanvas(canvas, selectedSample, {
      filterMode: 'raw',
      palette: 'grayscale',
      showBBoxes: false,
      showHighlights: false,
      showShadows: false,
      showAnomalyHeatmap: false
    });
  }, [selectedSample, splitMode]);

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
    <div className="space-y-4 font-mono">
      
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black border border-neutral-800 rounded p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xl"
      >
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded bg-neutral-900 border border-neutral-700 text-white">
              <Layers className="w-4 h-4" />
            </span>
            &gt; ACOUSTIC_SIGNAL_PROCESSING_STUDIO
          </h2>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Evaluate raw Side-Scan Sonar data, test Slant-Range &amp; Despeckling DSP filters, and run 3D shadow math.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Split Comparison Mode Switcher */}
          <div className="flex items-center bg-black p-0.5 rounded border border-neutral-800 text-[11px]">
            <button
              onClick={() => setSplitMode('raw')}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold ${
                splitMode === 'raw' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
              title="Show Raw Unprocessed Sonar Only"
            >
              [RAW]
            </button>
            <button
              onClick={() => setSplitMode('split')}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold flex items-center gap-1 ${
                splitMode === 'split' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
              title="Split-Screen Comparison: Raw vs. AI Enhanced (Key: S)"
            >
              <Columns className="w-3 h-3" />
              <span>[SPLIT 50/50]</span>
            </button>
            <button
              onClick={() => setSplitMode('enhanced')}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold ${
                splitMode === 'enhanced' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
              title="Show AI Enhanced & DSP Corrected View"
            >
              [AI_ENHANCED]
            </button>
          </div>

          <motion.label 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 px-3 py-1 bg-black hover:bg-neutral-900 text-white border border-neutral-700 hover:border-white rounded text-xs font-mono font-bold cursor-pointer transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5 text-white" />
            <span>[ UPLOAD_SONAR ]</span>
            <input
              type="file"
              accept="image/*,.xtf,.jsf"
              onChange={handleImageUpload}
              className="hidden"
            />
          </motion.label>
        </div>
      </motion.div>

      {/* Preset Selector Carousel */}
      <div className="bg-black border border-neutral-800 rounded p-2.5 shadow-inner">
        <div className="text-[10px] font-mono text-neutral-400 mb-1.5 flex items-center justify-between">
          <span className="font-bold text-white uppercase">[ BENCHMARK_DATASETS_&amp;_TARGETS ]:</span>
          <span>[{PRESET_SAMPLES.length} SCENARIOS]</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESET_SAMPLES.map((sample) => {
            const isSelected = selectedSample?.id === sample.id;
            return (
              <motion.button
                key={sample.id}
                onClick={() => setSelectedSample(sample)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`p-2 rounded text-left transition-all border font-mono relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 border-white text-white'
                    : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] px-1 py-0.2 rounded font-bold bg-black text-white border border-neutral-700">
                    [{sample.riskLevel}]
                  </span>
                  <span className="text-[9px] text-neutral-500">{sample.depth}m</span>
                </div>
                <p className="text-xs font-bold truncate text-white">{sample.name}</p>
                <p className="text-[10px] text-neutral-400 truncate">{sample.category}</p>
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
          <div className="bg-black border border-neutral-800 rounded p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-md">
            
            {/* Preprocessing DSP Filters */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1 mr-1">
                <Sliders className="w-3 h-3 text-white" /> DSP:
              </span>
              {[
                { id: 'raw', label: '1. RAW' },
                { id: 'slant_corrected', label: '2. SLANT_CORR' },
                { id: 'nadir_removed', label: '3. NADIR_MASK' },
                { id: 'despeckled', label: '4. LEE_DESPECKLE' },
                { id: 'clahe', label: '5. CLAHE' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterMode(f.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                    filterMode === f.id
                      ? 'bg-white text-black font-bold'
                      : 'text-neutral-400 hover:text-white bg-black border border-neutral-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* AI Vision Mode */}
            <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded border border-neutral-800 text-[11px]">
              <button
                onClick={() => setAiMode('supervised')}
                className={`px-2 py-0.5 rounded font-mono transition-all flex items-center gap-1 cursor-pointer ${
                  aiMode === 'supervised' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Crosshair className="w-3 h-3" /> YOLO-11
              </button>
              <button
                onClick={() => setAiMode('anomaly_heatmap')}
                className={`px-2 py-0.5 rounded font-mono transition-all flex items-center gap-1 cursor-pointer ${
                  aiMode === 'anomaly_heatmap' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Flame className="w-3 h-3" /> HEATMAP
              </button>
              <button
                onClick={() => setAiMode('dual_view')}
                className={`px-2 py-0.5 rounded font-mono transition-all flex items-center gap-1 cursor-pointer ${
                  aiMode === 'dual_view' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" /> DUAL_CUE
              </button>
            </div>

          </div>

          {/* Canvas Render Area with Split-Screen Support */}
          <div className="bg-black border border-neutral-800 rounded overflow-hidden shadow-2xl relative">
            <div className="bg-black px-3 py-1.5 border-b border-neutral-800 flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{selectedSample?.name}</span>
                <span className="text-neutral-500 text-[10px]">• {selectedSample?.coordinates?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={palette}
                  onChange={(e) => setPalette(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-white text-xs font-mono"
                >
                  <option value="copper">PALETTE: NATURAL_COPPER (STANDARD)</option>
                  <option value="cyan">PALETTE: OCEANIC_CYAN</option>
                  <option value="emerald">PALETTE: DEEP_EMERALD</option>
                  <option value="grayscale">PALETTE: RAW_GRAYSCALE</option>
                </select>
              </div>
            </div>

            {/* Canvas Viewport */}
            <div className="relative w-full aspect-[4/3] bg-black flex items-center justify-center p-2 overflow-hidden">
              
              {/* Split Mode: Left Raw / Right Enhanced */}
              {splitMode === 'split' ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  
                  {/* Underneath: Full Enhanced Canvas */}
                  <canvas
                    ref={canvasRef}
                    width={700}
                    height={500}
                    className="w-full h-full object-contain rounded border border-neutral-800"
                  />

                  {/* Overlaid Left Crop: Raw Canvas */}
                  <div 
                    className="absolute inset-0 overflow-hidden pointer-events-none rounded border-r-2 border-white shadow-2xl"
                    style={{ width: `${splitPos}%` }}
                  >
                    <canvas
                      ref={rawCanvasRef}
                      width={700}
                      height={500}
                      className="w-[700px] h-[500px] max-w-none object-contain"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    
                    <div className="absolute top-2 left-2 bg-black/90 border border-neutral-700 px-2 py-0.5 rounded text-[10px] font-bold text-neutral-300">
                      [◀ RAW UNPROCESSED]
                    </div>
                  </div>

                  <div 
                    className="absolute top-2 right-2 bg-black/90 border border-cyan-400/60 px-2 py-0.5 rounded text-[10px] font-bold text-cyan-300 pointer-events-none"
                  >
                    [AI DUAL-CUE ENHANCED ▶]
                  </div>

                  {/* Split Draggable Slider Control Overlay */}
                  <div className="absolute bottom-3 inset-x-6 z-20 flex items-center gap-3 bg-black/90 px-3 py-1.5 rounded border border-neutral-700 shadow-xl">
                    <span className="text-[10px] text-neutral-400 shrink-0">SPLIT_DIVIDER: {splitPos}%</span>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={splitPos}
                      onChange={(e) => setSplitPos(Number(e.target.value))}
                      className="w-full accent-white cursor-ew-resize"
                    />
                  </div>

                </div>
              ) : splitMode === 'raw' ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={700}
                    height={500}
                    className="w-full h-full object-contain rounded border border-neutral-800"
                  />
                  <div className="absolute top-3 left-3 bg-black/90 border border-neutral-700 px-2 py-0.5 rounded text-[10px] font-bold text-neutral-300">
                    [RAW ACOUSTIC STREAM]
                  </div>
                </div>
              ) : (
                /* Enhanced AI Mode */
                <div className="relative w-full h-full flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={700}
                    height={500}
                    className="w-full h-full object-contain rounded border border-neutral-800"
                  />

                  {/* Highlight/Shadow Cues Toggle Badges */}
                  <div className="absolute top-4 right-4 bg-black/90 border border-neutral-800 rounded p-2 text-xs font-mono space-y-1.5 shadow-lg">
                    <label className="flex items-center gap-2 cursor-pointer text-emerald-400">
                      <input
                        type="checkbox"
                        checked={showHighlightCues}
                        onChange={(e) => setShowHighlightCues(e.target.checked)}
                        className="accent-emerald-400 rounded"
                      />
                      <span>HIGHLIGHT_CUE (ECHO)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-amber-400">
                      <input
                        type="checkbox"
                        checked={showShadowCues}
                        onChange={(e) => setShowShadowCues(e.target.checked)}
                        className="accent-amber-400 rounded"
                      />
                      <span>SHADOW_CUE (3D VOID)</span>
                    </label>
                  </div>
                </div>
              )}

            </div>

            <div className="px-3 py-2 bg-black border-t border-neutral-800 flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-400">
              <div className="flex items-center gap-3">
                <span>SOUND_SPEED: <strong className="text-white">{selectedSample?.sonarParams?.soundSpeed}</strong></span>
                <span>SWATH: <strong className="text-white">{selectedSample?.sonarParams?.swathWidth}</strong></span>
                <span>FREQ: <strong className="text-white">{selectedSample?.sonarParams?.frequency}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-white font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>[SLANT_RANGE_VERIFIED]</span>
              </div>
            </div>

          </div>

          {/* Interactive Acoustic 3D Shadow Math Sandbox + Ray Visualizer */}
          <div className="bg-black border border-neutral-800 rounded p-3.5 space-y-3 shadow-md font-mono">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <Ruler className="w-3.5 h-3.5 text-white" />
                <h3 className="text-xs font-bold text-white">
                  &gt; ACOUSTIC_SHADOW_3D_HEIGHT_ESTIMATOR
                </h3>
              </div>
              <span className="text-[10px] text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-700 font-bold">
                H = (L_s × H_alt) / (R_slant + L_s)
              </span>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1 text-[10px]">
                  1. ACOUSTIC_SHADOW (L_s): <strong className="text-amber-400">{customShadowLength}m</strong>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.1"
                  value={customShadowLength}
                  onChange={(e) => setCustomShadowLength(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1 text-[10px]">
                  2. AUV_ALTITUDE (H_alt): <strong className="text-cyan-400">{customAltitude}m</strong>
                </label>
                <input
                  type="range"
                  min="3"
                  max="30"
                  step="0.5"
                  value={customAltitude}
                  onChange={(e) => setCustomAltitude(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1 text-[10px]">
                  3. SLANT_RANGE (R_slant): <strong className="text-emerald-400">{customSlantRange}m</strong>
                </label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="0.5"
                  value={customSlantRange}
                  onChange={(e) => setCustomSlantRange(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>
            </div>

            {/* Interactive 2D/3D Ray Diagram Visualizer */}
            <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span className="font-bold text-white flex items-center gap-1">
                  <Box className="w-3 h-3" />
                  PHYSICS RAY TRACE PROJECTION
                </span>
                <span>Calculated Object Height: <strong className="text-white text-xs">{computedHeight}m</strong></span>
              </div>

              {/* Dynamic SVG Ray Tracing Diagram */}
              <div className="w-full h-28 bg-black/80 rounded border border-neutral-900 relative overflow-hidden flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 600 110" preserveAspectRatio="none">
                  {/* Seabed Line */}
                  <line x1="20" y1="95" x2="580" y2="95" stroke="#404040" strokeWidth="2" strokeDasharray="4 2" />
                  <text x="25" y="105" fill="#737373" fontSize="8" fontFamily="monospace">SEABED FLOOR (0.0m)</text>

                  {/* AUV Position */}
                  <rect x="50" y="20" width="40" height="16" rx="3" fill="#171717" stroke="#00F0FF" strokeWidth="1.5" />
                  <text x="56" y="32" fill="#00F0FF" fontSize="8" fontFamily="monospace" fontWeight="bold">AUV</text>
                  <line x1="70" y1="36" x2="70" y2="95" stroke="#00F0FF" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                  <text x="75" y="65" fill="#00F0FF" fontSize="8" fontFamily="monospace">H_alt: {customAltitude}m</text>

                  {/* Target Object on Seafloor */}
                  {(() => {
                    const objX = 280;
                    const objH = Math.min(65, Math.max(12, computedHeight * 16));
                    const shadowLen = Math.min(220, Math.max(20, customShadowLength * 12));

                    return (
                      <g>
                        {/* Acoustic Sonar Beam Ray */}
                        <line x1="90" y1="28" x2={objX} y2={95 - objH} stroke="#10B981" strokeWidth="1.5" opacity="0.8" />
                        <line x1="90" y1="28" x2={objX + shadowLen} y2="95" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

                        {/* Acoustic Shadow Zone on Seabed */}
                        <rect x={objX} y="92" width={shadowLen} height="6" fill="#F59E0B" opacity="0.4" />
                        <line x1={objX} y1="95" x2={objX + shadowLen} y2="95" stroke="#F59E0B" strokeWidth="3" />
                        <text x={objX + shadowLen / 2 - 25} y="105" fill="#F59E0B" fontSize="8" fontFamily="monospace">L_shadow: {customShadowLength}m</text>

                        {/* Target Object Body */}
                        <rect x={objX - 10} y={95 - objH} width="20" height={objH} fill="#ffffff" stroke="#10B981" strokeWidth="1.5" />
                        <text x={objX - 25} y={95 - objH - 4} fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">
                          H: {computedHeight}m
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Math Calculation Result Callout */}
            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-5 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[9px]">[ESTIMATED_3D_HEIGHT]:</span>
                  <span className="text-lg font-bold text-white">
                    {computedHeight} METERS
                  </span>
                </div>
                <div className="w-px h-6 bg-neutral-800"></div>
                <div>
                  <span className="text-neutral-500 block text-[9px]">[CORRECTED_GROUND_RANGE]:</span>
                  <span className="text-sm font-bold text-white">{computedGroundRange.toFixed(1)} METERS</span>
                </div>
              </div>

              <div className="text-[10px] text-neutral-400">
                <span>[PHYSICS]: Acoustic shadows encode true vertical elevation above seabed.</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Detail Inspector Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-3 font-mono">
          
          {/* Target Profile Card */}
          <div className="bg-black border border-neutral-800 rounded p-3.5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-white">&gt; {selectedSample?.name}</h3>
                <span className="text-[10px] text-neutral-400">{selectedSample?.category}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-neutral-900 text-white border border-neutral-700">
                [{selectedSample?.riskLevel}] ({selectedSample?.riskScore}/100)
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {selectedSample?.description}
            </p>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
                <span className="text-neutral-500 text-[9px] block">[WATER_DEPTH]</span>
                <span className="text-white font-bold">{selectedSample?.depth}m</span>
              </div>
              <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
                <span className="text-neutral-500 text-[9px] block">[AUV_ALTITUDE]</span>
                <span className="text-white font-bold">{selectedSample?.altitude}m</span>
              </div>
              <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
                <span className="text-neutral-500 text-[9px] block">[3D_DIMENSIONS]</span>
                <span className="text-white font-bold">{selectedSample?.dimensions?.length} × {selectedSample?.dimensions?.width}</span>
              </div>
              <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
                <span className="text-neutral-500 text-[9px] block">[ACTION_PRIORITY]</span>
                <span className="text-white font-bold truncate block">{selectedSample?.cleanPriority}</span>
              </div>
            </div>

            {/* AI Model Breakdown */}
            <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs">
              <span className="text-[10px] font-bold text-neutral-400 block">[AI_INFERENCE_PIPELINE]:</span>
              
              <div className="space-y-1.5">
                <div className="p-2 bg-neutral-950 rounded border border-neutral-800">
                  <div className="flex justify-between mb-1 text-[11px]">
                    <span className="text-neutral-400">YOLO-11 Detector</span>
                    <span className="text-white font-bold">{(selectedSample?.detections[0]?.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1.5 overflow-hidden">
                    <div 
                      style={{ width: `${selectedSample?.detections[0]?.confidence * 100}%` }}
                      className="bg-white h-full" 
                    />
                  </div>
                </div>

                <div className="p-2 bg-neutral-950 rounded border border-neutral-800">
                  <div className="flex justify-between mb-1 text-[11px]">
                    <span className="text-neutral-400">PatchCore Anomaly</span>
                    <span className="text-white font-bold">{(selectedSample?.anomalyConfidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1.5 overflow-hidden">
                    <div 
                      style={{ width: `${selectedSample?.anomalyConfidence * 100}%` }}
                      className="bg-white h-full" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Geo Tag */}
            <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded text-[11px] text-neutral-300">
              <span className="text-white font-bold block mb-0.5">[COORDINATES]:</span>
              <p>LAT: {selectedSample?.coordinates?.lat}°N, LNG: {selectedSample?.coordinates?.lng}°E</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">{selectedSample?.coordinates?.location}</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
