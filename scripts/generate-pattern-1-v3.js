const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Light blue color theme
const LIGHT_BLUE = '#4dc9ff';
const LIGHT_BLUE_MEDIUM = 'rgba(77, 201, 255, 0.7)';
const LIGHT_BLUE_LIGHT = 'rgba(77, 201, 255, 0.4)';
const LIGHT_BLUE_FAINT = 'rgba(77, 201, 255, 0.2)';

// Output directory
const OUTPUT_DIR = path.join(__dirname, '../public/images/cyber-patterns');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Seeded random for reproducible results
let seed = 12345;
function seededRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

/**
 * Pattern 1 v3: Asymmetric HUD pattern with random arc placement
 * Large pattern (1800x1800) - same size as pattern-1
 */
function generatePattern1V3() {
  const size = 1800;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  // Helper function to draw random arcs at a given radius
  function drawRandomArcs(radius, count, minLength, maxLength, lineWidth, color) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;

    const arcs = [];
    let attempts = 0;

    while (arcs.length < count && attempts < count * 10) {
      attempts++;
      const startAngle = seededRandom() * Math.PI * 2;
      const length = minLength + seededRandom() * (maxLength - minLength);
      const endAngle = startAngle + length;

      // Check for overlap with existing arcs (with some gap)
      const gap = 0.1;
      let overlaps = false;
      for (const arc of arcs) {
        if (!(endAngle + gap < arc.start || startAngle - gap > arc.end)) {
          // Check wrap-around
          if (!(endAngle + gap < arc.start + Math.PI * 2 || startAngle - gap > arc.end - Math.PI * 2)) {
            overlaps = true;
            break;
          }
        }
      }

      if (!overlaps) {
        arcs.push({ start: startAngle, end: endAngle });
        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.stroke();
      }
    }
  }

  // Outermost thin ring - full circle
  ctx.strokeStyle = LIGHT_BLUE;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 880, 0, Math.PI * 2);
  ctx.stroke();

  // Outer random segmented arcs (thick)
  drawRandomArcs(850, 8, 0.2, 0.6, 8, LIGHT_BLUE);

  // Second layer - medium thickness random arcs
  drawRandomArcs(800, 6, 0.3, 0.8, 15, LIGHT_BLUE_MEDIUM);

  // Middle decorative ring with gaps
  ctx.lineWidth = 20;
  ctx.strokeStyle = LIGHT_BLUE_MEDIUM;
  const middleArcs = [
    { start: 0.1, length: 0.4 },
    { start: 0.7, length: 0.25 },
    { start: 1.1, length: 0.5 },
    { start: 1.8, length: 0.3 },
  ];
  middleArcs.forEach(arc => {
    ctx.beginPath();
    ctx.arc(cx, cy, 750, arc.start * Math.PI, (arc.start + arc.length) * Math.PI);
    ctx.stroke();
  });

  // Inner decorative ring - thin full circle
  ctx.lineWidth = 2;
  ctx.strokeStyle = LIGHT_BLUE;
  ctx.beginPath();
  ctx.arc(cx, cy, 700, 0, Math.PI * 2);
  ctx.stroke();

  // Tick marks around inner ring (symmetrical - same as original pattern-1)
  ctx.lineWidth = 2;
  ctx.strokeStyle = LIGHT_BLUE;
  for (let i = 0; i < 72; i++) {
    const angle = (i / 72) * Math.PI * 2 - Math.PI / 2;
    const innerR = i % 6 === 0 ? 640 : 660;
    const outerR = 690;
    const x1 = cx + Math.cos(angle) * innerR;
    const y1 = cy + Math.sin(angle) * innerR;
    const x2 = cx + Math.cos(angle) * outerR;
    const y2 = cy + Math.sin(angle) * outerR;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Center rings - keep some structure
  ctx.lineWidth = 4;
  ctx.strokeStyle = LIGHT_BLUE_LIGHT;
  ctx.beginPath();
  ctx.arc(cx, cy, 500, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 450, 0, Math.PI * 2);
  ctx.stroke();

  // Random arc segments at radius 600
  ctx.lineWidth = 15;
  ctx.strokeStyle = LIGHT_BLUE_MEDIUM;

  const innerArcs = [
    { start: -0.15, length: 0.35 },
    { start: 0.45, length: 0.2 },
    { start: 0.85, length: 0.4 },
    { start: 1.5, length: 0.25 },
  ];
  innerArcs.forEach(arc => {
    ctx.beginPath();
    ctx.arc(cx, cy, 600, arc.start * Math.PI, (arc.start + arc.length) * Math.PI);
    ctx.stroke();
  });

  // Additional thin random arcs at radius 550
  ctx.lineWidth = 6;
  ctx.strokeStyle = LIGHT_BLUE;
  const thinArcs = [
    { start: 0.2, length: 0.15 },
    { start: 0.6, length: 0.25 },
    { start: 1.2, length: 0.18 },
    { start: 1.7, length: 0.22 },
  ];
  thinArcs.forEach(arc => {
    ctx.beginPath();
    ctx.arc(cx, cy, 550, arc.start * Math.PI, (arc.start + arc.length) * Math.PI);
    ctx.stroke();
  });

  // Small random ticks at outer edge
  ctx.lineWidth = 3;
  ctx.strokeStyle = LIGHT_BLUE_LIGHT;
  for (let i = 0; i < 30; i++) {
    const angle = seededRandom() * Math.PI * 2;
    const innerR = 860;
    const outerR = 875;
    const x1 = cx + Math.cos(angle) * innerR;
    const y1 = cy + Math.sin(angle) * innerR;
    const x2 = cx + Math.cos(angle) * outerR;
    const y2 = cy + Math.sin(angle) * outerR;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Data bar style segments at radius 820
  ctx.lineWidth = 10;
  ctx.strokeStyle = LIGHT_BLUE_FAINT;
  const dataBars = [
    { start: 0.05, length: 0.08 },
    { start: 0.25, length: 0.12 },
    { start: 0.55, length: 0.06 },
    { start: 0.78, length: 0.1 },
    { start: 1.05, length: 0.07 },
    { start: 1.35, length: 0.15 },
    { start: 1.65, length: 0.09 },
    { start: 1.88, length: 0.05 },
  ];
  dataBars.forEach(bar => {
    ctx.beginPath();
    ctx.arc(cx, cy, 820, bar.start * Math.PI, (bar.start + bar.length) * Math.PI);
    ctx.stroke();
  });

  // Inner data segments at radius 480
  ctx.lineWidth = 8;
  ctx.strokeStyle = LIGHT_BLUE_LIGHT;
  const innerDataBars = [
    { start: 0.1, length: 0.2 },
    { start: 0.5, length: 0.15 },
    { start: 0.9, length: 0.25 },
    { start: 1.4, length: 0.18 },
    { start: 1.75, length: 0.12 },
  ];
  innerDataBars.forEach(bar => {
    ctx.beginPath();
    ctx.arc(cx, cy, 480, bar.start * Math.PI, (bar.start + bar.length) * Math.PI);
    ctx.stroke();
  });

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'pattern-1-v3.png'), buffer);
  console.log('Generated pattern-1-v3.png');
}

// Generate the pattern
console.log('Generating pattern-1-v3...');
generatePattern1V3();
console.log('Pattern generated successfully!');
