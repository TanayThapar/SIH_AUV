import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, 
  Layers, 
  MapPin, 
  Sparkles, 
  Cpu, 
  FileText, 
  Compass, 
  Radio, 
  BatteryCharging,
  Zap,
  Keyboard
} from 'lucide-react';
import { SURVEY_STATS } from '../data/sonarSamples';

export default function Navbar({ activeTab, setActiveTab, onOpenJudgeTour, onOpenShortcuts }) {
  const navItems = [
    { id: 'waterfall', label: 'Live Sonar Waterfall', icon: Radar, badge: 'LIVE' },
    { id: 'analysis', label: 'Acoustic Studio', icon: Layers },
    { id: 'map', label: 'Geospatial Map', icon: MapPin },
    { id: 'synthetic', label: 'GAN Synthesizer', icon: Sparkles, badge: 'USP' },
    { id: 'edge', label: 'Edge Telemetry', icon: Cpu },
    { id: 'report', label: 'Mission Report', icon: FileText },
    { id: 'pitch', label: 'SIH Pitch', icon: Compass, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-md border-b border-neutral-800 px-3 lg:px-6 py-2 shadow-2xl transition-colors duration-300 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Brand & Radar Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setActiveTab('waterfall')}
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-700 overflow-hidden shadow-lg shadow-black/40">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <Radar className="w-4 h-4 text-white" />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-lg border border-white/60 pointer-events-none"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wider text-white font-mono">
                  AeroAqua DeepScan
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-neutral-900 text-neutral-300 border border-neutral-700">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                <span>AUV SIDE-SCAN SONAR AI • 450kHz SSS</span>
              </p>
            </div>
          </motion.div>

          {/* Quick Tour Button for Mobile */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onOpenJudgeTour}
              className="px-2 py-1 rounded bg-white text-black text-xs font-bold flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              <span>TOUR</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none p-1 bg-black/80 rounded border border-neutral-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors whitespace-nowrap z-10 cursor-pointer ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                } ${item.highlight ? 'text-white font-bold' : ''}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-neutral-900 border border-neutral-600 rounded -z-10 shadow-sm"
                  />
                )}
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold ${
                    item.badge === 'LIVE' ? 'bg-neutral-900 text-white border border-neutral-600 animate-pulse' : 'bg-neutral-900 text-neutral-300 border border-neutral-700'
                  }`}>
                    [{item.badge}]
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Right Section: 60s Judge Tour + Telemetry + Keyboard Helper */}
        <div className="hidden lg:flex items-center gap-2">
          
          {/* Prominent 60s Judge Walkthrough Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenJudgeTour}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-200 text-black rounded text-xs font-mono font-black shadow-lg shadow-white/10 transition-all cursor-pointer border border-white"
            title="Launch 60-Second Guided Evaluation Walkthrough (Key: J)"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>[ ⚡ 60s JUDGE TOUR ]</span>
          </motion.button>

          {/* Telemetry Status Bar */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-300 bg-black/90 px-2.5 py-1.5 rounded border border-neutral-800 shadow-inner">
            <div className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-white animate-pulse" />
              <span className="text-neutral-500">PINGS:</span>
              <span className="text-white font-bold">{SURVEY_STATS.totalPingsProcessed}</span>
            </div>
            <div className="w-px h-3 bg-neutral-800"></div>
            <div className="flex items-center gap-1">
              <BatteryCharging className="w-3 h-3 text-white" />
              <span className="text-neutral-500">BAT:</span>
              <span className="text-white font-bold">{SURVEY_STATS.auvBatteryPct}%</span>
            </div>
          </div>

          {/* Keyboard Shortcuts Helper Button */}
          <button
            onClick={onOpenShortcuts}
            className="p-1.5 rounded bg-black hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Keyboard Shortcuts Cheat Sheet (Key: ?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
