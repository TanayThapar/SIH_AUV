import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import LiveWaterfallView from './components/LiveWaterfallView';
import AnalysisStudio from './components/AnalysisStudio';
import GeospatialMapView from './components/GeospatialMapView';
import SyntheticStudio from './components/SyntheticStudio';
import EdgeMetricsView from './components/EdgeMetricsView';
import ReportGenerator from './components/ReportGenerator';
import SihPitchGuide from './components/SihPitchGuide';
import InitialLoadingScreen from './components/InitialLoadingScreen';
import { PRESET_SAMPLES } from './data/sonarSamples';
import { Radar, Award, RefreshCw } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function DashboardContent() {
  const { currentTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('waterfall');
  const [selectedSample, setSelectedSample] = useState(PRESET_SAMPLES[0]);

  const handleSelectSampleForStudio = (sample) => {
    setSelectedSample(sample);
    setActiveTab('analysis');
  };

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
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
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
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Footer with Terminal Status Bar */}
      <footer className="bg-black border-t border-neutral-800 py-3 px-4 text-xs font-mono text-neutral-400 relative z-10 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-neutral-300">
            <div className={`p-1 rounded border ${currentTheme.navLogoBox} transition-colors duration-300`}>
              <Radar className={`w-3.5 h-3.5 ${currentTheme.navLogoText}`} />
            </div>
            <span className="font-bold text-white tracking-wider">&gt; AEROAQUA_DEEPSCAN_AI</span>
            <span className="text-neutral-600">|</span>
            <span className="text-[11px] text-neutral-400">SIH_2026_AUV_SUITE</span>
          </div>

          <div className="flex items-center gap-3 text-neutral-400">
            <button
              onClick={() => setIsLoading(true)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black hover:bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px]"
              title="Replay System Boot Diagnostics"
            >
              <RefreshCw className="w-3 h-3" />
              <span>[REBOOT_TTY]</span>
            </button>
            <span className="hidden sm:inline text-neutral-500">[NODE: ACTIVE]</span>
            <div className={`px-2 py-0.5 rounded border ${currentTheme.navBadge} flex items-center gap-1 text-[11px] font-bold`}>
              <Award className="w-3 h-3 text-amber-400" />
              <span>[CANDIDATE_2026]</span>
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

