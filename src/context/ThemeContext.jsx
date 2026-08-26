import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  cyan: {
    id: 'cyan',
    name: 'Acoustic Cyan',
    subtitle: 'Classic DeepScan HUD',
    dotColor: '#00f0ff',
    primary: '#00f0ff',
    accent: '#06b6d4',
    bgRadial: 'radial-gradient(at 0% 0%, rgba(6, 78, 119, 0.25) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(2, 132, 199, 0.15) 0px, transparent 50%)',
    ambient1: 'bg-cyan-600/20',
    ambient2: 'bg-blue-600/15',
    glowClass: 'glow-cyan',
    textGradient: 'from-cyan-400 via-teal-300 to-blue-400',
    navBorder: 'border-cyan-500/20',
    navLogoBox: 'from-cyan-500/20 to-blue-600/30 border-cyan-400/40 glow-cyan',
    navLogoText: 'text-cyan-400',
    navBadge: 'bg-cyan-950 text-cyan-300 border-cyan-700/50',
    activeTabPill: 'from-cyan-500/25 to-blue-600/25 border-cyan-400/70 glow-cyan',
    activeTabText: 'text-cyan-200',
    tabIconActive: 'text-cyan-400',
    btnPrimary: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/40',
    cardBorder: 'border-cyan-500/30',
  },
  emerald: {
    id: 'emerald',
    name: 'Oceanic Emerald',
    subtitle: 'Tactical Submarine Sonar',
    dotColor: '#10b981',
    primary: '#10b981',
    accent: '#059669',
    bgRadial: 'radial-gradient(at 0% 0%, rgba(6, 95, 70, 0.28) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(4, 120, 87, 0.2) 0px, transparent 50%)',
    ambient1: 'bg-emerald-600/20',
    ambient2: 'bg-teal-600/15',
    glowClass: 'glow-emerald',
    textGradient: 'from-emerald-400 via-teal-300 to-green-400',
    navBorder: 'border-emerald-500/20',
    navLogoBox: 'from-emerald-500/20 to-teal-600/30 border-emerald-400/40 glow-emerald',
    navLogoText: 'text-emerald-400',
    navBadge: 'bg-emerald-950 text-emerald-300 border-emerald-700/50',
    activeTabPill: 'from-emerald-500/25 to-teal-600/25 border-emerald-400/70 glow-emerald',
    activeTabText: 'text-emerald-200',
    tabIconActive: 'text-emerald-400',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40',
    cardBorder: 'border-emerald-500/30',
  },
  amber: {
    id: 'amber',
    name: 'Phosphor Amber',
    subtitle: 'Naval CRT Sonar Phosphor',
    dotColor: '#f59e0b',
    primary: '#f59e0b',
    accent: '#d97706',
    bgRadial: 'radial-gradient(at 0% 0%, rgba(120, 53, 15, 0.3) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(180, 83, 9, 0.2) 0px, transparent 50%)',
    ambient1: 'bg-amber-600/20',
    ambient2: 'bg-orange-600/15',
    glowClass: 'glow-amber',
    textGradient: 'from-amber-400 via-yellow-300 to-orange-400',
    navBorder: 'border-amber-500/20',
    navLogoBox: 'from-amber-500/20 to-orange-600/30 border-amber-400/40 glow-amber',
    navLogoText: 'text-amber-400',
    navBadge: 'bg-amber-950 text-amber-300 border-amber-700/50',
    activeTabPill: 'from-amber-500/25 to-orange-600/25 border-amber-400/70 glow-amber',
    activeTabText: 'text-amber-200',
    tabIconActive: 'text-amber-400',
    btnPrimary: 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold shadow-amber-900/40',
    cardBorder: 'border-amber-500/30',
  },
  violet: {
    id: 'violet',
    name: 'Abyss Violet',
    subtitle: 'Cyberpunk Deep Space',
    dotColor: '#a855f7',
    primary: '#a855f7',
    accent: '#8b5cf6',
    bgRadial: 'radial-gradient(at 0% 0%, rgba(88, 28, 135, 0.3) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(109, 40, 217, 0.2) 0px, transparent 50%)',
    ambient1: 'bg-purple-600/20',
    ambient2: 'bg-fuchsia-600/15',
    glowClass: 'glow-violet',
    textGradient: 'from-purple-400 via-pink-300 to-indigo-400',
    navBorder: 'border-purple-500/20',
    navLogoBox: 'from-purple-500/20 to-indigo-600/30 border-purple-400/40 glow-violet',
    navLogoText: 'text-purple-400',
    navBadge: 'bg-purple-950 text-purple-300 border-purple-700/50',
    activeTabPill: 'from-purple-500/25 to-indigo-600/25 border-purple-400/70 glow-violet',
    activeTabText: 'text-purple-200',
    tabIconActive: 'text-purple-400',
    btnPrimary: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/40',
    cardBorder: 'border-purple-500/30',
  },
  arctic: {
    id: 'arctic',
    name: 'Arctic Ice',
    subtitle: 'Cryo Cobalt Blue HUD',
    dotColor: '#38bdf8',
    primary: '#38bdf8',
    accent: '#2563eb',
    bgRadial: 'radial-gradient(at 0% 0%, rgba(3, 105, 161, 0.3) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(29, 78, 216, 0.2) 0px, transparent 50%)',
    ambient1: 'bg-sky-600/20',
    ambient2: 'bg-blue-700/15',
    glowClass: 'glow-arctic',
    textGradient: 'from-sky-300 via-blue-200 to-indigo-300',
    navBorder: 'border-sky-500/20',
    navLogoBox: 'from-sky-500/20 to-blue-700/30 border-sky-400/40 glow-arctic',
    navLogoText: 'text-sky-400',
    navBadge: 'bg-sky-950 text-sky-300 border-sky-700/50',
    activeTabPill: 'from-sky-500/25 to-blue-600/25 border-sky-400/70 glow-arctic',
    activeTabText: 'text-sky-200',
    tabIconActive: 'text-sky-400',
    btnPrimary: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-900/40',
    cardBorder: 'border-sky-500/30',
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    try {
      return localStorage.getItem('sih_auv_theme') || 'cyan';
    } catch {
      return 'cyan';
    }
  });

  const currentTheme = THEMES[currentThemeId] || THEMES.cyan;

  useEffect(() => {
    try {
      localStorage.setItem('sih_auv_theme', currentThemeId);
    } catch {
      // ignore
    }
    document.documentElement.setAttribute('data-theme', currentThemeId);
  }, [currentThemeId]);

  return (
    <ThemeContext.Provider value={{ currentTheme, currentThemeId, setTheme: setCurrentThemeId, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
