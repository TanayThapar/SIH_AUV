import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  'terminal-mono': {
    id: 'terminal-mono',
    name: 'ANSI MONOCHROME',
    subtitle: 'Pure Terminal White / Black',
    dotColor: '#f5f5f5',
    primary: '#f5f5f5',
    accent: '#ffffff',
    bgRadial: 'radial-gradient(at 50% 0%, rgba(255, 255, 255, 0.03) 0px, #050505 70%)',
    ambient1: 'bg-neutral-800/10',
    ambient2: 'bg-neutral-900/10',
    glowClass: 'glow-mono',
    textGradient: 'from-neutral-100 via-neutral-200 to-neutral-400',
    navBorder: 'border-neutral-800',
    navLogoBox: 'from-neutral-900 to-black border-neutral-700 glow-mono',
    navLogoText: 'text-neutral-100',
    navBadge: 'bg-neutral-900 text-neutral-300 border-neutral-700',
    activeTabPill: 'from-neutral-900 to-black border-neutral-400 glow-mono',
    activeTabText: 'text-white font-bold',
    tabIconActive: 'text-white',
    btnPrimary: 'bg-white hover:bg-neutral-200 text-black font-bold font-mono shadow-neutral-900',
    cardBorder: 'border-neutral-800',
  },
  'terminal-green': {
    id: 'terminal-green',
    name: 'VT100 PHOSPHOR',
    subtitle: 'Classic Green Terminal',
    dotColor: '#22c55e',
    primary: '#22c55e',
    accent: '#4ade80',
    bgRadial: 'radial-gradient(at 50% 0%, rgba(34, 197, 94, 0.04) 0px, #040805 70%)',
    ambient1: 'bg-emerald-900/10',
    ambient2: 'bg-green-950/10',
    glowClass: 'glow-terminal-green',
    textGradient: 'from-green-400 via-emerald-300 to-green-500',
    navBorder: 'border-green-950',
    navLogoBox: 'from-green-950/40 to-black border-green-700/50 glow-terminal-green',
    navLogoText: 'text-green-400',
    navBadge: 'bg-green-950/80 text-green-300 border-green-800',
    activeTabPill: 'from-green-950/60 to-black border-green-500/70 glow-terminal-green',
    activeTabText: 'text-green-300 font-bold',
    tabIconActive: 'text-green-400',
    btnPrimary: 'bg-green-500 hover:bg-green-400 text-black font-bold font-mono shadow-green-950',
    cardBorder: 'border-green-950',
  },
  'terminal-amber': {
    id: 'terminal-amber',
    name: 'VT220 AMBER CRT',
    subtitle: 'Warm Phosphor Terminal',
    dotColor: '#f59e0b',
    primary: '#f59e0b',
    accent: '#fbbf24',
    bgRadial: 'radial-gradient(at 50% 0%, rgba(245, 158, 11, 0.04) 0px, #080602 70%)',
    ambient1: 'bg-amber-950/10',
    ambient2: 'bg-yellow-950/10',
    glowClass: 'glow-terminal-amber',
    textGradient: 'from-amber-400 via-yellow-300 to-amber-500',
    navBorder: 'border-amber-950',
    navLogoBox: 'from-amber-950/40 to-black border-amber-700/50 glow-terminal-amber',
    navLogoText: 'text-amber-400',
    navBadge: 'bg-amber-950/80 text-amber-300 border-amber-800',
    activeTabPill: 'from-amber-950/60 to-black border-amber-500/70 glow-terminal-amber',
    activeTabText: 'text-amber-300 font-bold',
    tabIconActive: 'text-amber-400',
    btnPrimary: 'bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono shadow-amber-950',
    cardBorder: 'border-amber-950',
  },
  'stealth-carbon': {
    id: 'stealth-carbon',
    name: 'STEALTH CARBON',
    subtitle: 'Matte Slate Titanium',
    dotColor: '#94a3b8',
    primary: '#e2e8f0',
    accent: '#cbd5e1',
    bgRadial: 'radial-gradient(at 50% 0%, rgba(148, 163, 184, 0.03) 0px, #08090c 70%)',
    ambient1: 'bg-slate-800/10',
    ambient2: 'bg-zinc-900/10',
    glowClass: 'glow-carbon',
    textGradient: 'from-slate-200 via-slate-300 to-zinc-400',
    navBorder: 'border-slate-800',
    navLogoBox: 'from-slate-900 to-black border-slate-700 glow-carbon',
    navLogoText: 'text-slate-200',
    navBadge: 'bg-slate-900 text-slate-300 border-slate-700',
    activeTabPill: 'from-slate-900 to-black border-slate-500 glow-carbon',
    activeTabText: 'text-white font-bold',
    tabIconActive: 'text-slate-200',
    btnPrimary: 'bg-slate-200 hover:bg-white text-black font-bold font-mono shadow-slate-950',
    cardBorder: 'border-slate-800',
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    try {
      const saved = localStorage.getItem('sih_auv_theme');
      if (saved && THEMES[saved]) return saved;
      return 'terminal-mono';
    } catch {
      return 'terminal-mono';
    }
  });

  const currentTheme = THEMES[currentThemeId] || THEMES['terminal-mono'];

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

