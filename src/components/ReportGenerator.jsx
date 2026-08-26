import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Printer, 
  CheckCircle2, 
  Award
} from 'lucide-react';
import { PRESET_SAMPLES, SURVEY_STATS } from '../data/sonarSamples';

export default function ReportGenerator() {
  const [reportDate] = useState('2026-08-26');
  const [missionName] = useState('DeepScan-Alpha-Coastal-Survey-2026');
  const [surveyorOrg] = useState('National Institute of Oceanography (NIO) / Indian Coast Guard');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 print:hidden shadow-lg"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white font-mono">
              Maritime Marine Debris & Sonar Anomaly Incident Report
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated official survey dossier generator for port authorities, maritime defense, and environmental recovery taskforces.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-mono font-bold transition-all shadow-lg shadow-cyan-900/40"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </motion.button>
      </motion.div>

      {/* Report Document */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 24 }}
        className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl border border-slate-300 max-w-5xl mx-auto font-sans print:p-0 print:border-none print:shadow-none"
      >
        
        {/* Header Title Section */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-slate-900 text-cyan-400 px-2 py-0.5 rounded text-xs font-mono font-bold">
                SIH MISSION DOSSIER
              </span>
              <span className="text-xs font-mono text-slate-600 font-semibold">
                DOC-REF: NIO-AUV-2026-SSS-091
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
              Autonomous Underwater Marine Debris & Seabed Anomaly Survey Report
            </h1>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              High-Frequency Side-Scan Sonar (SSS) Acoustic Intelligence & Dual-Cue AI Detection
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-600">
            <p><strong>Date:</strong> {reportDate}</p>
            <p><strong>Mission ID:</strong> {missionName}</p>
            <p><strong>Authority:</strong> {surveyorOrg}</p>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="mb-8">
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
            1. Executive Mission Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { label: 'Surveyed Seabed Area', value: `${SURVEY_STATS.totalSweepAreaSqKm} km²`, bg: 'bg-slate-100 border-slate-300', textColor: 'text-slate-900' },
              { label: 'Total Acoustic Pings', value: SURVEY_STATS.totalPingsProcessed, bg: 'bg-slate-100 border-slate-300', textColor: 'text-slate-900' },
              { label: 'Critical Risk Hazards', value: `${SURVEY_STATS.criticalHazards} Units`, bg: 'bg-red-50 border-red-200', textColor: 'text-red-600' },
              { label: 'AI Model F1 Score', value: SURVEY_STATS.modelAccuracyF1, bg: 'bg-cyan-50 border-cyan-200', textColor: 'text-cyan-900' }
            ].map((stat) => (
              <div key={stat.label} className={`p-3 ${stat.bg} rounded-lg border`}>
                <span className="text-xs text-slate-500 font-mono block">{stat.label}</span>
                <span className={`text-xl font-black font-mono ${stat.textColor}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Debris Detection Breakdown */}
        <div className="mb-8">
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
            2. Verified Acoustic Target & Anomaly Inventory
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-300 font-mono">
              <thead className="bg-slate-900 text-slate-100 uppercase text-[10px]">
                <tr>
                  <th className="p-2 border border-slate-700">Target ID & Name</th>
                  <th className="p-2 border border-slate-700">Category</th>
                  <th className="p-2 border border-slate-700">Depth / Alt</th>
                  <th className="p-2 border border-slate-700">Est. 3D Height</th>
                  <th className="p-2 border border-slate-700">Coordinates</th>
                  <th className="p-2 border border-slate-700">Risk Score</th>
                  <th className="p-2 border border-slate-700">Cleanup Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {PRESET_SAMPLES.map((sample) => (
                  <tr key={sample.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2 font-bold text-slate-900">{sample.name}</td>
                    <td className="p-2 text-slate-600">{sample.category}</td>
                    <td className="p-2">{sample.depth}m / {sample.altitude}m</td>
                    <td className="p-2 font-bold text-blue-700">{sample.dimensions.estHeight}</td>
                    <td className="p-2 text-[10px] text-slate-600">{sample.coordinates.lat}°N, {sample.coordinates.lng}°E</td>
                    <td className="p-2">
                      <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                        sample.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sample.riskLevel} ({sample.riskScore})
                      </span>
                    </td>
                    <td className="p-2 text-[10px] text-slate-700 font-semibold">{sample.cleanPriority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Cleanup Recommendations */}
        <div className="mb-8">
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
            3. Recommended Intervention Logistics & Next Steps
          </h2>

          <ul className="space-y-2 text-xs text-slate-700 leading-relaxed list-disc list-inside">
            <li>
              <strong>Priority 0 (Emergency EOD & Industrial Repair):</strong> Immediate dispatch of naval clearance units for the Puducherry UXO site and emergency offshore dive teams for the Bombay High pipeline fault.
            </li>
            <li>
              <strong>Priority 1 (Hazardous Chemical & Ghost Net Retrieval):</strong> Deploy specialized ROV grapple vessels to retrieve synthetic ghost nets in Goa Shelf to safeguard breeding marine ecosystems.
            </li>
            <li>
              <strong>Priority 2 (Navigational Notices to Mariners):</strong> Issue immediate Notices to Mariners (NOTMAR) regarding the submerged 40ft container blocking deep-draft vessel approach in Mumbai Port.
            </li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="border-t-2 border-slate-900 pt-6 mt-10 grid grid-cols-2 gap-8 text-xs font-mono text-slate-800">
          <div>
            <p className="font-bold">AeroAqua DeepScan AI System Validator</p>
            <p className="text-slate-500 mt-0.5">Algorithm Version: v2.4.0 (SIH-2026 Production)</p>
            <div className="mt-6 border-b border-slate-400 w-48"></div>
            <p className="text-[10px] text-slate-500 mt-1">Autonomous Telemetry Verification Signature</p>
          </div>

          <div className="text-right">
            <p className="font-bold">Chief Hydrographic Survey Officer</p>
            <p className="text-slate-500 mt-0.5">Ministry of Ports, Shipping & Waterways</p>
            <div className="mt-6 border-b border-slate-400 w-48 ml-auto"></div>
            <p className="text-[10px] text-slate-500 mt-1">Authorized Clearance Officer</p>
          </div>
        </div>

      </motion.div>

    </div>
  );
}
