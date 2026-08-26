import React from 'react';
import { motion } from 'framer-motion';
import { Keyboard, X, Command } from 'lucide-react';

export const SHORTCUTS = [
  { key: '1', description: 'Jump to 01: Live Sonar Waterfall' },
  { key: '2', description: 'Jump to 02: Acoustic Signal Studio' },
  { key: '3', description: 'Jump to 03: Geospatial Bathymetry Map' },
  { key: '4', description: 'Jump to 04: GAN Synthetic Simulator' },
  { key: '5', description: 'Jump to 05: Edge Telemetry & Hardware' },
  { key: '6', description: 'Jump to 06: Official Maritime Report' },
  { key: '7', description: 'Jump to 07: SIH Project Pitch Deck' },
  { key: 'J', description: 'Launch 60-Second Jury Tour Walkthrough' },
  { key: 'Space', description: 'Pause / Resume Live Waterfall Stream' },
  { key: 'S', description: 'Toggle Split-Screen Comparison (Studio)' },
  { key: 'E', description: 'Export GIS GeoJSON Anomaly Layer (Map)' },
  { key: 'P', description: 'Print / Save Official Incident Dossier' },
  { key: '?', description: 'Toggle Keyboard Shortcut Help' },
  { key: 'Esc', description: 'Close active overlay / modal' }
];

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative z-10 w-full max-w-lg bg-neutral-950 border-2 border-neutral-700 rounded-lg shadow-2xl overflow-hidden text-neutral-100 p-5 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-neutral-900 border border-neutral-700 text-white">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wider">
                [ KEYBOARD SHORTCUTS ]
              </h3>
              <p className="text-[10px] text-neutral-400">
                Rapid hydrographic review &amp; jury demonstration hotkeys
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded bg-black hover:bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {SHORTCUTS.map((item) => (
            <div
              key={item.key}
              className="p-2 rounded bg-black border border-neutral-800 flex items-center justify-between gap-2 shadow-sm"
            >
              <span className="text-[11px] text-neutral-300 truncate">{item.description}</span>
              <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-white font-mono text-[10px] font-bold shrink-0 shadow-inner">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-neutral-800 text-center text-[10px] text-neutral-500">
          Press <kbd className="px-1.5 py-0.2 rounded bg-neutral-900 text-neutral-300 border border-neutral-700">ESC</kbd> or click outside to dismiss
        </div>
      </motion.div>
    </div>
  );
}
