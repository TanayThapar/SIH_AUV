import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Zap, 
  Activity, 
  HardDrive, 
  Gauge, 
  Server, 
  Terminal, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.15 } }
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
      label: 'INFERENCE_LATENCY',
      value: `${activeBenchmark.latency} ms`,
      sub: 'Sub-20ms real-time throughput',
      icon: Activity
    },
    {
      label: 'INFERENCE_RATE',
      value: `${activeBenchmark.fps} FPS`,
      sub: 'Handles up to 50 Hz Sonar Pings',
      icon: Gauge
    },
    {
      label: 'POWER_CONSUMPTION',
      value: activeBenchmark.power,
      sub: 'AUV Battery life extended +4.2 hrs',
      icon: Zap
    },
    {
      label: 'EDGE_VRAM_FOOTPRINT',
      value: activeBenchmark.vram,
      sub: 'Fits Jetson Nano / Orin 4–8GB',
      icon: HardDrive
    }
  ];

  const ros2Nodes = [
    {
      topic: '1. /sonar/raw_acoustic_stream',
      node: 'Node: `sss_driver_node` (Parses .XTF / .JSF UDP pings)',
      stat: '25 Hz Ping'
    },
    {
      topic: '2. /sonar/preprocessed_imagery',
      node: 'Node: `dsp_correction_node` (Slant-range + Lee Despeckling)',
      stat: '4.2 ms Latency'
    },
    {
      topic: '3. /perception/detected_marine_debris',
      node: 'Node: `yolov11_tensorrt_node` (Dual Highlight-Shadow BBoxes)',
      stat: '14.8 ms Latency'
    },
    {
      topic: '4. /gis/georeferenced_hazard_map',
      node: 'Node: `ins_geotagger_node` (Fuses DVL/INS GPS coordinates)',
      stat: 'GeoJSON Out'
    }
  ];

  return (
    <div className="space-y-4 font-mono">
      
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black border border-neutral-800 rounded p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xl"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-neutral-900 border border-neutral-700 text-white">
              <Cpu className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-white">
              &gt; EDGE_HARDWARE_&amp;_EMBEDDED_TELEMETRY
            </h2>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-900 text-white border border-neutral-700 font-bold">
              [TENSORRT_INT8]
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Real-time embedded performance on NVIDIA Jetson Orin payload with TensorRT acceleration and ROS2 perception node integration.
          </p>
        </div>

        {/* Quantization Switcher */}
        <div className="flex items-center bg-black p-0.5 rounded border border-neutral-800 text-[11px]">
          {[
            { key: 'fp32', label: 'PyTorch FP32' },
            { key: 'fp16', label: 'ONNX FP16' },
            { key: 'tensorrt_int8', label: 'TensorRT INT8 ⚡' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPrecisionMode(key)}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold ${
                precisionMode === key
                  ? 'bg-white text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              [{label}]
            </button>
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
          return (
            <div
              key={card.label}
              className="bg-black border border-neutral-800 rounded p-3.5 space-y-1 shadow-md"
            >
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span className="text-[10px]">[{card.label}]</span>
                <div className="p-1 rounded bg-neutral-900 border border-neutral-700 text-white">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={card.value}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="text-xl font-bold text-white"
                >
                  {card.value}
                </motion.p>
              </AnimatePresence>
              <span className="text-[10px] text-neutral-400 block">&gt; {card.sub}</span>
            </div>
          );
        })}
      </motion.div>

      {/* ROS2 & Edge System Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ROS2 Nodes Graph (7 Cols) */}
        <div className="lg:col-span-7 bg-black border border-neutral-800 rounded p-3.5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-white" />
              <h3 className="text-xs font-bold text-white">&gt; AUV_ROS2_NODE_ARCHITECTURE</h3>
            </div>
            <span className="text-[9px] text-neutral-400 bg-neutral-900 px-1.5 py-0.2 rounded border border-neutral-700">
              [ROS2_HUMBLE_ACTIVE]
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {ros2Nodes.map((node, i) => (
              <React.Fragment key={node.topic}>
                <div
                  className="p-2.5 bg-neutral-950 rounded border border-neutral-800 flex items-center justify-between shadow-sm"
                >
                  <div>
                    <span className="text-white font-bold block text-xs">{node.topic}</span>
                    <span className="text-[10px] text-neutral-400">{node.node}</span>
                  </div>
                  <span className="text-[10px] text-white font-bold shrink-0 ml-2 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700">[{node.stat}]</span>
                </div>

                {i < ros2Nodes.length - 1 && (
                  <div className="flex justify-center text-neutral-600">
                    <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Hardware Specs & Onboard Configuration (5 Cols) */}
        <div className="lg:col-span-5 bg-black border border-neutral-800 rounded p-3.5 space-y-3 shadow-xl font-mono">
          <div className="flex items-center gap-1.5 border-b border-neutral-800 pb-2">
            <Terminal className="w-3.5 h-3.5 text-white" />
            <h3 className="text-xs font-bold text-white">&gt; HARDWARE_DEPLOYMENT_SPEC</h3>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {[
              { label: 'TARGET_EDGE_PROCESSOR', value: 'NVIDIA Jetson Orin Nano / AGX Orin' },
              { label: 'AI_INFERENCE_ENGINE', value: 'TensorRT 10.x with INT8 Calibration Cache' },
              { label: 'TELEMETRY_SYNC', value: 'DVL + INS (Inertial Nav) + GPS Surface Sync' },
              { label: 'PAYLOAD_INTERFACE', value: 'Gigabit Ethernet / RS-485 Sonar Port' }
            ].map((spec) => (
              <div
                key={spec.label}
                className="bg-neutral-950 p-2 rounded border border-neutral-800"
              >
                <span className="text-neutral-500 text-[9px] block">[{spec.label}]</span>
                <span className="font-bold text-white">{spec.value}</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded flex items-start gap-2 text-[11px] text-neutral-300">
            <ShieldCheck className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <span>Autonomous underwater operation on commercial AUVs (Bluefin, Iver4, Remus 100).</span>
          </div>
        </div>

      </div>

    </div>
  );
}
