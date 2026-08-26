/**
 * Side-Scan Sonar DSP & Acoustic Math Utilities
 */

/**
 * Calculates 3D object height above seafloor based on acoustic shadow geometry
 * H = (L_shadow * H_altitude) / (R_slant + L_shadow)
 * 
 * @param {number} shadowLengthMeters - Length of acoustic shadow in meters
 * @param {number} altitudeMeters - Altitude of AUV / Sonar towfish above seafloor
 * @param {number} slantRangeMeters - Slant range from transducer to target highlight
 * @returns {number} Estimated object height in meters
 */
export function calculateObjectHeight(shadowLengthMeters, altitudeMeters, slantRangeMeters) {
  if (!shadowLengthMeters || !altitudeMeters || !slantRangeMeters) return 0;
  const height = (shadowLengthMeters * altitudeMeters) / (slantRangeMeters + shadowLengthMeters);
  return Number(height.toFixed(2));
}

/**
 * Slant-Range to Ground-Range Conversion
 * Ground Distance Y = sqrt(R^2 - H^2)
 */
export function calculateGroundRange(slantRangeMeters, altitudeMeters) {
  if (slantRangeMeters <= altitudeMeters) return 0;
  return Math.sqrt(Math.pow(slantRangeMeters, 2) - Math.pow(altitudeMeters, 2));
}

/**
 * Generates synthetic acoustic side-scan sonar image texture onto an HTML5 Canvas
 */
export function drawSonarCanvas(canvas, sample, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  const {
    filterMode = 'raw', // 'raw', 'slant_corrected', 'nadir_removed', 'despeckled', 'clahe'
    palette = 'copper', // 'copper', 'emerald', 'cyan', 'grayscale'
    showBBoxes = true,
    showHighlights = true,
    showShadows = true,
    showAnomalyHeatmap = false,
    interactiveMeasure = null
  } = options;

  // Background base
  ctx.fillStyle = '#050a14';
  ctx.fillRect(0, 0, width, height);

  // Generate Seabed Backscatter with grazing angle intensity
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const nadirWidth = filterMode === 'nadir_removed' ? 6 : (width * 0.12);
  const nadirCenterX = width / 2;

  // Seeded deterministic noise
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const distFromCenter = Math.abs(x - nadirCenterX);

      let intensity = 0;

      if (distFromCenter < nadirWidth / 2 && filterMode !== 'nadir_removed') {
        // Water column / Nadir zone: low reflection with slight acoustic noise
        intensity = 15 + Math.sin(y * 0.2 + x * 0.1) * 8 + (Math.random() * 12);
      } else {
        // Seafloor acoustic reverberation
        // Lambert's Law cosine attenuation
        const normDist = (distFromCenter - nadirWidth / 2) / (width / 2);
        const grazingFactor = Math.max(0.2, 1.0 - normDist * 0.55);
        
        // Seabed sand ripple / sediment pattern
        const ripple = Math.sin(y * 0.08 + x * 0.03) * 18 + Math.cos(x * 0.15 + y * 0.02) * 12;
        const microSpeckle = (Math.random() - 0.5) * (filterMode === 'despeckled' ? 12 : 45);

        intensity = (85 * grazingFactor) + ripple + microSpeckle;
      }

      // Check if inside object highlight or shadow areas
      if (sample && sample.detections) {
        sample.detections.forEach(det => {
          const bx = (det.box.x / 100) * width;
          const by = (det.box.y / 100) * height;
          const bw = (det.box.w / 100) * width;
          const bh = (det.box.h / 100) * height;

          const hx = (det.highlight.x / 100) * width;
          const hy = (det.highlight.y / 100) * height;
          const hw = (det.highlight.w / 100) * width;
          const hh = (det.highlight.h / 100) * height;

          const sx = (det.shadow.x / 100) * width;
          const sy = (det.shadow.y / 100) * height;
          const sw = (det.shadow.w / 100) * width;
          const sh = (det.shadow.h / 100) * height;

          // Acoustic Highlight (Strong direct specular echo)
          if (x >= hx && x <= hx + hw && y >= hy && y <= hy + hh) {
            const centerDist = Math.hypot((x - (hx + hw/2))/(hw/2), (y - (hy + hh/2))/(hh/2));
            if (centerDist <= 1.0) {
              const boost = (1 - centerDist) * 170;
              intensity = Math.min(255, intensity + boost + (Math.random() * 25));
            }
          }

          // Acoustic Shadow (Null backscatter zone behind object)
          if (x >= sx && x <= sx + sw && y >= sy && y <= sy + sh) {
            const shadowCenter = Math.hypot((x - (sx + sw/2))/(sw/2), (y - (sy + sh/2))/(sh/2));
            if (shadowCenter <= 1.1) {
              intensity = Math.max(2, intensity * 0.12 - 10 + (Math.random() * 6));
            }
          }
        });
      }

      // Apply CLAHE / Dynamic Range Contrast boost
      if (filterMode === 'clahe') {
        intensity = Math.pow(intensity / 255, 0.75) * 255 * 1.15;
      }

      intensity = Math.min(255, Math.max(0, intensity));

      // Color mapping
      if (palette === 'copper') {
        data[idx] = Math.min(255, intensity * 1.15); // R
        data[idx + 1] = Math.min(255, intensity * 0.72); // G
        data[idx + 2] = Math.min(255, intensity * 0.22); // B
      } else if (palette === 'emerald') {
        data[idx] = Math.min(255, intensity * 0.2);
        data[idx + 1] = Math.min(255, intensity * 1.1);
        data[idx + 2] = Math.min(255, intensity * 0.75);
      } else if (palette === 'cyan') {
        data[idx] = Math.min(255, intensity * 0.15);
        data[idx + 1] = Math.min(255, intensity * 0.95);
        data[idx + 2] = Math.min(255, intensity * 1.2);
      } else {
        // grayscale
        data[idx] = intensity;
        data[idx + 1] = intensity;
        data[idx + 2] = intensity;
      }
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Overlay Nadir Centerline
  if (filterMode !== 'nadir_removed') {
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(nadirCenterX, 0);
    ctx.lineTo(nadirCenterX, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Channel labels
    ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('PORT SWATH ◀', 16, 18);
    ctx.fillText('NADIR', nadirCenterX - 16, 18);
    ctx.fillText('▶ STARBOARD SWATH', width - 130, 18);
  }

  // Draw Anomaly Heatmap (PatchCore unsupervised representation)
  if (showAnomalyHeatmap && sample && sample.anomalyZones) {
    sample.anomalyZones.forEach(zone => {
      const zx = (zone.x / 100) * width;
      const zy = (zone.y / 100) * height;
      const radius = zone.radius * (width / 500);

      const grad = ctx.createRadialGradient(zx, zy, 0, zx, zy, radius);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.75)');
      grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.45)');
      grad.addColorStop(0.8, 'rgba(16, 185, 129, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(zx, zy, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Draw AI Supervised Bounding Boxes & Dual Highlight-Shadow Cues
  if (showBBoxes && sample && sample.detections) {
    sample.detections.forEach(det => {
      const bx = (det.box.x / 100) * width;
      const by = (det.box.y / 100) * height;
      const bw = (det.box.w / 100) * width;
      const bh = (det.box.h / 100) * height;

      // 1. Overall Bounding Box
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(bx, by, bw, bh);

      // Label badge
      ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
      ctx.fillRect(bx, by - 22, Math.max(160, bw), 22);
      ctx.fillStyle = '#030712';
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.fillText(`${det.label} [${(det.confidence * 100).toFixed(0)}%]`, bx + 6, by - 6);

      // 2. Highlight Box (Acoustic Bright Echo)
      if (showHighlights && det.highlight) {
        const hx = (det.highlight.x / 100) * width;
        const hy = (det.highlight.y / 100) * height;
        const hw = (det.highlight.w / 100) * width;
        const hh = (det.highlight.h / 100) * height;

        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 2]);
        ctx.strokeRect(hx, hy, hw, hh);

        ctx.fillStyle = '#10B981';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText('● HIGHLIGHT CUE', hx + 4, hy + 12);
      }

      // 3. Shadow Box (Acoustic Blind Shadow)
      if (showShadows && det.shadow) {
        const sx = (det.shadow.x / 100) * width;
        const sy = (det.shadow.y / 100) * height;
        const sw = (det.shadow.w / 100) * width;
        const sh = (det.shadow.h / 100) * height;

        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 2]);
        ctx.strokeRect(sx, sy, sw, sh);

        ctx.fillStyle = '#F59E0B';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText(`▲ SHADOW (${det.estHeight})`, sx + 4, sy + 14);
      }
    });
  }

  // Draw Range Scale Overlay (Meters)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(20, height - 20);
  ctx.lineTo(120, height - 20);
  ctx.moveTo(20, height - 25);
  ctx.lineTo(20, height - 15);
  ctx.moveTo(120, height - 25);
  ctx.lineTo(120, height - 15);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillText('10 METERS', 40, height - 26);
}
