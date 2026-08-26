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
  Eye, 
  Compass, 
  Activity
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

    ctx.fillStyle = '#050505';
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
              ctx.fillStyle = `rgb(${Math.min(255, intensity * 1.15)}, ${Math.min(255, intensity * 0.72)}, ${Math.min(255, intensity * 0.22)})`;
            } else if (palette === 'cyan') {
              ctx.fillStyle = `rgb(${Math.min(255, intensity * 0.15)}, ${Math.min(255, intensity * 0.95)}, ${Math.min(255, intensity * 1.2)})`;
            } else if (palette === 'emerald') {
              ctx.fillStyle = `rgb(${Math.min(255, intensity * 0.2)}, ${Math.min(255, intensity * 1.1)}, ${Math.min(255, intensity * 0.75)})`;
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

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
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
    <div className="space-y-4 font-mono">
      {/* Top Banner & Control HUD */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black border border-neutral-800 rounded p-3.5 shadow-xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-neutral-900 border border-neutral-700 text-white">
              <Scan className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                &gt; REAL_TIME_SIDE_SCAN_WATERFALL
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-neutral-900 text-white border border-neutral-700">
                  [● LIVE_STREAM]
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                Continuous acoustic backscatter waterfall with highlight-shadow segmentation &amp; YOLO-11 detection.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1 rounded font-mono text-xs font-bold transition-all bg-black hover:bg-neutral-900 text-white border border-neutral-700 hover:border-white cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? '[ PAUSE_STREAM ]' : '[ RESUME_PINGS ]'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded text-xs font-mono transition-all border cursor-pointer ${
                soundEnabled 
                  ? 'bg-neutral-900 text-white border-white' 
                  : 'bg-black text-neutral-500 border-neutral-800'
              }`}
              title="Acoustic Sonar Ping Audio"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </motion.button>

            {/* Palette Switcher */}
            <div className="flex items-center bg-black p-0.5 rounded border border-neutral-800 text-[11px] font-mono">
              {Object.keys(SONAR_PALETTES).map((key) => (
                <button
                  key={key}
                  onClick={() => setPalette(key)}
                  className={`px-2 py-0.5 rounded uppercase font-bold transition-all cursor-pointer ${
                    palette === key ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
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
        <div className="lg:col-span-8 bg-black border border-neutral-800 rounded overflow-hidden shadow-2xl relative">
          
          <div className="bg-black px-3 py-1.5 border-b border-neutral-800 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-3 text-neutral-400">
              <span className="text-white font-bold">[CH_A: PORT]</span>
              <span>ALT: <strong className="text-white">{telemetry.altitude}m</strong></span>
              <span>DEPTH: <strong className="text-white">{telemetry.depth}m</strong></span>
              <span>SWATH: <strong className="text-white">{swathWidth}m</strong></span>
            </div>
            <div className="flex items-center gap-3 text-neutral-400">
              <span>FREQ: <strong className="text-white">{frequency}</strong></span>
              <span>SPEED: <strong className="text-white">{telemetry.speed} kts</strong></span>
              <span className="text-white font-bold">[CH_B: STARBOARD]</span>
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

            {/* AI Bounding Box Overlays */}
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
                  className="absolute pointer-events-auto border-2 border-cyan-400 bg-cyan-500/10 rounded group cursor-pointer transition-all hover:bg-cyan-500/20 shadow-lg shadow-cyan-950/50"
                  onClick={() => onSelectSampleForStudio(det.preset)}
                >
                  <div className="absolute -top-6 left-0 bg-cyan-950/95 border border-cyan-400 text-cyan-200 text-[9px] font-mono px-1.5 py-0.2 shadow-lg whitespace-nowrap flex items-center gap-1.5 rounded-sm">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
                    <span className="font-bold text-white">{det.preset.name}</span>
                    <span className="text-cyan-300 font-semibold">{Number(det.confidence * 100).toFixed(0)}%</span>
                  </div>

                  {showShadowRays && (
                    <div className="absolute -bottom-5 right-0 bg-black text-[9px] font-mono text-neutral-300 px-1 border border-neutral-700">
                      H: {calculateObjectHeight(Number(det.shadowLength), telemetry.altitude, Number(det.slantRange))}m
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Bottom HUD Overlay */}
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none text-xs">
              <div className="bg-black/90 border border-neutral-800 px-2.5 py-1 text-[10px] font-mono text-neutral-300 flex items-center gap-3">
                <span className="flex items-center gap-1 text-white">
                  <Activity className="w-3 h-3 text-white" />
                  FPS: {telemetry.fps}
                </span>
                <span>LATENCY: {telemetry.inferenceMs}ms</span>
                <span>NPU: 28%</span>
              </div>

              <div className="bg-black/90 border border-neutral-800 px-2.5 py-1 text-[10px] font-mono text-neutral-300 flex items-center gap-3 pointer-events-auto">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAiBoxes}
                    onChange={(e) => setShowAiBoxes(e.target.checked)}
                    className="accent-white"
                  />
                  AI_BOXES
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showShadowRays}
                    onChange={(e) => setShowShadowRays(e.target.checked)}
                    className="accent-white"
                  />
                  3D_SHADOW
                </label>
              </div>
            </div>

          </div>

          {/* Sonar Parameter Sliders & Toggles */}
          <div className="p-2.5 bg-black border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px] font-mono">
            <div>
              <label className="text-neutral-400 text-[10px] block mb-1">SCROLL_SPEED: {scrollSpeed}x</label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div>
              <label className="text-neutral-400 text-[10px] block mb-1">SWATH_WIDTH: {swathWidth}m</label>
              <select
                value={swathWidth}
                onChange={(e) => setSwathWidth(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-white text-xs"
              >
                <option value={50}>50M (HIGH_RES)</option>
                <option value={100}>100M (STANDARD)</option>
                <option value={150}>150M (WIDE)</option>
                <option value={300}>300M (DEEP_SEA)</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-400 text-[10px] block mb-1">ACOUSTIC_FREQ</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-white text-xs"
              >
                <option value="900 kHz">900 kHz (ULTRA_RES)</option>
                <option value="450 kHz">450 kHz (STANDARD)</option>
                <option value="100 kHz">100 kHz (LONG_RANGE)</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-400 text-[10px] block mb-1">AUV_HEADING</label>
              <div className="flex items-center gap-1 text-white bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5">
                <Compass className="w-3 h-3 text-white" />
                <span>{telemetry.heading}° SE</span>
              </div>
            </div>
          </div>

        </div>

        {/* Live Detection Feed (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          
          <div className="bg-black border border-neutral-800 rounded p-3 flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-white" />
                <h3 className="text-xs font-bold text-white font-mono">&gt; DETECTION_STREAM</h3>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-900 text-neutral-300 border border-neutral-700 font-mono">
                [{recentLogs.length} LOGS]
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-2.5 pr-1">
              {recentLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 text-neutral-500">
                  <Scan className="w-6 h-6 text-neutral-600 mb-2 animate-pulse" />
                  <p className="text-xs font-mono">&gt; Awaiting acoustic telemetry...</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {recentLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      whileHover={{ scale: 1.01 }}
                      className="p-2 rounded bg-neutral-950 border border-neutral-800 hover:border-white transition-all cursor-pointer group"
                      onClick={() => onSelectSampleForStudio(log.presetData)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-xs text-white group-hover:underline">
                            {log.label}
                          </span>
                          <p className="text-[10px] text-neutral-400 font-mono">{log.category}</p>
                        </div>

                        <span className="text-[9px] px-1 py-0.2 rounded font-mono font-bold bg-neutral-900 text-white border border-neutral-700">
                          [{log.risk}]
                        </span>
                      </div>

                      <div className="mt-1.5 pt-1.5 border-t border-neutral-900 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                        <span>CONF: <strong className="text-white">{(log.confidence * 100).toFixed(0)}%</strong></span>
                        <span>R: <strong className="text-white">{log.range}</strong></span>
                        <span>H: <strong className="text-white">{log.estHeight}</strong></span>
                        
                        <span className="text-white hover:underline flex items-center gap-0.5">
                          INSPECT &gt;
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <div className="pt-2 border-t border-neutral-800">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelectSampleForStudio(PRESET_SAMPLES[0])}
                className="w-full py-1.5 bg-neutral-900 hover:bg-white text-white hover:text-black border border-neutral-700 hover:border-white rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                [ OPEN_IN_ACOUSTIC_STUDIO ]
              </motion.button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
