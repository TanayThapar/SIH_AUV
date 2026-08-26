import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, Activity, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

const BOOT_LOGS = [
  { text: 'Initializing AUV Side-Scan Acoustic Transducers...', detail: 'Dual-frequency 450/900 kHz array active' },
  { text: 'Establishing GNSS-Denied Inertial Hydro-Acoustic Link...', detail: 'USBL positioning locked (14.5°N, 75.5°E)' },
  { text: 'Loading ONNX Acoustic Anomaly Detection Weights...', detail: 'DeepLab-Sonar v4.2 compiled for Edge TensorRT' },
  { text: 'Synchronizing Seafloor Bathymetric GIS Heatmaps...', detail: 'Loaded Arabian Sea & Bay of Bengal corridors' },
  { text: 'Deploying Real-Time Slant-Range Correction Filter...', detail: 'Shadow analysis & geometric height estimation ready' },
  { text: 'AeroAqua DeepScan AI System Initialized & Online', detail: 'Mission parameters verified — All nodes green' }
];

export default function InitialLoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  useEffect(() => {
    // Increment progress smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate or smooth out progress
        const increment = prev < 60 ? Math.floor(Math.random() * 4) + 2 : Math.floor(Math.random() * 6) + 4;
        const next = Math.min(100, prev + increment);
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // Update log index based on progress
  useEffect(() => {
    const idx = Math.min(
      BOOT_LOGS.length - 1,
      Math.floor((progress / 100) * BOOT_LOGS.length)
    );
    setCurrentLogIndex(idx);

    if (progress >= 100) {
      const timer = setTimeout(() => {
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  // Allow immediate skip via keypress or click
  const handleSkip = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      onComplete?.();
    }, 300);
  }, [onComplete]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-4 overflow-hidden select-none"
    >
      {/* Background Animated Ambient Radiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[130px]" />
        
        {/* Sonar Grid overlay */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,240,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-xl w-full flex flex-col items-center text-center space-y-8">
        
        {/* Central Sonar Radar Hologram Animation */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
          {/* Outer Pulse Rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 rounded-full border border-cyan-500/30"
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ 
                scale: [0.7, 1.35], 
                opacity: [0.7, 0] 
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: (ring - 1) * 0.9,
                ease: 'easeOut'
              }}
            />
          ))}

          {/* Compass Tick Ring */}
          <div className="absolute inset-0 rounded-full border border-slate-800 flex items-center justify-center">
            <div className="w-full h-full rounded-full border-2 border-dashed border-cyan-500/20 animate-spin" style={{ animationDuration: '40s' }} />
          </div>

          {/* Rotating Radar Sweep Cone */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          >
            <div 
              className="w-1/2 h-1/2 origin-bottom-right"
              style={{
                background: 'conic-gradient(from 0deg at 100% 100%, rgba(0,240,255,0.4) 0deg, rgba(0,240,255,0) 60deg)'
              }}
            />
          </motion.div>

          {/* Core HUD Badge */}
          <motion.div 
            animate={{ scale: [0.96, 1.04, 0.96] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900/90 border border-cyan-500/50 shadow-[0_0_35px_rgba(0,240,255,0.3)] flex flex-col items-center justify-center backdrop-blur-xl"
          >
            <div className="relative">
              <Radar className="w-10 h-10 text-cyan-400 animate-pulse" />
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-cyan-400/30 blur-sm"
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-300 tracking-wider mt-1">
              DEEPSCAN AI
            </span>
          </motion.div>
        </div>

        {/* Title & Hackathon Header */}
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-700/50 text-[11px] font-mono text-cyan-300 shadow-inner"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SMART INDIA HACKATHON 2026 • AI SONAR SUITE</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono"
          >
            AeroAqua <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">DeepScan AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-slate-400 font-mono max-w-md mx-auto"
          >
            Autonomous Underwater Vehicle (AUV) Side-Scan Sonar Marine Debris Detection & Bathymetric Geospatial GIS
          </motion.p>
        </div>

        {/* Progress Bar & Telemetry Status */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Activity className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              SYSTEM BOOT: {progress}%
            </span>
            <span className="text-slate-500 text-[11px]">
              {progress < 100 ? 'CALIBRATING ACOUSTIC SENSORS' : 'SYSTEM READY'}
            </span>
          </div>

          {/* Futuristic Glowing Progress Track */}
          <div className="w-full h-2.5 bg-slate-950 rounded-full border border-slate-800 p-0.5 overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Live Step Diagnostic Log */}
          <div className="h-14 flex flex-col items-center justify-center text-xs font-mono">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLogIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5"
              >
                <div className="text-cyan-300 font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{BOOT_LOGS[currentLogIndex]?.text}</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  {BOOT_LOGS[currentLogIndex]?.detail}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Diagnostic Badges Grid */}
        <div className="grid grid-cols-3 gap-2 w-full pt-1">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2 text-left">
            <span className="text-[9px] font-mono text-slate-500 block uppercase">Transducer</span>
            <span className="text-xs font-mono font-bold text-cyan-400">450 / 900 kHz</span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2 text-left">
            <span className="text-[9px] font-mono text-slate-500 block uppercase">Inference Engine</span>
            <span className="text-xs font-mono font-bold text-emerald-400">YOLO-11 TensorRT</span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2 text-left">
            <span className="text-[9px] font-mono text-slate-500 block uppercase">GIS Georef</span>
            <span className="text-xs font-mono font-bold text-amber-400">Bathymetry OK</span>
          </div>
        </div>

        {/* Skip / Launch Prompt */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSkip}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-2 shadow-lg group cursor-pointer"
        >
          <span>{progress >= 100 ? 'Entering Command Center...' : 'Skip Diagnostics & Launch'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          <span className="text-[10px] text-slate-500 ml-1 hidden sm:inline">(Space / Enter)</span>
        </motion.button>

      </div>
    </motion.div>
  );
}
