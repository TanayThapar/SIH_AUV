import React from 'react';
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
  ShieldAlert
} from 'lucide-react';
import { SURVEY_STATS } from '../data/sonarSamples';

export default function Navbar({ activeTab, setActiveTab }) {
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
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-lg border-b border-cyan-500/20 px-4 lg:px-6 py-2.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Mission Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 cursor-pointer" 
            onClick={() => setActiveTab('waterfall')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 glow-cyan overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <Radar className="w-5 h-5 text-cyan-400" />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-lg border border-cyan-300 pointer-events-none"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 text-lg tracking-wider font-mono">
                  AeroAqua DeepScan
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-mono font-semibold">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                AUV DeepScan-04 • SSS Stream Active
              </p>
            </div>
          </motion.div>

          {/* Mobile Telemetry pill */}
          <div className="flex md:hidden items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-900 px-2.5 py-1 rounded border border-cyan-900">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>{SURVEY_STATS.detectedDebrisCount} Debris</span>
          </div>
        </div>

        {/* Navigation Tabs with Animated Pill Motion */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none p-1 bg-slate-900/60 rounded-xl border border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap font-mono z-10 ${
                  isActive
                    ? 'text-cyan-200 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                } ${item.highlight ? 'text-amber-300' : ''}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/60 rounded-lg glow-cyan -z-10 shadow-sm"
                  />
                )}
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1 rounded uppercase font-bold ${
                    item.badge === 'LIVE' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Quick Live Telemetry Indicator */}
        <div className="hidden xl:flex items-center gap-4 text-xs font-mono text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 shadow-inner">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">Pings:</span>
            <span className="text-emerald-300 font-semibold">{SURVEY_STATS.totalPingsProcessed}</span>
          </div>
          <div className="w-px h-3.5 bg-slate-700"></div>
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Anomalies:</span>
            <span className="text-amber-300 font-semibold">{SURVEY_STATS.detectedDebrisCount}</span>
          </div>
          <div className="w-px h-3.5 bg-slate-700"></div>
          <div className="flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">{SURVEY_STATS.auvBatteryPct}%</span>
          </div>
        </div>

      </div>
    </header>
  );
}
