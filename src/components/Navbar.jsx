import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ShieldAlert,
  Palette,
  Check
} from 'lucide-react';
import { SURVEY_STATS } from '../data/sonarSamples';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { currentTheme, currentThemeId, setTheme, themes } = useTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className={`sticky top-0 z-50 bg-slate-950/85 backdrop-blur-lg border-b ${currentTheme.navBorder} px-4 lg:px-6 py-2.5 shadow-xl transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Mission Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 cursor-pointer" 
            onClick={() => setActiveTab('waterfall')}
          >
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${currentTheme.navLogoBox} overflow-hidden transition-all duration-300`}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <Radar className={`w-5 h-5 ${currentTheme.navLogoText}`} />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-lg border pointer-events-none"
                style={{ borderColor: currentTheme.primary }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.textGradient} text-lg tracking-wider font-mono transition-all duration-300`}>
                  AeroAqua DeepScan
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold border ${currentTheme.navBadge} transition-colors`}>
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                AUV DeepScan-04 • SSS Stream Active
              </p>
            </div>
          </motion.div>

          {/* Theme Selector for Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
              aria-label="Theme selector"
            >
              <Palette className="w-4 h-4" style={{ color: currentTheme.primary }} />
            </button>
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
                    ? `${currentTheme.activeTabText} font-bold`
                    : 'text-slate-400 hover:text-slate-200'
                } ${item.highlight ? 'text-amber-300' : ''}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className={`absolute inset-0 bg-gradient-to-r ${currentTheme.activeTabPill} border rounded-lg -z-10 shadow-sm`}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 ${isActive ? currentTheme.tabIconActive : 'text-slate-400'}`} />
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

        {/* Right Section: Live Telemetry + Theme Switcher Dropdown */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Quick Live Telemetry Indicator */}
          <div className="flex items-center gap-3 text-xs font-mono text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 shadow-inner">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-400">Pings:</span>
              <span className="text-emerald-300 font-semibold">{SURVEY_STATS.totalPingsProcessed}</span>
            </div>
            <div className="w-px h-3.5 bg-slate-700"></div>
            <div className="flex items-center gap-1.5">
              <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Bat:</span>
              <span className="text-cyan-300 font-semibold">{SURVEY_STATS.auvBatteryPct}%</span>
            </div>
          </div>

          {/* Theme Switcher Button & Dropdown */}
          <div className="relative" ref={themeMenuRef}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 shadow-md transition-all cursor-pointer"
              title="Change Color Theme"
            >
              <Palette className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentTheme.dotColor, boxShadow: `0 0 8px ${currentTheme.dotColor}` }}></span>
              <span className="hidden xl:inline font-semibold">{currentTheme.name}</span>
            </motion.button>

            {/* Theme Dropdown Menu */}
            <AnimatePresence>
              {isThemeMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-slate-950 border border-slate-800 rounded-xl p-2 shadow-2xl z-50 backdrop-blur-xl space-y-1 font-mono"
                >
                  <div className="px-2.5 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-cyan-400" />
                      SONAR COLOR THEME
                    </span>
                    <span className="text-[10px] text-slate-500">5 PRESETS</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    {Object.values(themes).map((t) => {
                      const isSelected = currentThemeId === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id);
                            setIsThemeMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all text-left cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 border border-slate-700 text-white'
                              : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                              style={{ 
                                backgroundColor: t.dotColor,
                                boxShadow: isSelected ? `0 0 10px ${t.dotColor}` : 'none'
                              }}
                            />
                            <div>
                              <div className="font-bold text-slate-200 text-[12px]">{t.name}</div>
                              <div className="text-[10px] text-slate-500">{t.subtitle}</div>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4" style={{ color: t.primary }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </header>
  );
}
