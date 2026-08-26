import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  emerald: {
    id: 'emerald',
    name: 'Tactical Emerald',
    subtitle: 'Submarine Sonar Matrix',
    dotColor: '#10b981',
    primary: '#10b981',
    accent: '#059669',
    bgRadial: 'radial-gradient(at 50% 0%, rgba(16, 185, 129, 0.04) 0px, #0f1117 70%)',
    ambient1: 'bg-emerald-500/5',
    ambient2: 'bg-slate-700/5',
    glowClass: 'glow-emerald',
    textGradient: 'from-emerald-400 via-teal-300 to-green-400',
    navBorder: 'border-slate-800',
    navLogoBox: 'from-slate-800 to-slate-900 border-emerald-500/30 glow-emerald',
    navLogoText: 'text-emerald-400',
    navBadge: 'bg-slate-900 text-emerald-300 border-emerald-700/40',
    activeTabPill: 'from-slate-800 to-slate-900 border-emerald-500/50 glow-emerald',
    activeTabText: 'text-emerald-300',
    tabIconActive: 'text-emerald-400',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold shadow-emerald-950/40',
    cardBorder: 'border-slate-800',
  },
  carbon: {
    id: 'carbon',
    name: 'Stealth Carbon',
    subtitle: 'Monochrome Matte HUD',
    dotColor: '#e2e8f0',
    primary: '#e2e8f0',
    accent: '#94a3b8',
    bgRadial: 'radial-gradient(at 50% 0%, rgba(255, 255, 255, 0.03) 0px, #0f1117 70%)',
    ambient1: 'bg-slate-700/5',
    ambient2: 'bg-zinc-800/5',
    glowClass: 'glow-carbon',
    textGradient: 'from-slate-100 via-zinc-300 to-slate-300',
    navBorder: 'border-slate-800',
    navLogoBox: 'from-slate-800 to-slate-900 border-slate-700 glow-carbon',
    navLogoText: 'text-slate-200',
    navBadge: 'bg-slate-900 text-slate-300 border-slate-700',
    activeTabPill: 'from-slate-800 to-slate-900 border-slate-600 glow-carbon',
    activeTabText: 'text-white',
    tabIconActive: 'text-slate-200',
    btnPrimary: 'bg-slate-200 hover:bg-white text-slate-950 font-bold shadow-slate-900/40',
    cardBorder: 'border-slate-800',
  },
  nord: {
    id: 'nord',
    name: 'Nord Professional',
    subtitle: 'Hue 210 WCAG Cool',
    dotColor: '#81A1C1',
    primary: '#81A1C1',
    accent: '#5E81AC',
    bgRadial: 'radial-gradient(at 50% 0%, rgba(94, 129, 172, 0.04) 0px, #0f1117 70%)',
    ambient1: 'bg-slate-700/5',
    ambient2: 'bg-slate-800/5',
    glowClass: 'glow-carbon',
    textGradient: 'from-slate-100 via-sky-200 to-slate-300',
    navBorder: 'border-slate-800',
    navLogoBox: 'from-slate-800 to-slate-900 border-slate-700 glow-carbon',
    navLogoText: 'text-sky-300',
    navBadge: 'bg-slate-900 text-sky-200 border-slate-700',
    activeTabPill: 'from-slate-800 to-slate-900 border-sky-400/40 glow-carbon',
    activeTabText: 'text-sky-200',
    tabIconActive: 'text-sky-300',
    btnPrimary: 'bg-slate-200 hover:bg-white text-slate-950 font-bold shadow-slate-900/40',
    cardBorder: 'border-slate-800',
  },
  amber: {
    id: 'amber',
    name: 'Phosphor Amber',
    subtitle: 'Naval CRT Sonar Gold',
    dotColor: '#f59e0b',
    primary: '#f59e0b',
    accent: '#d97706',
    bgRadial: 'radial-gradient(at 50% 0%, rgba(245, 158, 11, 0.04) 0px, #0f1117 70%)',
    ambient1: 'bg-amber-600/5',
    ambient2: 'bg-orange-700/5',
    glowClass: 'glow-amber',
    textGradient: 'from-amber-400 via-yellow-300 to-orange-400',
    navBorder: 'border-slate-800',
    navLogoBox: 'from-slate-800 to-slate-900 border-amber-500/30 glow-amber',
    navLogoText: 'text-amber-400',
    navBadge: 'bg-slate-900 text-amber-300 border-amber-700/40',
    activeTabPill: 'from-slate-800 to-slate-900 border-amber-400/50 glow-amber',
    activeTabText: 'text-amber-200',
    tabIconActive: 'text-amber-400',
    btnPrimary: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-amber-950/40',
    cardBorder: 'border-slate-800',
  },
  violet: {
    id: 'violet',
    name: 'Abyss Violet',
    subtitle: 'Deep Space Cyber Obsidian',
    dotColor: '#a855f7',
    primary: '#a855f7',
    accent: '#8b5cf6',
    bgRadial: 'radial-gradient(at 50% 0%, rgba(168, 85, 247, 0.04) 0px, #0f1117 70%)',
    ambient1: 'bg-purple-600/5',
    ambient2: 'bg-fuchsia-700/5',
    glowClass: 'glow-violet',
    textGradient: 'from-purple-400 via-pink-300 to-indigo-400',
    navBorder: 'border-slate-800',
    navLogoBox: 'from-slate-800 to-slate-900 border-purple-500/30 glow-violet',
    navLogoText: 'text-purple-400',
    navBadge: 'bg-slate-900 text-purple-300 border-purple-700/40',
    activeTabPill: 'from-slate-800 to-slate-900 border-purple-400/50 glow-violet',
    activeTabText: 'text-purple-200',
    tabIconActive: 'text-purple-400',
    btnPrimary: 'bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-purple-950/40',
    cardBorder: 'border-slate-800',
  },
  teal: {
    id: 'teal',
    name: 'Muted Teal',
    subtitle: 'Low-Saturation Acoustic',
    dotColor: '#14b8a6',
    primary: '#14b8a6',
    accent: '#0d9488',
    bgRadial: 'radial-gradient(at 50% 0%, rgba(20, 184, 166, 0.04) 0px, #0f1117 70%)',
    ambient1: 'bg-teal-600/5',
    ambient2: 'bg-slate-700/5',
    glowClass: 'glow-cyan',
    textGradient: 'from-teal-300 via-emerald-200 to-teal-400',
    navBorder: 'border-slate-800',
    navLogoBox: 'from-slate-800 to-slate-900 border-teal-500/30 glow-cyan',
    navLogoText: 'text-teal-400',
    navBadge: 'bg-slate-900 text-teal-300 border-teal-700/40',
    activeTabPill: 'from-slate-800 to-slate-900 border-teal-400/50 glow-cyan',
    activeTabText: 'text-teal-200',
    tabIconActive: 'text-teal-400',
    btnPrimary: 'bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-teal-950/40',
    cardBorder: 'border-slate-800',
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    try {
      const saved = localStorage.getItem('sih_auv_theme');
      if (saved && THEMES[saved]) return saved;
      return 'emerald';
    } catch {
      return 'emerald';
    }
  });

  const currentTheme = THEMES[currentThemeId] || THEMES.emerald;

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
