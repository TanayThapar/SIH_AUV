import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Printer } from 'lucide-react';
import { PRESET_SAMPLES, SURVEY_STATS } from '../data/sonarSamples';

export default function ReportGenerator() {
  const [reportDate] = useState('2026-08-26');
  const [missionName] = useState('DeepScan-Alpha-Coastal-Survey-2026');
  const [surveyorOrg] = useState('National Institute of Oceanography (NIO) / Indian Coast Guard');

  const handlePrint = () => { window.print(); };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black border border-neutral-800 rounded p-3.5 flex flex-wrap items-center justify-between gap-3 print:hidden shadow-xl font-mono"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-neutral-900 border border-neutral-700 text-white">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-white font-mono">
              &gt; MARITIME_DEBRIS_INCIDENT_REPORT
            </h2>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5 font-mono">
            Automated official survey dossier generator for port authorities, maritime defense, and environmental recovery taskforces.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-white text-white hover:text-black border border-neutral-700 hover:border-white rounded text-xs font-mono font-bold transition-all cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>[ PRINT / SAVE_PDF ]</span>
        </motion.button>
      </motion.div>

      {/* Report Document */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 24 }}
        className="bg-neutral-950 text-neutral-100 p-8 sm:p-12 rounded border border-neutral-700 max-w-5xl mx-auto font-mono print:p-0 print:border-none print:shadow-none shadow-2xl"
      >
        {/* Header */}
        <div className="border-b-2 border-neutral-600 pb-6 mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white text-black px-2 py-0.5 rounded text-xs font-mono font-bold">SIH MISSION DOSSIER</span>
              <span className="text-xs font-mono text-neutral-500 font-semibold">DOC-REF: NIO-AUV-2026-SSS-091</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">
              Autonomous Underwater Marine Debris &amp; Seabed Anomaly Survey Report
            </h1>
            <p className="text-sm text-neutral-400 mt-1 font-medium">
              High-Frequency Side-Scan Sonar (SSS) Acoustic Intelligence &amp; Dual-Cue AI Detection
            </p>
          </div>
          <div className="text-right text-xs font-mono text-neutral-400">
            <p><strong className="text-white">Date:</strong> {reportDate}</p>
            <p><strong className="text-white">Mission ID:</strong> {missionName}</p>
            <p><strong className="text-white">Authority:</strong> {surveyorOrg}</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8">
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white border-b border-neutral-700 pb-1 mb-3">
            1. Executive Mission Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { label: 'Surveyed Seabed Area', value: `${SURVEY_STATS.totalSweepAreaSqKm} km²` },
              { label: 'Total Acoustic Pings', value: SURVEY_STATS.totalPingsProcessed },
              { label: 'Critical Risk Hazards', value: `${SURVEY_STATS.criticalHazards} Units` },
              { label: 'AI Model F1 Score', value: SURVEY_STATS.modelAccuracyF1 }
            ].map((stat) => (
              <div key={stat.label} className="p-3 bg-black border border-neutral-800 rounded">
                <span className="text-xs text-neutral-500 font-mono block">{stat.label}</span>
                <span className="text-xl font-black font-mono text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly Inventory Table */}
        <div className="mb-8">
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white border-b border-neutral-700 pb-1 mb-3">
            2. Verified Acoustic Target &amp; Anomaly Inventory
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-neutral-700 font-mono">
              <thead className="bg-white text-black uppercase text-[10px]">
                <tr>
                  <th className="p-2 border border-neutral-400">Target ID &amp; Name</th>
                  <th className="p-2 border border-neutral-400">Category</th>
                  <th className="p-2 border border-neutral-400">Depth / Alt</th>
                  <th className="p-2 border border-neutral-400">Est. 3D Height</th>
                  <th className="p-2 border border-neutral-400">Coordinates</th>
                  <th className="p-2 border border-neutral-400">Risk Score</th>
                  <th className="p-2 border border-neutral-400">Cleanup Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {PRESET_SAMPLES.map((sample) => (
                  <tr key={sample.id} className="hover:bg-neutral-900 transition-colors">
                    <td className="p-2 font-bold text-white">{sample.name}</td>
                    <td className="p-2 text-neutral-400">{sample.category}</td>
                    <td className="p-2 text-neutral-300">{sample.depth}m / {sample.altitude}m</td>
                    <td className="p-2 font-bold text-white">{sample.dimensions.estHeight}</td>
                    <td className="p-2 text-[10px] text-neutral-400">{sample.coordinates.lat}°N, {sample.coordinates.lng}°E</td>
                    <td className="p-2">
                      <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-neutral-800 text-white border border-neutral-600">
                        {sample.riskLevel} ({sample.riskScore})
                      </span>
                    </td>
                    <td className="p-2 text-[10px] text-neutral-300 font-semibold">{sample.cleanPriority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white border-b border-neutral-700 pb-1 mb-3">
            3. Recommended Intervention Logistics &amp; Next Steps
          </h2>
          <ul className="space-y-2 text-xs text-neutral-300 leading-relaxed list-disc list-inside">
            <li><strong className="text-white">Priority 0 (Emergency EOD &amp; Industrial Repair):</strong> Immediate dispatch of naval clearance units for the Puducherry UXO site and emergency offshore dive teams for the Bombay High pipeline fault.</li>
            <li><strong className="text-white">Priority 1 (Hazardous Chemical &amp; Ghost Net Retrieval):</strong> Deploy specialized ROV grapple vessels to retrieve synthetic ghost nets in Goa Shelf to safeguard breeding marine ecosystems.</li>
            <li><strong className="text-white">Priority 2 (Navigational Notices to Mariners):</strong> Issue immediate Notices to Mariners (NOTMAR) regarding the submerged 40ft container blocking deep-draft vessel approach in Mumbai Port.</li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="border-t-2 border-neutral-600 pt-6 mt-10 grid grid-cols-2 gap-8 text-xs font-mono text-neutral-300">
          <div>
            <p className="font-bold text-white">AeroAqua DeepScan AI System Validator</p>
            <p className="text-neutral-500 mt-0.5">Algorithm Version: v2.4.0 (SIH-2026 Production)</p>
            <div className="mt-6 border-b border-neutral-600 w-48"></div>
            <p className="text-[10px] text-neutral-500 mt-1">Autonomous Telemetry Verification Signature</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-white">Chief Hydrographic Survey Officer</p>
            <p className="text-neutral-500 mt-0.5">Ministry of Ports, Shipping &amp; Waterways</p>
            <div className="mt-6 border-b border-neutral-600 w-48 ml-auto"></div>
            <p className="text-[10px] text-neutral-500 mt-1">Authorized Clearance Officer</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
