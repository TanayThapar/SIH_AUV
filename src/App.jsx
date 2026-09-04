import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import LiveWaterfallView from './components/LiveWaterfallView';
import AnalysisStudio from './components/AnalysisStudio';
import GeospatialMapView from './components/GeospatialMapView';
import SyntheticStudio from './components/SyntheticStudio';
import EdgeMetricsView from './components/EdgeMetricsView';
import ReportGenerator from './components/ReportGenerator';
import SihPitchGuide from './components/SihPitchGuide';
import HardwareSimulatorView from './components/HardwareSimulatorView';
import InitialLoadingScreen from './components/InitialLoadingScreen';
import JudgeTourModal from './components/JudgeTourModal';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import { PRESET_SAMPLES } from './data/sonarSamples';
import { Radar, Award, RefreshCw, Zap, Keyboard } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function DashboardContent() {
  const { currentTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('waterfall');
  const [selectedSample, setSelectedSample] = useState(PRESET_SAMPLES[0]);
  
  // Modals
  const [isJudgeTourOpen, setIsJudgeTourOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [shortcutToast, setShortcutToast] = useState(null);

  const handleSelectSampleForStudio = (sample) => {
    setSelectedSample(sample);
    setActiveTab('analysis');
  };

  const showToast = (msg) => {
    setShortcutToast(msg);
    setTimeout(() => {
      setShortcutToast((prev) => (prev === msg ? null : prev));
    }, 1800);
  };

  // Global Keyboard Navigation
  const handleKeyDown = useCallback((e) => {
    // Ignore input typing
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

    if (e.key === '1') {
      setActiveTab('waterfall');
      showToast('Hotkey [1]: Live Waterfall');
    } else if (e.key === '2') {
      setActiveTab('analysis');
      showToast('Hotkey [2]: Acoustic Studio');
    } else if (e.key === '3') {
      setActiveTab('map');
      showToast('Hotkey [3]: Geospatial Map');
    } else if (e.key === '4') {
      setActiveTab('synthetic');
      showToast('Hotkey [4]: GAN Synthesizer');
    } else if (e.key === '5') {
      setActiveTab('edge');
      showToast('Hotkey [5]: Edge Telemetry');
    } else if (e.key === '6') {
      setActiveTab('report');
      showToast('Hotkey [6]: Mission Report');
    } else if (e.key === '7') {
      setActiveTab('pitch');
      showToast('Hotkey [7]: SIH Pitch');
    } else if (e.key === '8') {
      setActiveTab('hardware');
      showToast('Hotkey [8]: HW Simulator');
    } else if (e.key === 'j' || e.key === 'J') {
      setIsJudgeTourOpen((prev) => !prev);
    } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      setIsShortcutsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsJudgeTourOpen(false);
      setIsShortcutsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const pageVariants = {
    initial: { opacity: 0, y: 12, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] } },
    exit: { opacity: 0, y: -12, scale: 0.99, transition: { duration: 0.18, ease: 'easeIn' } }
  };

  return (
    <div 
      className="min-h-screen bg-[#050505] text-neutral-100 flex flex-col font-mono relative overflow-x-hidden transition-colors duration-500"
      style={{ backgroundImage: currentTheme.bgRadial }}
    >
      
      {/* CRT Scanline Overlay Texture */}
      <div className="fixed inset-0 crt-overlay z-40 pointer-events-none opacity-40" />

      {/* Initial Animated Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <InitialLoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* 60-Second Judge Tour Modal */}
      <AnimatePresence>
        {isJudgeTourOpen && (
          <JudgeTourModal
            isOpen={isJudgeTourOpen}
            onClose={() => setIsJudgeTourOpen(false)}
            onNavigateTab={setActiveTab}
            activeTab={activeTab}
          />
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {isShortcutsOpen && (
          <KeyboardShortcutsModal
            isOpen={isShortcutsOpen}
            onClose={() => setIsShortcutsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Hotkey Toast Notification Banner */}
      <AnimatePresence>
        {shortcutToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-14 right-6 z-50 bg-black border border-neutral-600 text-white px-3 py-1.5 rounded shadow-2xl text-xs font-mono flex items-center gap-2"
          >
            <Keyboard className="w-3.5 h-3.5 text-white" />
            <span>{shortcutToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Background Animated Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute -top-32 -left-32 w-96 h-96 ${currentTheme.ambient1} rounded-full blur-[100px] transition-colors duration-500`}
        />
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.15, 0.08],
            x: [0, -40, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-1/2 -right-32 w-[30rem] h-[30rem] ${currentTheme.ambient2} rounded-full blur-[120px] transition-colors duration-500`}
        />
      </div>

      {/* Top Main Navigation */}
      <div className="relative z-50">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenJudgeTour={() => setIsJudgeTourOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />
      </div>

      {/* Main Content Viewport with Motion Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 relative z-10 font-mono">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            {activeTab === 'waterfall' && (
              <LiveWaterfallView onSelectSampleForStudio={handleSelectSampleForStudio} />
            )}

            {activeTab === 'analysis' && (
              <AnalysisStudio
                selectedSample={selectedSample}
                setSelectedSample={setSelectedSample}
              />
            )}

            {activeTab === 'map' && (
              <GeospatialMapView onSelectSampleForStudio={handleSelectSampleForStudio} />
            )}

            {activeTab === 'synthetic' && (
              <SyntheticStudio />
            )}

            {activeTab === 'edge' && (
              <EdgeMetricsView />
            )}

            {activeTab === 'report' && (
              <ReportGenerator />
            )}

            {activeTab === 'pitch' && (
              <SihPitchGuide />
            )}

            {activeTab === 'hardware' && (
              <HardwareSimulatorView />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Footer */}
      <footer className="bg-black/90 border-t border-neutral-800 py-3 px-4 text-xs font-mono text-neutral-400 relative z-10 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-neutral-300">
            <div className="p-1 rounded-md bg-neutral-900 border border-neutral-700 text-white">
              <Radar className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-wider font-mono">AeroAqua DeepScan AI</span>
            <span className="text-neutral-600">•</span>
            <span className="text-[11px] text-neutral-400">Autonomous Underwater Sonar Analytics (SIH 2026)</span>
          </div>

          <div className="flex items-center gap-3 text-neutral-400">
            <button
              onClick={() => setIsJudgeTourOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white transition-colors cursor-pointer text-[11px] font-bold"
              title="Launch 60s Tour (Key: J)"
            >
              <Zap className="w-3 h-3 text-white" />
              <span>[60s Jury Tour]</span>
            </button>

            <button
              onClick={() => setIsLoading(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px]"
              title="Replay System Boot Diagnostics"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reboot Diagnostics</span>
            </button>
            <span className="hidden sm:inline text-neutral-500">Node: Active</span>
            <div className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-200 flex items-center gap-1 text-[11px] font-bold">
              <Award className="w-3.5 h-3.5 text-white" />
              <span>SIH 2026 Production</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
}
