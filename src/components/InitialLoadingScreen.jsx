import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, Activity, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const BOOT_LOGS = [
  { text: 'Initializing AUV Side-Scan Acoustic Transducers...', detail: 'Dual-frequency 450/900 kHz array active' },
  { text: 'Establishing GNSS-Denied Inertial Hydro-Acoustic Link...', detail: 'USBL positioning locked (14.5°N, 75.5°E)' },
  { text: 'Loading ONNX Acoustic Anomaly Detection Weights...', detail: 'DeepLab-Sonar v4.2 compiled for Edge TensorRT' },
  { text: 'Synchronizing Seafloor Bathymetric GIS Heatmaps...', detail: 'Loaded Arabian Sea & Bay of Bengal corridors' },
  { text: 'Deploying Real-Time Slant-Range Correction Filter...', detail: 'Shadow analysis & geometric height estimation ready' },
  { text: 'AeroAqua DeepScan AI System Initialized & Online', detail: 'Mission parameters verified — All nodes green' }
];

export default function InitialLoadingScreen({ onComplete }) {
  const { currentTheme } = useTheme();
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
      className="fixed inset-0 z-[9999] bg-black text-neutral-100 flex flex-col items-center justify-center p-4 overflow-hidden select-none"
    >
      {/* Background Animated Ambient Radiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] ${currentTheme.ambient1} rounded-full blur-[140px] animate-pulse`} />
        <div className={`absolute bottom-0 left-1/4 w-[30rem] h-[30rem] ${currentTheme.ambient2} rounded-full blur-[130px]`} />
        
        {/* Sonar Grid overlay */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle, ${currentTheme.primary}22 1px, transparent 1px)`,
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
              className="absolute inset-0 rounded-full border"
              style={{ borderColor: `${currentTheme.primary}44` }}
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
          <div className="absolute inset-0 rounded-full border border-neutral-800 flex items-center justify-center">
            <div 
              className="w-full h-full rounded-full border-2 border-dashed animate-spin" 
              style={{ borderColor: `${currentTheme.primary}33`, animationDuration: '40s' }} 
            />
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
                background: `conic-gradient(from 0deg at 100% 100%, ${currentTheme.primary}66 0deg, rgba(0,0,0,0) 60deg)`
              }}
            />
          </motion.div>

          {/* Core HUD Badge */}
          <motion.div 
            animate={{ scale: [0.96, 1.04, 0.96] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-neutral-900/90 border shadow-2xl flex flex-col items-center justify-center backdrop-blur-xl`}
            style={{ 
              borderColor: `${currentTheme.primary}80`,
              boxShadow: `0 0 35px ${currentTheme.primary}44`
            }}
          >
            <div className="relative">
              <Radar className="w-10 h-10 animate-pulse" style={{ color: currentTheme.primary }} />
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full blur-sm"
                style={{ backgroundColor: `${currentTheme.primary}44` }}
              />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-wider mt-1" style={{ color: currentTheme.primary }}>
              DEEPSCAN AI
            </span>
          </motion.div>
        </div>

        {/* Title & Terminal Boot Header */}
        <div className="space-y-2 font-mono">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded border text-[11px] font-mono shadow-inner ${currentTheme.navBadge}`}
          >
            <span className="text-white font-bold">&gt;_ BIOS_LOADER</span>
            <span className="text-neutral-500">|</span>
            <span>SMART INDIA HACKATHON 2026 • AI SONAR SUITE</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-center justify-center gap-2"
          >
            <span>&gt; AEROAQUA</span>
            <span style={{ color: currentTheme.primary }}>DEEPSCAN_AI</span>
            <span className="inline-block w-2.5 h-6 cursor-blink" style={{ backgroundColor: currentTheme.primary }} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-neutral-400 font-mono max-w-md mx-auto"
          >
            [ KERNEL_INIT ]: Autonomous Underwater Vehicle (AUV) Side-Scan Sonar Telemetry &amp; Bathymetric GIS
          </motion.p>
        </div>

        {/* Progress Bar & Telemetry Status */}
        <div className="w-full space-y-2.5 font-mono">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 font-bold" style={{ color: currentTheme.primary }}>
              <span>[ BOOT_SEQUENCE: {progress}% ]</span>
            </span>
            <span className="text-neutral-500 text-[11px]">
              {progress < 100 ? '&gt; CALIBRATING_ACOUSTIC_SENSORS...' : '[ SYSTEM_ONLINE ]'}
            </span>
          </div>

          {/* Terminal Progress Bar Track */}
          <div className="w-full h-2 bg-black rounded-none border border-neutral-800 p-0.5 overflow-hidden">
            <motion.div
              className={`h-full ${currentTheme.glowClass}`}
              style={{ 
                width: `${progress}%`,
                backgroundColor: currentTheme.primary,
                boxShadow: `0 0 10px ${currentTheme.primary}`
              }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Live Step Diagnostic Log */}
          <div className="h-12 flex flex-col items-center justify-center text-xs font-mono bg-black/60 border border-neutral-900 rounded p-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLogIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-0.5"
              >
                <div className="font-semibold flex items-center justify-center gap-2" style={{ color: currentTheme.primary }}>
                  <span className="text-white font-bold">[ OK ]</span>
                  <span>{BOOT_LOGS[currentLogIndex]?.text}</span>
                </div>
                <div className="text-[10px] text-neutral-500">
                  &gt; {BOOT_LOGS[currentLogIndex]?.detail}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Diagnostic Badges Grid */}
        <div className="grid grid-cols-3 gap-2 w-full pt-1 font-mono">
          <div className="bg-black border border-neutral-800 rounded p-2 text-left">
            <span className="text-[9px] text-neutral-500 block uppercase">[ TRANSDUCER ]</span>
            <span className="text-xs font-bold" style={{ color: currentTheme.primary }}>450 / 900 kHz</span>
          </div>
          <div className="bg-black border border-neutral-800 rounded p-2 text-left">
            <span className="text-[9px] text-neutral-500 block uppercase">[ INFERENCE ]</span>
            <span className="text-xs font-bold text-white">YOLO-11 TensorRT</span>
          </div>
          <div className="bg-black border border-neutral-800 rounded p-2 text-left">
            <span className="text-[9px] text-neutral-500 block uppercase">[ GIS_GEOREF ]</span>
            <span className="text-xs font-bold text-white">BATHYMETRY_OK</span>
          </div>
        </div>

        {/* Skip / Launch Prompt */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSkip}
          className="px-4 py-2 rounded bg-black hover:bg-neutral-900 border border-neutral-700 hover:border-white text-xs font-mono text-neutral-300 hover:text-white transition-all flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <span>{progress >= 100 ? '[ ENTER_COMMAND_CENTER ]' : '[ SKIP_DIAGNOSTICS & EXECUTE ]'}</span>
          <span className="text-[10px] text-neutral-500 ml-1">(SPACE / ENTER)</span>
        </motion.button>

      </div>
    </motion.div>
  );
}
