import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Zap, 
  Activity, 
  HardDrive, 
  Gauge, 
  Layers, 
  CheckCircle2, 
  Server, 
  Terminal, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { SURVEY_STATS } from '../data/sonarSamples';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function EdgeMetricsView() {
  const [precisionMode, setPrecisionMode] = useState('tensorrt_int8');

  const BENCHMARKS = {
    fp32: {
      name: 'PyTorch Native (FP32)',
      latency: 48.2,
      fps: 20.7,
      vram: '2.4 GB',
      power: '32.5 W',
      mapDrop: '0.0% (Baseline)'
    },
    fp16: {
      name: 'ONNX Runtime (FP16)',
      latency: 22.4,
      fps: 44.6,
      vram: '1.2 GB',
      power: '19.8 W',
      mapDrop: '-0.2% mAP'
    },
    tensorrt_int8: {
      name: 'NVIDIA TensorRT (INT8 Quantized)',
      latency: 14.8,
      fps: 67.5,
      vram: '640 MB',
      power: '14.2 W',
      mapDrop: '-0.5% mAP (Recommended)'
    }
  };

  const activeBenchmark = BENCHMARKS[precisionMode];

  const telemetryCards = [
    {
      label: 'Inference Latency',
      value: `${activeBenchmark.latency} ms`,
      sub: 'Sub-20ms real-time throughput',
      icon: Activity,
      color: 'cyan'
    },
    {
      label: 'Inference Rate',
      value: `${activeBenchmark.fps} FPS`,
      sub: 'Handles up to 50 Hz Sonar Pings',
      icon: Gauge,
      color: 'emerald'
    },
    {
      label: 'Power Consumption',
      value: activeBenchmark.power,
      sub: 'AUV Battery life extended +4.2 hrs',
      icon: Zap,
      color: 'amber'
    },
    {
      label: 'Edge VRAM Footprint',
      value: activeBenchmark.vram,
      sub: 'Fits Jetson Nano / Orin 4–8GB',
      icon: HardDrive,
      color: 'blue'
    }
  ];

  const colorMap = {
    cyan: {
      wrapper: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      text: 'text-cyan-400'
    },
    emerald: {
      wrapper: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      text: 'text-emerald-400'
    },
    amber: {
      wrapper: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      text: 'text-amber-400'
    },
    blue: {
      wrapper: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      text: 'text-blue-400'
    }
  };

  const ros2Nodes = [
    {
      topic: '1. /sonar/raw_acoustic_stream',
      node: 'Node: `sss_driver_node` (Parses .XTF / .JSF UDP pings)',
      stat: '25 Hz Ping',
      color: 'cyan'
    },
    {
      topic: '2. /sonar/preprocessed_imagery',
      node: 'Node: `dsp_correction_node` (Slant-range + Lee Despeckling)',
      stat: '4.2 ms Latency',
      color: 'amber'
    },
    {
      topic: '3. /perception/detected_marine_debris',
      node: 'Node: `yolov8_tensorrt_node` (Dual Highlight-Shadow BBoxes)',
      stat: '14.8 ms Latency',
      color: 'emerald'
    },
    {
      topic: '4. /gis/georeferenced_hazard_map',
      node: 'Node: `ins_geotagger_node` (Fuses DVL/INS GPS coordinates)',
      stat: 'GeoJSON Out',
      color: 'blue'
    }
  ];

  const borderColorMap = {
    cyan: 'border-cyan-500/30',
    amber: 'border-amber-500/30',
    emerald: 'border-emerald-500/30',
    blue: 'border-blue-500/30'
  };

  const textColorMap = {
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
    emerald: 'text-emerald-400',
    blue: 'text-blue-400'
  };

  const statColorMap = {
    cyan: 'text-emerald-400',
    amber: 'text-cyan-300',
    emerald: 'text-emerald-300',
    blue: 'text-slate-300'
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shadow-lg"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Cpu className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white font-mono">
              Edge Hardware & AUV On-Board Deployment Telemetry
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
              EDGE COMPATIBLE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time embedded performance on NVIDIA Jetson Orin AUV payload with TensorRT acceleration and ROS2 integration.
          </p>
        </div>

        {/* Quantization Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          {[
            { key: 'fp32', label: 'PyTorch FP32' },
            { key: 'fp16', label: 'ONNX FP16' },
            { key: 'tensorrt_int8', label: 'TensorRT INT8 ⚡' }
          ].map(({ key, label }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPrecisionMode(key)}
              className={`px-3 py-1.5 rounded transition-all relative ${
                precisionMode === key
                  ? 'text-cyan-300 font-bold'
                  : 'text-slate-400'
              }`}
            >
              {precisionMode === key && (
                <motion.div
                  layoutId="benchmarkPill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className={`absolute inset-0 rounded ${
                    key === 'tensorrt_int8'
                      ? 'bg-emerald-500/20 border border-emerald-400/50'
                      : 'bg-cyan-500/20 border border-cyan-400/50'
                  }`}
                />
              )}
              <span className="relative z-10">{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Live Edge Telemetry Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono"
      >
        {telemetryCards.map((card) => {
          const Icon = card.icon;
          const c = colorMap[card.color];
          return (
            <motion.div
              key={card.label}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -2 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow-md"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>{card.label}</span>
                <div className={`p-1.5 rounded-lg border ${c.wrapper}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={card.value}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className={`text-2xl font-extrabold ${c.text}`}
                >
                  {card.value}
                </motion.p>
              </AnimatePresence>
              <span className="text-[10px] text-emerald-400 block">{card.sub}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ROS2 & Edge System Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ROS2 Nodes Graph (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-mono">AUV ROS2 Node Architecture</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              ros2_underwater_perception
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {ros2Nodes.map((node, i) => (
              <React.Fragment key={node.topic}>
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 280, damping: 24 }}
                  whileHover={{ scale: 1.01 }}
                  className={`p-3 bg-slate-950 rounded-lg border ${borderColorMap[node.color]} flex items-center justify-between shadow-sm`}
                >
                  <div>
                    <span className={`${textColorMap[node.color]} font-bold block`}>{node.topic}</span>
                    <span className="text-[10px] text-slate-400">{node.node}</span>
                  </div>
                  <span className={`text-[10px] ${statColorMap[node.color]} font-bold shrink-0 ml-2`}>{node.stat}</span>
                </motion.div>

                {i < ros2Nodes.length - 1 && (
                  <div className="flex justify-center text-slate-600">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Hardware Specs & Onboard Configuration (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono">Edge Hardware Deployment Spec</h3>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {[
              { label: 'Target Edge Processor', value: 'NVIDIA Jetson Orin Nano / AGX Orin', highlight: false },
              { label: 'AI Inference Engine', value: 'TensorRT 10.x with INT8 Calibration Cache', highlight: true },
              { label: 'Telemetry Synchronization', value: 'DVL + INS (Inertial Nav) + GPS Surface Sync', highlight: false },
              { label: 'Payload Interface', value: 'Gigabit Ethernet / RS-485 Sonar Port', highlight: false }
            ].map((spec, i) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 280, damping: 24 }}
                className="bg-slate-950 p-2.5 rounded-lg border border-slate-800"
              >
                <span className="text-slate-500 text-[10px] block">{spec.label}</span>
                <span className={`font-bold ${spec.highlight ? 'text-cyan-400' : 'text-white'}`}>{spec.value}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg flex items-start gap-2 text-xs font-mono text-emerald-300"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Ready for autonomous operation on commercial AUVs (Bluefin, Iver4, Remus 100).</span>
          </motion.div>
        </div>

      </div>

    </div>
  );
}
