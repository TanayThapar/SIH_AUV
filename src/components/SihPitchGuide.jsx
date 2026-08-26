import React from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  TrendingUp, 
  Target, 
  Award,
  Globe,
  Radio,
  FileCheck2
} from 'lucide-react';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } }
};

export default function SihPitchGuide() {
  return (
    <div className="space-y-6">
      
      {/* Pitch Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/80 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden"
      >
        <div className="max-w-3xl space-y-3 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs font-bold"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>SMART INDIA HACKATHON (SIH) 2026 • OFFICIAL PROJECT PROPOSAL</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 20 }}
            className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight leading-tight"
          >
            AI-Powered Automated Underwater Marine Debris & Anomaly Detection System using Side-Scan Sonar (SSS)
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-sm sm:text-base text-slate-300 leading-relaxed"
          >
            An edge-deployable, dual-branch deep learning and acoustic ray-tracing platform that transforms raw Side-Scan Sonar pings into real-time 3D debris detections, unsupervised anomaly heatmaps, and actionable maritime intelligence.
          </motion.p>
        </div>

        {/* Animated Sonar Rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="hidden lg:block absolute -right-12 -bottom-12 border border-cyan-500/10 rounded-full pointer-events-none"
            style={{ width: i * 90, height: i * 90, right: -i * 20, bottom: -i * 20 }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.15, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
        ))}
      </motion.div>

      {/* 3 Core Pain Points vs Our Solutions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            badge: 'PAIN POINT 1: OPTICAL BLINDNESS',
            badgeColor: 'text-red-400',
            dot: 'bg-red-400',
            title: 'Underwater Turbidity & Darkness',
            body: 'Optical RGB cameras fail past 20m depth due to light attenuation, backscatter turbidity, and lack of ambient illumination.',
            solution: 'Our Solution: High-frequency acoustic backscatter (100–900 kHz) penetrating murky water at 300m swath.',
            solutionColor: 'text-cyan-300'
          },
          {
            badge: 'PAIN POINT 2: DATA SCARCITY',
            badgeColor: 'text-amber-400',
            dot: 'bg-amber-400',
            title: 'Lack of Labeled Sonar Debris Data',
            body: 'Real side-scan sonar datasets with labeled marine debris are notoriously scarce and expensive to acquire via sea trials.',
            solution: 'Our Solution: CycleGAN + Acoustic Ray-Tracing physics generator boosting dataset size by 75x (+26.4% mAP).',
            solutionColor: 'text-emerald-300'
          },
          {
            badge: 'PAIN POINT 3: MANUAL BOTTLENECK',
            badgeColor: 'text-cyan-400',
            dot: 'bg-cyan-400',
            title: 'Slow Post-Mission Hydrography',
            body: 'Standard surveys require human hydrographers to manually review hundreds of gigabytes of .XTF recordings days after the dive.',
            solution: 'Our Solution: Real-time on-board TensorRT inference (14.8 ms latency) with instant GIS geotagging.',
            solutionColor: 'text-amber-300'
          }
        ].map((item) => (
          <motion.div
            key={item.badge}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2.5 shadow-md"
          >
            <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${item.badgeColor}`}>
              <span className={`w-2 h-2 rounded-full ${item.dot}`}></span>
              {item.badge}
            </span>
            <h3 className="text-base font-bold text-white font-mono">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{item.body}</p>
            <div className={`pt-2 border-t border-slate-800 text-xs font-mono ${item.solutionColor}`}>
              <strong>{item.solution}</strong>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Comparison Matrix Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 240, damping: 22 }}
        className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono">
              Competitive Advantage & Innovation Matrix
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            100% Autonomous Edge-Ready
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-800 font-mono">
            <thead className="bg-slate-950 text-slate-300 uppercase text-[10px]">
              <tr>
                <th className="p-3 border border-slate-800">Feature Dimension</th>
                <th className="p-3 border border-slate-800 text-slate-400">Manual Hydrographic Review</th>
                <th className="p-3 border border-slate-800 text-slate-400">Standard Optical AI (YOLO)</th>
                <th className="p-3 border border-slate-800 text-cyan-400 bg-cyan-950/40">AeroAqua DeepScan (Our System)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                ['Detection Latency', 'Days to Weeks (Post-Dive)', 'Real-time (Optical only)', '14.8 ms Real-time (Acoustic Stream)'],
                ['Operational Depth & Turbidity', 'Deep (Acoustic)', 'Shallow (<15m) & Clear waters only', 'All depths (0 – 6,000m) & Zero visibility'],
                ['3D Height Estimation', 'Manual ruler measurement', 'None (2D bounding boxes only)', 'Automated Acoustic Shadow Ray Math'],
                ['Unseen Anomaly Detection', 'Human subjective judgement', 'Fails on unclassified debris', 'PatchCore Unsupervised Anomaly Engine'],
                ['Edge Deployment (AUV/ROV)', 'N/A (Offline Workstation)', 'Heavy GPU required', 'TensorRT INT8 for Jetson Orin (14.2W)']
              ].map(([feature, manual, optical, ours]) => (
                <motion.tr
                  key={feature}
                  whileHover={{ backgroundColor: 'rgba(6, 182, 212, 0.04)' }}
                  className="transition-colors"
                >
                  <td className="p-3 font-bold text-white">{feature}</td>
                  <td className="p-3 text-red-400">{manual}</td>
                  <td className="p-3 text-amber-400">{optical}</td>
                  <td className="p-3 text-emerald-400 font-bold bg-cyan-950/20">{ours}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Target Beneficiaries & National Impact */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 240, damping: 22 }}
        className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl"
      >
        <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-400" />
          Alignment with National Missions & Key Stakeholders
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {[
            { color: 'text-cyan-400', title: '1. Swachh Sagar Abhiyan', body: 'Targeted removal of ghost nets and plastic accumulations in coastal breeding sanctuaries.' },
            { color: 'text-amber-400', title: '2. Indian Navy & Coast Guard', body: 'Rapid harbor clearance, unexploded ordnance (UXO) detection, and submarine navigation safety.' },
            { color: 'text-emerald-400', title: '3. Major Port Trusts', body: 'Real-time fairway channel sweeping for sunken containers and navigational hazards.' },
            { color: 'text-purple-400', title: '4. Offshore Energy (ONGC)', body: 'Autonomous subsea pipeline inspection and scour fault anomaly alarming.' }
          ].map((card) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -4, scale: 1.03 }}
              className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 shadow-sm cursor-default"
            >
              <span className={`${card.color} font-bold block`}>{card.title}</span>
              <p className="text-slate-400 text-[11px]">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
