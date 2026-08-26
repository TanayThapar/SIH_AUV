import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Scan, 
  AlertTriangle, 
  ChevronRight, 
  Sliders, 
  Eye, 
  Crosshair, 
  Compass, 
  Activity,
  Maximize2
} from 'lucide-react';
import { PRESET_SAMPLES, SONAR_PALETTES } from '../data/sonarSamples';
import { calculateObjectHeight } from '../utils/sonarProcessor';

export default function LiveWaterfallView({ onSelectSampleForStudio }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [palette, setPalette] = useState('copper');
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [swathWidth, setSwathWidth] = useState(100);
  const [frequency, setFrequency] = useState('450 kHz');
  const [showAiBoxes, setShowAiBoxes] = useState(true);
  const [showShadowRays, setShowShadowRays] = useState(true);
  
  // Real-time telemetry state
  const [telemetry, setTelemetry] = useState({
    altitude: 12.4,
    depth: 45.2,
    speed: 3.4,
    heading: 142.5,
    pingsProcessed: 48920,
    fps: 59.8,
    inferenceMs: 14.8
  });

  const [activeDetections, setActiveDetections] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);

  const audioCtxRef = useRef(null);

  const playSonarChirp = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#050a14';
    ctx.fillRect(0, 0, width, height);

    let animationFrameId;
    let lineCounter = 0;
    let spawnTimer = 0;

    const objectsOnScreen = [];

    const render = () => {
      if (isPlaying) {
        const shiftY = scrollSpeed;
        ctx.drawImage(canvas, 0, 0, width, height - shiftY, 0, shiftY, width, height - shiftY);

        const nadirCenterX = width / 2;
        const nadirWidth = width * 0.1;

        for (let dy = 0; dy < shiftY; dy++) {
          lineCounter++;
          const y = dy;

          for (let x = 0; x < width; x += 2) {
            const distFromNadir = Math.abs(x - nadirCenterX);
            let intensity = 0;

            if (distFromNadir < nadirWidth / 2) {
              intensity = 15 + Math.random() * 15;
            } else {
              const grazing = 1.0 - (distFromNadir / (width / 2)) * 0.5;
              const ripple = Math.sin(lineCounter * 0.1 + x * 0.05) * 15;
              const noise = (Math.random() - 0.5) * 35;
              intensity = (75 * grazing) + ripple + noise;
            }

            objectsOnScreen.forEach(obj => {
              const localY = obj.currentY - y;
              if (localY >= 0 && localY <= obj.heightPx) {
                if (x >= obj.x && x <= obj.x + obj.widthPx) {
                  const isHighlight = localY < obj.heightPx * 0.4;
                  if (isHighlight) {
                    intensity = Math.min(255, 180 + Math.random() * 60);
                  } else {
                    intensity = Math.max(2, 8 + Math.random() * 8);
                  }
                }
              }
            });

            intensity = Math.min(255, Math.max(0, intensity));

            if (palette === 'copper') {
              ctx.fillStyle = `rgb(${intensity * 1.15}, ${intensity * 0.72}, ${intensity * 0.22})`;
            } else if (palette === 'emerald') {
              ctx.fillStyle = `rgb(${intensity * 0.2}, ${intensity * 1.1}, ${intensity * 0.75})`;
            } else if (palette === 'cyan') {
              ctx.fillStyle = `rgb(${intensity * 0.15}, ${intensity * 0.95}, ${intensity * 1.2})`;
            } else {
              ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
            }

            ctx.fillRect(x, y, 2, 1);
          }
        }

        objectsOnScreen.forEach(obj => {
          obj.currentY += shiftY;
        });

        spawnTimer += scrollSpeed;
        if (spawnTimer > 280) {
          spawnTimer = 0;
          const randomPreset = PRESET_SAMPLES[Math.floor(Math.random() * PRESET_SAMPLES.length)];
          const sideIsStarboard = Math.random() > 0.5;
          const targetWidth = 60 + Math.random() * 40;
          const targetHeight = 45 + Math.random() * 35;
          const targetX = sideIsStarboard 
            ? nadirCenterX + 40 + Math.random() * (width / 2 - 120)
            : nadirCenterX - 40 - targetWidth - Math.random() * (width / 2 - 120);

          const newObj = {
            id: `stream-det-${Date.now()}`,
            preset: randomPreset,
            x: targetX,
            currentY: 0,
            widthPx: targetWidth,
            heightPx: targetHeight,
            confidence: (0.91 + Math.random() * 0.08).toFixed(2),
            slantRange: (15 + Math.random() * 30).toFixed(1),
            shadowLength: (3 + Math.random() * 6).toFixed(1),
            side: sideIsStarboard ? 'Starboard' : 'Port'
          };

          objectsOnScreen.push(newObj);
          playSonarChirp();

          const logEntry = {
            id: newObj.id,
            time: new Date().toLocaleTimeString(),
            label: randomPreset.name,
            category: randomPreset.category,
            risk: randomPreset.riskLevel,
            confidence: newObj.confidence,
            range: `${newObj.slantRange}m`,
            estHeight: `${calculateObjectHeight(Number(newObj.shadowLength), telemetry.altitude, Number(newObj.slantRange))}m`,
            presetData: randomPreset
          };

          setRecentLogs(prev => [logEntry, ...prev.slice(0, 15)]);
        }

        for (let i = objectsOnScreen.length - 1; i >= 0; i--) {
          if (objectsOnScreen[i].currentY > height + 50) {
            objectsOnScreen.splice(i, 1);
          }
        }

        setActiveDetections([...objectsOnScreen]);

        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(nadirCenterX, 0);
        ctx.lineTo(nadirCenterX, height);
        ctx.stroke();
        ctx.setLineDash([]);

        setTelemetry(prev => ({
          ...prev,
          pingsProcessed: prev.pingsProcessed + 1,
          depth: Number((45.2 + Math.sin(lineCounter * 0.01) * 0.4).toFixed(1)),
          heading: Number((142.5 + Math.sin(lineCounter * 0.005) * 1.2).toFixed(1)),
          fps: Number((59.4 + Math.random() * 0.8).toFixed(1))
        }));
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, scrollSpeed, palette, swathWidth, soundEnabled]);

  return (
    <div className="space-y-4">
      {/* Top Banner & Control HUD */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-md shadow-lg"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Real-Time Side-Scan Sonar Waterfall Stream
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                  ● LIVE ACOUSTIC FEED
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Continuous synthetic SSS acoustic backscatter waterfall with instant highlight-shadow segmentation & YOLOv8 detection.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons with Motion */}
          <div className="flex flex-wrap items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
                isPlaying 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause Stream' : 'Resume Pings'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg text-xs font-mono transition-all border ${
                soundEnabled 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 glow-cyan' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Acoustic Sonar Ping Audio"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </motion.button>

            {/* Palette Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              {Object.keys(SONAR_PALETTES).map((key) => (
                <button
                  key={key}
                  onClick={() => setPalette(key)}
                  className={`px-2.5 py-1 rounded capitalize transition-all ${
                    palette === key ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

        </div>
      </motion.div>

      {/* Main Sonar Stream & Telemetry Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Waterfall Canvas Panel (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
          
          <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-4 text-slate-400">
              <span className="text-cyan-400 font-bold">PORT (CH-A)</span>
              <span>ALT: <strong className="text-slate-200">{telemetry.altitude}m</strong></span>
              <span>DEPTH: <strong className="text-slate-200">{telemetry.depth}m</strong></span>
              <span>SWATH: <strong className="text-slate-200">{swathWidth}m</strong></span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>FREQ: <strong className="text-emerald-400">{frequency}</strong></span>
              <span>SPEED: <strong className="text-slate-200">{telemetry.speed} kts</strong></span>
              <span className="text-cyan-400 font-bold">STARBOARD (CH-B)</span>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative w-full aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
            
            <canvas
              ref={canvasRef}
              width={720}
              height={540}
              className="w-full h-full object-contain"
            />

            {/* AI Bounding Box Overlays with Motion */}
            {showAiBoxes && activeDetections.map((det) => {
              const topPct = (det.currentY / 540) * 100;
              const leftPct = (det.x / 720) * 100;
              const widthPct = (det.widthPx / 720) * 100;
              const heightPct = (det.heightPx / 540) * 100;

              return (
                <motion.div
                  key={det.id}
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    top: `${topPct}%`,
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`
                  }}
                  className="absolute pointer-events-auto border-2 border-cyan-400 bg-cyan-400/10 rounded-sm group cursor-pointer transition-all hover:border-amber-400 hover:bg-amber-400/20"
                  onClick={() => onSelectSampleForStudio(det.preset)}
                >
                  <div className="absolute -top-7 left-0 bg-slate-950/95 border border-cyan-400 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded shadow-lg whitespace-nowrap flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                    <span className="font-bold">{det.preset.name}</span>
                    <span className="text-amber-400 font-semibold">{Number(det.confidence * 100).toFixed(0)}%</span>
                  </div>

                  {showShadowRays && (
                    <div className="absolute -bottom-5 right-0 bg-black/80 text-[9px] font-mono text-emerald-400 px-1 rounded border border-emerald-500/40">
                      Est. H: {calculateObjectHeight(Number(det.shadowLength), telemetry.altitude, Number(det.slantRange))}m
                    </div>
                  )}
                </motion.div>
              );
            })}

            <div className="absolute inset-0 pointer-events-none border border-cyan-500/10 sonar-grid"></div>
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-scanline pointer-events-none"></div>

            {/* Bottom HUD Overlay */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] font-mono text-cyan-300 flex items-center gap-3 backdrop-blur-md">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Edge FPS: {telemetry.fps}
                </span>
                <span>Latency: {telemetry.inferenceMs} ms</span>
                <span className="text-amber-400">Jetson: 28%</span>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] font-mono text-slate-300 flex items-center gap-2 backdrop-blur-md pointer-events-auto">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAiBoxes}
                    onChange={(e) => setShowAiBoxes(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  AI Boxes
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer ml-2">
                  <input
                    type="checkbox"
                    checked={showShadowRays}
                    onChange={(e) => setShowShadowRays(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  3D Shadow Cue
                </label>
              </div>
            </div>

          </div>

          {/* Sonar Parameter Sliders & Toggles */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 text-[10px] block mb-1">Scroll Speed: {scrollSpeed}x</label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 text-[10px] block mb-1">Swath Width: {swathWidth}m</label>
              <select
                value={swathWidth}
                onChange={(e) => setSwathWidth(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
              >
                <option value={50}>50 Meters (High Res)</option>
                <option value={100}>100 Meters (Standard)</option>
                <option value={150}>150 Meters (Wide)</option>
                <option value={300}>300 Meters (Deep Sea)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 text-[10px] block mb-1">Acoustic Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
              >
                <option value="900 kHz">900 kHz (Ultra High-Res)</option>
                <option value="450 kHz">450 kHz (Standard SSS)</option>
                <option value="100 kHz">100 kHz (Long-Range Deep)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 text-[10px] block mb-1">AUV Heading</label>
              <div className="flex items-center gap-1 text-slate-200 bg-slate-900 border border-slate-700 rounded px-2 py-1">
                <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '20s' }} />
                <span>{telemetry.heading}° SE</span>
              </div>
            </div>
          </div>

        </div>

        {/* Live Detection Feed with Motion AnimatePresence (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-[540px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-mono">Live Detection Stream</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                {recentLogs.length} Events Logged
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1">
              {recentLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
                  <Scan className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
                  <p className="text-xs font-mono">Awaiting target detection from acoustic stream...</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {recentLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: 20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-sm"
                      onClick={() => onSelectSampleForStudio(log.presetData)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                            {log.label}
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono">{log.category}</p>
                        </div>

                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          log.risk === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : log.risk === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {log.risk}
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Conf: <strong className="text-cyan-300">{(log.confidence * 100).toFixed(0)}%</strong></span>
                        <span>Range: <strong className="text-slate-300">{log.range}</strong></span>
                        <span>3D H: <strong className="text-emerald-400">{log.estHeight}</strong></span>
                        
                        <span className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5">
                          Inspect <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectSampleForStudio(PRESET_SAMPLES[0])}
                className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-900/40"
              >
                <Eye className="w-4 h-4" />
                Open In Acoustic Studio
              </motion.button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
