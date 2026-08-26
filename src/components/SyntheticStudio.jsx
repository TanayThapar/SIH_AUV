import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Sliders, 
  RefreshCw, 
  Database,
  Box,
  Binary
} from 'lucide-react';

export default function SyntheticStudio() {
  const canvasRef = useRef(null);
  
  const [selectedDebrisType, setSelectedDebrisType] = useState('container');
  const [grazingAngle, setGrazingAngle] = useState(25);
  const [sedimentType, setSedimentType] = useState('sand');
  const [speckleNoiseLevel, setSpeckleNoiseLevel] = useState(35);
  const [isGenerating, setIsGenerating] = useState(false);

  const DEBRIS_OPTIONS = [
    { id: 'container', name: '40ft Steel Cargo Container', baseReflectivity: 0.92, heightMeters: 2.6, shadowLengthMeters: 6.8 },
    { id: 'net', name: 'Tangled Synthetic Ghost Net', baseReflectivity: 0.65, heightMeters: 1.9, shadowLengthMeters: 4.5 },
    { id: 'drum', name: 'Toxic Chemical Barrel Pair', baseReflectivity: 0.88, heightMeters: 1.1, shadowLengthMeters: 2.7 },
    { id: 'tire', name: 'Heavy Industrial Tire Stack', baseReflectivity: 0.58, heightMeters: 1.4, shadowLengthMeters: 3.2 },
    { id: 'plane', name: 'Downed Aircraft Wing Section', baseReflectivity: 0.95, heightMeters: 3.2, shadowLengthMeters: 8.4 }
  ];

  const currentDebris = DEBRIS_OPTIONS.find(d => d.id === selectedDebrisType);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);

    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    const centerX = w / 2;
    const centerY = h / 2;

    const angleRad = (grazingAngle * Math.PI) / 180;
    const calculatedShadowLenPx = (currentDebris.heightMeters / Math.tan(angleRad)) * 14;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;

        let baseNoise = 0;
        if (sedimentType === 'sand') {
          baseNoise = 75 + Math.sin(y * 0.1 + x * 0.04) * 16 + (Math.random() - 0.5) * speckleNoiseLevel;
        } else if (sedimentType === 'gravel') {
          baseNoise = 95 + (Math.random() - 0.5) * (speckleNoiseLevel * 1.5);
        } else {
          baseNoise = 50 + Math.sin(y * 0.05) * 8 + (Math.random() - 0.5) * (speckleNoiseLevel * 0.7);
        }

        let intensity = baseNoise;

        const objW = 70;
        const objH = 45;
        const objLeft = centerX - objW / 2;
        const objTop = centerY - objH / 2;

        if (x >= objLeft && x <= objLeft + objW && y >= objTop && y <= objTop + 14) {
          const reflectBoost = currentDebris.baseReflectivity * 170;
          intensity = Math.min(255, baseNoise + reflectBoost + (Math.random() * 30));
        }

        if (x >= objLeft - 6 && x <= objLeft + objW + 6 && y > objTop + 14 && y <= objTop + 14 + calculatedShadowLenPx) {
          const fade = 1 - ((y - (objTop + 14)) / calculatedShadowLenPx);
          intensity = Math.max(3, 8 * (1 - fade) + (Math.random() * 6));
        }

        intensity = Math.min(255, Math.max(0, intensity));

        // Natural Sonar Copper/Amber Backscatter
        data[idx] = Math.min(255, intensity * 1.18);
        data[idx + 1] = Math.min(255, intensity * 0.72);
        data[idx + 2] = Math.min(255, intensity * 0.22);
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(centerX - 42, centerY - 25, 84, 50 + calculatedShadowLenPx);
    ctx.setLineDash([]);

    ctx.fillStyle = '#00F0FF';
    ctx.font = '10px monospace';
    ctx.fillText(`> TARGET: ${currentDebris.name}`, 14, 20);
    ctx.fillText(`> GRAZING_ANGLE: ${grazingAngle}° | CALC_SHADOW: ${currentDebris.shadowLengthMeters}m`, 14, 36);

  }, [selectedDebrisType, grazingAngle, sedimentType, speckleNoiseLevel, currentDebris]);

  const handleSynthesize = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
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
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-neutral-900 border border-neutral-700 text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-white">
              &gt; SYNTHETIC_SONAR_CYCLEGAN_SIMULATOR
            </h2>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-900 text-white border border-neutral-700 font-bold">
              [KEY_TECHNICAL_USP]
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Overcomes underwater data scarcity by translating 3D CAD/Optical debris models into physically accurate SSS acoustic backscatter with ray-traced shadows.
          </p>
        </div>

        <button
          onClick={handleSynthesize}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-white text-white hover:text-black border border-neutral-700 hover:border-white rounded text-xs font-mono font-bold transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? '[ SYNTHESIZING... ]' : '[ RUN_PHYSICS_SYNTHESIS ]'}</span>
        </button>
      </motion.div>

      {/* Model Performance Comparison Stat Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-black border border-neutral-800 rounded p-3 flex items-center gap-3">
          <div className="p-2.5 rounded bg-neutral-900 text-white border border-neutral-700">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 block">[BASELINE: REAL ONLY - 210 SAMPLES]</span>
            <span className="text-lg font-bold text-white">68.4% mAP@50</span>
          </div>
        </div>

        <div className="bg-black border border-neutral-800 rounded p-3 flex items-center gap-3">
          <div className="p-2.5 rounded bg-neutral-900 text-white border border-neutral-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 block">[WITH SYNTHETIC AUGMENTATION +15K PINGS]</span>
            <span className="text-lg font-bold text-white">94.8% mAP@50 (+26.4%)</span>
          </div>
        </div>

        <div className="bg-black border border-neutral-800 rounded p-3 flex items-center gap-3">
          <div className="p-2.5 rounded bg-neutral-900 text-white border border-neutral-700">
            <Binary className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 block">[DOMAIN ADAPTATION LOSS]</span>
            <span className="text-lg font-bold text-white">0.0142 L_cycle</span>
          </div>
        </div>
      </div>

      {/* 3-Step Translation Pipeline Visualizer */}
      <div className="bg-black border border-neutral-800 rounded p-3.5 space-y-3 shadow-lg">
        <span className="text-xs font-bold text-white block">
          &gt; END_TO_END_ACOUSTIC_TRANSLATION_PIPELINE:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          
          <div className="p-3 rounded border bg-neutral-950 border-neutral-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black text-white border border-neutral-700 font-bold">[STAGE_01]</span>
              <Box className="w-3.5 h-3.5 text-white" />
            </div>
            <h4 className="text-xs font-bold text-white">3D CAD &amp; Optical Mesh</h4>
            <p className="text-[11px] text-neutral-400 mt-1">
              Ingests surface meshes, material density, and dimensional CAD models of submerged marine debris.
            </p>
          </div>

          <div className="p-3 rounded border bg-neutral-950 border-neutral-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black text-white border border-neutral-700 font-bold">[STAGE_02]</span>
              <Binary className="w-3.5 h-3.5 text-white" />
            </div>
            <h4 className="text-xs font-bold text-white">Ray-Tracing &amp; Shadows</h4>
            <p className="text-[11px] text-neutral-400 mt-1">
              Simulates grazing angle sonar pings, Lambertian backscatter, and acoustic occlusion shadows.
            </p>
          </div>

          <div className="p-3 rounded border bg-neutral-950 border-neutral-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black text-white border border-neutral-700 font-bold">[STAGE_03]</span>
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <h4 className="text-xs font-bold text-white">CycleGAN Speckle Injection</h4>
            <p className="text-[11px] text-neutral-400 mt-1">
              Adds realistic Rayleigh speckle noise, water column attenuation, and time-variable gain curves.
            </p>
          </div>

        </div>
      </div>

      {/* Interactive Synthesis Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-black border border-neutral-800 rounded p-3.5 space-y-3.5 shadow-xl text-xs">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <Sliders className="w-3.5 h-3.5 text-white" />
            <h3 className="text-xs font-bold text-white">&gt; GAN_&amp;_PHYSICS_PARAMETERS</h3>
          </div>

          <div className="space-y-3 font-mono">
            
            <div>
              <label className="text-neutral-400 block mb-1 text-[10px]">[TARGET_GEOMETRY]:</label>
              <select
                value={selectedDebrisType}
                onChange={(e) => setSelectedDebrisType(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-white text-xs"
              >
                {DEBRIS_OPTIONS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} (H: {d.heightMeters}m)</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-neutral-400 mb-1 text-[10px]">
                <span>GRAZING_ANGLE (θ):</span>
                <strong className="text-white">{grazingAngle}°</strong>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="1"
                value={grazingAngle}
                onChange={(e) => setGrazingAngle(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div>
              <div className="flex justify-between text-neutral-400 mb-1 text-[10px]">
                <span>SPECKLE_NOISE_LEVEL:</span>
                <strong className="text-white">{speckleNoiseLevel}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={speckleNoiseLevel}
                onChange={(e) => setSpeckleNoiseLevel(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1 text-[10px]">[SEDIMENT_TYPE]:</label>
              <div className="grid grid-cols-3 gap-2">
                {['sand', 'gravel', 'mud'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSedimentType(type)}
                    className={`py-1 px-2 rounded uppercase text-xs transition-all border cursor-pointer ${
                      sedimentType === type
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-neutral-400">MATERIAL_REFLECTIVITY:</span>
              <span className="text-white font-bold">{(currentDebris.baseReflectivity * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">RAY_TRACED_SHADOW:</span>
              <span className="text-white font-bold">{currentDebris.shadowLengthMeters}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">TARGET_3D_HEIGHT:</span>
              <span className="text-white font-bold">{currentDebris.heightMeters}m</span>
            </div>
          </div>
        </div>

        {/* Live Synthesized Sonar Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-black border border-neutral-800 rounded overflow-hidden shadow-2xl">
          <div className="bg-black px-3 py-1.5 border-b border-neutral-800 flex items-center justify-between text-[11px] font-mono">
            <span className="text-white font-bold">[CYCLEGAN_SYNTHESIS_STREAM]</span>
            <span className="text-neutral-400">[YOLO-11_TRAIN_READY]</span>
          </div>

          <div className="p-2.5 bg-black flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={560}
              height={380}
              className="w-full h-auto rounded border border-neutral-800 object-contain"
            />
          </div>

          <div className="p-2.5 bg-black border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
            <span>AUGMENTATION_FACTOR: <strong className="text-white">75x DATA_MULTIPLIER</strong></span>
            <span className="text-white font-bold">[YOLO_FORMAT_EXPORTED]</span>
          </div>
        </div>

      </div>

    </div>
  );
}
