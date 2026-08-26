// Presets of Side-Scan Sonar Datasets with realistic acoustic properties

export const SONAR_PALETTES = {
  copper: {
    name: 'Sonar Copper / Amber',
    bg: '#140c02',
    accent: '#f59e0b',
    cssFilter: 'sepia(90%) hue-rotate(-20deg) saturate(220%) brightness(90%) contrast(120%)'
  },
  emerald: {
    name: 'Deep Oceanic Emerald',
    bg: '#021814',
    accent: '#10b981',
    cssFilter: 'sepia(80%) hue-rotate(110deg) saturate(180%) brightness(85%) contrast(115%)'
  },
  cyan: {
    name: 'Acoustic Blue / Cyan',
    bg: '#041527',
    accent: '#00f0ff',
    cssFilter: 'sepia(80%) hue-rotate(160deg) saturate(200%) brightness(95%) contrast(125%)'
  },
  grayscale: {
    name: 'Acoustic Raw Grayscale',
    bg: '#0a0a0a',
    accent: '#e2e8f0',
    cssFilter: 'grayscale(100%) brightness(100%) contrast(130%)'
  }
};

export const PRESET_SAMPLES = [
  {
    id: 'ghost-net-01',
    name: 'Abandoned Ghost Fishing Net',
    category: 'Ghost Netting / Polypropylene',
    riskLevel: 'CRITICAL',
    riskScore: 94,
    depth: 42.5,
    altitude: 12.0, // AUV altitude above seafloor in meters
    coordinates: { lat: 15.2993, lng: 73.7844, location: 'Goa Coastal Waters (Shelf)' },
    description: 'Tangled synthetic gillnet snagged on rocky outcrop. High hazard for endangered marine life and propeller entanglement.',
    dimensions: { length: '18.4 m', width: '6.2 m', estHeight: '2.3 m' },
    slantRange: 24.8, // meters
    shadowLength: 5.6, // meters
    anomalyConfidence: 0.962,
    cleanPriority: 'P1 - Immediate Extraction',
    timestamp: '2026-08-25T14:22:10Z',
    detections: [
      {
        id: 'det-1',
        label: 'Ghost Net Cluster',
        confidence: 0.96,
        type: 'debris',
        box: { x: 38, y: 32, w: 32, h: 26 }, // percentage coordinates
        highlight: { x: 40, y: 34, w: 28, h: 10 },
        shadow: { x: 40, y: 44, w: 28, h: 14 },
        estHeight: '2.3 m',
        material: 'Nylon / Monofilament polymer',
        acousticReflectivity: 'Diffuse High Scatter'
      }
    ],
    anomalyZones: [
      { x: 35, y: 28, radius: 45, intensity: 0.92 }
    ],
    sonarParams: {
      frequency: '450 kHz',
      pingRate: '15 Hz',
      swathWidth: '100 m',
      soundSpeed: '1500 m/s'
    }
  },
  {
    id: 'shipping-container-02',
    name: 'Submerged 40ft ISO Container',
    category: 'Lost Cargo / Structural Debris',
    riskLevel: 'HIGH',
    riskScore: 88,
    depth: 68.2,
    altitude: 15.0,
    coordinates: { lat: 18.9220, lng: 72.8347, location: 'Mumbai Port Approach Channel' },
    description: 'Standard rectangular steel shipping container resting at 15° tilt. Severe navigation obstacle for deep-draft commercial vessels.',
    dimensions: { length: '12.2 m', width: '2.4 m', estHeight: '2.6 m' },
    slantRange: 35.0,
    shadowLength: 7.2,
    anomalyConfidence: 0.985,
    cleanPriority: 'P1 - Navigational Hazard Notice',
    timestamp: '2026-08-25T16:05:40Z',
    detections: [
      {
        id: 'det-2',
        label: 'ISO Shipping Container',
        confidence: 0.98,
        type: 'hazard',
        box: { x: 52, y: 40, w: 34, h: 30 },
        highlight: { x: 53, y: 41, w: 30, h: 8 },
        shadow: { x: 53, y: 49, w: 32, h: 20 },
        estHeight: '2.6 m',
        material: 'Corrugated Corten Steel',
        acousticReflectivity: 'Specular Strong Echo'
      }
    ],
    anomalyZones: [
      { x: 62, y: 52, radius: 50, intensity: 0.97 }
    ],
    sonarParams: {
      frequency: '450 kHz',
      pingRate: '12 Hz',
      swathWidth: '150 m',
      soundSpeed: '1510 m/s'
    }
  },
  {
    id: 'chemical-barrels-03',
    name: 'Industrial Metal Drum Cluster',
    category: 'Hazardous Chemical Debris',
    riskLevel: 'CRITICAL',
    riskScore: 96,
    depth: 54.0,
    altitude: 10.0,
    coordinates: { lat: 13.0827, lng: 80.2707, location: 'Chennai Industrial Offshore Basin' },
    description: 'Cluster of 5–8 sunken metallic barrels displaying localized acoustic corrosion plume. Potential heavy metal or chemical release risk.',
    dimensions: { length: '5.8 m', width: '4.2 m', estHeight: '1.1 m' },
    slantRange: 18.5,
    shadowLength: 2.3,
    anomalyConfidence: 0.941,
    cleanPriority: 'P0 - Immediate Containment & Hazmat',
    timestamp: '2026-08-25T18:40:15Z',
    detections: [
      {
        id: 'det-3a',
        label: 'Hazardous Drum Cluster',
        confidence: 0.94,
        type: 'chemical_hazard',
        box: { x: 28, y: 35, w: 26, h: 22 },
        highlight: { x: 29, y: 36, w: 24, h: 8 },
        shadow: { x: 29, y: 44, w: 24, h: 12 },
        estHeight: '1.1 m',
        material: 'Degraded Steel Drum',
        acousticReflectivity: 'Strong Highlight / Sharp Shadow'
      },
      {
        id: 'det-3b',
        label: 'Chemical Plume Anomaly',
        confidence: 0.89,
        type: 'environmental_anomaly',
        box: { x: 46, y: 25, w: 24, h: 32 },
        highlight: { x: 48, y: 27, w: 20, h: 10 },
        shadow: { x: 48, y: 37, w: 20, h: 18 },
        estHeight: '0.4 m',
        material: 'Sediment / Chemical Disturbance',
        acousticReflectivity: 'Turbulent Acoustic Attenuation'
      }
    ],
    anomalyZones: [
      { x: 38, y: 42, radius: 40, intensity: 0.95 }
    ],
    sonarParams: {
      frequency: '900 kHz',
      pingRate: '20 Hz',
      swathWidth: '80 m',
      soundSpeed: '1495 m/s'
    }
  },
  {
    id: 'submerged-wreck-04',
    name: 'Sunken Wooden/Steel Trawler Wreck',
    category: 'Sunken Vessel / Artificial Reef',
    riskLevel: 'MEDIUM',
    riskScore: 68,
    depth: 85.0,
    altitude: 20.0,
    coordinates: { lat: 9.9312, lng: 76.2673, location: 'Kochi Offshore Shipping Trench' },
    description: 'Inverted fishing trawler hull on sandy bottom. Partial collapse around stern; creating micro-habitat with minor debris dispersal.',
    dimensions: { length: '24.5 m', width: '7.8 m', estHeight: '4.8 m' },
    slantRange: 42.0,
    shadowLength: 12.8,
    anomalyConfidence: 0.991,
    cleanPriority: 'P3 - Long-term Monitoring',
    timestamp: '2026-08-25T20:10:00Z',
    detections: [
      {
        id: 'det-4',
        label: 'Sunken Hull (Trawler)',
        confidence: 0.99,
        type: 'wreck',
        box: { x: 22, y: 24, w: 56, h: 48 },
        highlight: { x: 25, y: 26, w: 50, h: 16 },
        shadow: { x: 25, y: 42, w: 50, h: 28 },
        estHeight: '4.8 m',
        material: 'Composite Hull & Keel Structure',
        acousticReflectivity: 'High Backscatter Ridge'
      }
    ],
    anomalyZones: [
      { x: 48, y: 45, radius: 65, intensity: 0.99 }
    ],
    sonarParams: {
      frequency: '100 kHz',
      pingRate: '8 Hz',
      swathWidth: '300 m',
      soundSpeed: '1520 m/s'
    }
  },
  {
    id: 'pipeline-fracture-05',
    name: 'Subsea Hydrocarbon Pipeline Fracture',
    category: 'Critical Infrastructure Anomaly',
    riskLevel: 'CRITICAL',
    riskScore: 98,
    depth: 110.0,
    altitude: 8.0,
    coordinates: { lat: 19.2813, lng: 71.3521, location: 'Bombay High Offshore Field' },
    description: 'Continuous pipeline anomaly showing scouring ditch, structural buckling, and suspended debris collar around flange.',
    dimensions: { length: '35.0 m', width: '1.8 m', estHeight: '1.2 m' },
    slantRange: 16.0,
    shadowLength: 2.9,
    anomalyConfidence: 0.978,
    cleanPriority: 'P0 - Emergency Industrial Repair',
    timestamp: '2026-08-25T22:15:30Z',
    detections: [
      {
        id: 'det-5',
        label: 'Pipeline Spanning & Scour Fault',
        confidence: 0.97,
        type: 'infrastructure_fault',
        box: { x: 15, y: 38, w: 70, h: 22 },
        highlight: { x: 15, y: 39, w: 70, h: 7 },
        shadow: { x: 15, y: 46, w: 70, h: 14 },
        estHeight: '1.2 m',
        material: 'Coated Concrete-Steel Pipe',
        acousticReflectivity: 'Linear Specular Streak'
      }
    ],
    anomalyZones: [
      { x: 50, y: 48, radius: 55, intensity: 0.98 }
    ],
    sonarParams: {
      frequency: '900 kHz',
      pingRate: '25 Hz',
      swathWidth: '60 m',
      soundSpeed: '1490 m/s'
    }
  },
  {
    id: 'naval-mine-uxo-06',
    name: 'Unexploded Ordnance (UXO) / Moored Mine',
    category: 'Maritime Defense / Explosive UXO',
    riskLevel: 'CRITICAL',
    riskScore: 99,
    depth: 38.0,
    altitude: 10.0,
    coordinates: { lat: 11.9139, lng: 79.8145, location: 'Puducherry Coastal Shelf' },
    description: 'Spherical metallic contact mine with anchor tether and horn protrusions. Sharp specular acoustic crown and circular acoustic shadow.',
    dimensions: { length: '1.4 m', width: '1.4 m', estHeight: '1.3 m' },
    slantRange: 14.2,
    shadowLength: 2.1,
    anomalyConfidence: 0.988,
    cleanPriority: 'P0 - EOD / Naval Clearance Alert',
    timestamp: '2026-08-26T01:30:00Z',
    detections: [
      {
        id: 'det-6',
        label: 'Spherical Contact Mine / UXO',
        confidence: 0.99,
        type: 'explosive_uxo',
        box: { x: 42, y: 36, w: 20, h: 24 },
        highlight: { x: 44, y: 37, w: 14, h: 6 },
        shadow: { x: 44, y: 43, w: 16, h: 15 },
        estHeight: '1.3 m',
        material: 'Cast Iron / High Explosive Encapsulation',
        acousticReflectivity: 'Ultra-High Specular Echo'
      }
    ],
    anomalyZones: [
      { x: 50, y: 47, radius: 35, intensity: 0.99 }
    ],
    sonarParams: {
      frequency: '900 kHz',
      pingRate: '25 Hz',
      swathWidth: '50 m',
      soundSpeed: '1505 m/s'
    }
  }
];

export const SURVEY_STATS = {
  totalSweepAreaSqKm: 142.8,
  totalPingsProcessed: '2,840,120',
  detectedDebrisCount: 384,
  criticalHazards: 24,
  modelAccuracyF1: '94.8%',
  inferenceLatencyMs: 16.4,
  auvBatteryPct: 87,
  activeSwathMeters: 100,
  auvSpeedKnots: 3.2
};
