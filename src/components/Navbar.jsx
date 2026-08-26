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
  Terminal,
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
    { id: 'waterfall', label: '01:WATERFALL', icon: Radar, badge: 'LIVE' },
    { id: 'analysis', label: '02:STUDIO', icon: Layers },
    { id: 'map', label: '03:GIS_MAP', icon: MapPin },
    { id: 'synthetic', label: '04:SYNTH_GAN', icon: Sparkles, badge: 'USP' },
    { id: 'edge', label: '05:EDGE_TEL', icon: Cpu },
    { id: 'report', label: '06:REPORT', icon: FileText },
    { id: 'pitch', label: '07:SIH_PITCH', icon: Compass, highlight: true }
  ];

  return (
    <header className={`sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-md border-b ${currentTheme.navBorder} px-3 lg:px-6 py-2 shadow-2xl transition-colors duration-300 font-mono`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Terminal Header Prompt & Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="flex items-center gap-2.5 cursor-pointer" 
            onClick={() => setActiveTab('waterfall')}
          >
            <div className={`relative flex items-center justify-center w-8 h-8 rounded bg-black border ${currentTheme.navLogoBox} overflow-hidden transition-all duration-300`}>
              <Terminal className={`w-4 h-4 ${currentTheme.navLogoText}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wider text-white flex items-center">
                  <span style={{ color: currentTheme.primary }}>root@deepscan</span>
                  <span className="text-neutral-500">:</span>
                  <span className="text-neutral-300">~$</span>
                  <span className="ml-1.5 text-xs text-white">./auv_sonar</span>
                  <span className="inline-block w-2 h-3.5 ml-1 bg-white cursor-blink" style={{ backgroundColor: currentTheme.primary }} />
                </span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border ${currentTheme.navBadge} transition-colors`}>
                  [SIH_2026]
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentTheme.primary }}></span>
                <span>TTY1 • 450kHz SSS ARRAY ACTIVE • USBL LOCKED</span>
              </p>
            </div>
          </motion.div>

          {/* Theme Selector for Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
              aria-label="Theme selector"
            >
              <Terminal className="w-4 h-4" style={{ color: currentTheme.primary }} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs with Terminal Bracket Pill Motion */}
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
                    ? `${currentTheme.activeTabText}`
                    : 'text-neutral-400 hover:text-neutral-200'
                } ${item.highlight ? 'text-amber-400' : ''}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className={`absolute inset-0 bg-gradient-to-r ${currentTheme.activeTabPill} border rounded -z-10 shadow-sm`}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 ${isActive ? currentTheme.tabIconActive : 'text-neutral-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold ${
                    item.badge === 'LIVE' ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' : 'bg-neutral-900 text-neutral-300 border border-neutral-700'
                  }`}>
                    [{item.badge}]
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Right Section: Terminal Status Bar + Theme Preset Switcher */}
        <div className="hidden lg:flex items-center gap-2.5">
          
          {/* Quick Terminal Telemetry */}
          <div className="flex items-center gap-2.5 text-[11px] font-mono text-neutral-300 bg-black/90 px-2.5 py-1 rounded border border-neutral-800 shadow-inner">
            <div className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-neutral-400 animate-pulse" />
              <span className="text-neutral-500">PINGS:</span>
              <span className="text-white font-bold">{SURVEY_STATS.totalPingsProcessed}</span>
            </div>
            <div className="w-px h-3 bg-neutral-800"></div>
            <div className="flex items-center gap-1">
              <BatteryCharging className="w-3 h-3 text-neutral-400" />
              <span className="text-neutral-500">BAT:</span>
              <span className="text-white font-bold">{SURVEY_STATS.auvBatteryPct}%</span>
            </div>
          </div>

          {/* Terminal Theme Preset Switcher */}
          <div className="relative" ref={themeMenuRef}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-mono text-neutral-300 shadow-md transition-all cursor-pointer"
              title="Select Terminal Color Scheme"
            >
              <Terminal className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: currentTheme.dotColor, boxShadow: `0 0 6px ${currentTheme.dotColor}` }}></span>
              <span className="hidden xl:inline text-[11px] font-bold">[{currentTheme.name}]</span>
            </motion.button>

            {/* Theme Dropdown Menu */}
            <AnimatePresence>
              {isThemeMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-2 w-64 bg-black border border-neutral-800 rounded p-1.5 shadow-2xl z-50 backdrop-blur-xl space-y-1 font-mono"
                >
                  <div className="px-2 py-1 border-b border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="font-bold flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-white" />
                      TERMINAL COLOR PRESETS
                    </span>
                    <span className="text-[9px] text-neutral-600">[VT_MODE]</span>
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
                          className={`w-full flex items-center justify-between p-1.5 rounded text-xs transition-all text-left cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-900 border border-neutral-700 text-white'
                              : 'text-neutral-400 hover:bg-neutral-950 hover:text-neutral-200 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2.5 h-2.5 rounded-sm border border-neutral-700"
                              style={{ 
                                backgroundColor: t.dotColor,
                                boxShadow: isSelected ? `0 0 8px ${t.dotColor}` : 'none'
                              }}
                            />
                            <div>
                              <div className="font-bold text-neutral-200 text-[11px]">{t.name}</div>
                              <div className="text-[9px] text-neutral-500">{t.subtitle}</div>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5" style={{ color: t.primary }} />
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
