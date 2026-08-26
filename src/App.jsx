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

export default function App() {
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
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Initial Animated Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <InitialLoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Background Animated Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -40, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 -right-32 w-[30rem] h-[30rem] bg-blue-600/15 rounded-full blur-[120px]"
        />
      </div>

      {/* Top Main Navigation */}
      <div className="relative z-50">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content Viewport with Motion Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
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

      {/* Bottom Footer with Motion hover states */}
      <footer className="bg-slate-950/90 border-t border-slate-900 py-5 px-4 text-xs font-mono text-slate-500 relative z-10 print:hidden backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-slate-400">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="p-1 rounded bg-cyan-950 border border-cyan-800/40 text-cyan-400"
            >
              <Radar className="w-3.5 h-3.5" />
            </motion.div>
            <span className="font-bold text-slate-200">AeroAqua DeepScan AI</span>
            <span className="text-slate-600">•</span>
            <span>Smart India Hackathon (SIH) 2026</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsLoading(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
              title="Replay System Boot Diagnostics"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reboot Diagnostics</span>
            </button>
            <span className="hidden sm:inline">AI Sonar Debris System</span>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 flex items-center gap-1.5 font-bold"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>SIH Candidate</span>
            </motion.div>
          </div>
        </div>
      </footer>

    </div>
  );
}
