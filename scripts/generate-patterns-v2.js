const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Light blue color theme
const LIGHT_BLUE = '#4dc9ff';
const LIGHT_BLUE_MEDIUM = 'rgba(77, 201, 255, 0.6)';
const LIGHT_BLUE_LIGHT = 'rgba(77, 201, 255, 0.35)';

// Output directory
const OUTPUT_DIR = path.join(__dirname, '../public/images/cyber-patterns');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Pattern 1 v2: Outer donut ring (radius 750-850)
 * Large outer pattern
 */
function generatePattern1V2() {
  const size = 1800;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  // Outer ring - thin line
  ctx.strokeStyle = LIGHT_BLUE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 850, 0, Math.PI * 2);
  ctx.stroke();

  // Main segmented ring
  ctx.lineWidth = 6;
  ctx.strokeStyle = LIGHT_BLUE_MEDIUM;
  for (let i = 0; i < 48; i++) {
    const angle = (i / 48) * Math.PI * 2 - Math.PI / 2;
    if (i % 4 !== 0) {
      const startAngle = angle + 0.02;
      const endAngle = angle + (Math.PI * 2 / 48) - 0.04;
      ctx.beginPath();
      ctx.arc(cx, cy, 820, startAngle, endAngle);
      ctx.stroke();
    }
  }

  // Tick marks
  ctx.lineWidth = 2;
  ctx.strokeStyle = LIGHT_BLUE;
  for (let i = 0; i < 72; i++) {
    const angle = (i / 72) * Math.PI * 2 - Math.PI / 2;
    const innerR = i % 6 === 0 ? 760 : 780;
    const outerR = 800;
    const x1 = cx + Math.cos(angle) * innerR;
    const y1 = cy + Math.sin(angle) * innerR;
    const x2 = cx + Math.cos(angle) * outerR;
    const y2 = cy + Math.sin(angle) * outerR;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Inner edge of donut
  ctx.lineWidth = 2;
  ctx.strokeStyle = LIGHT_BLUE_LIGHT;
  ctx.beginPath();
  ctx.arc(cx, cy, 750, 0, Math.PI * 2);
  ctx.stroke();

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'pattern-1-v2.png'), buffer);
  console.log('Generated pattern-1-v2.png (outer donut: 750-850)');
}

/**
 * Pattern 2 v2: Middle donut ring (radius 450-550)
 * Medium ring pattern
 */
function generatePattern2V2() {
  const size = 1200;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  // Outer edge
  ctx.strokeStyle = LIGHT_BLUE;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 550, 0, Math.PI * 2);
  ctx.stroke();

  // Segmented thick arcs
  ctx.lineWidth = 15;
  ctx.strokeStyle = LIGHT_BLUE_LIGHT;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const startAngle = angle + 0.08;
    const endAngle = angle + (Math.PI * 2 / 8) - 0.16;
    ctx.beginPath();
    ctx.arc(cx, cy, 520, startAngle, endAngle);
    ctx.stroke();
  }

  // Middle ring with gaps
  ctx.lineWidth = 4;
  ctx.strokeStyle = LIGHT_BLUE;
  const gaps = [0, 0.25, 0.5, 0.75];
  const gapSize = 0.06;
  for (let i = 0; i < gaps.length; i++) {
    const startAngle = (gaps[i] + gapSize) * Math.PI * 2 - Math.PI / 2;
    const endAngle = (gaps[(i + 1) % gaps.length]) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 490, startAngle, endAngle);
    ctx.stroke();
  }

  // Inner dotted ring
  ctx.lineWidth = 2;
  ctx.strokeStyle = LIGHT_BLUE_MEDIUM;
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    const startAngle = angle;
    const endAngle = angle + 0.08;
    ctx.beginPath();
    ctx.arc(cx, cy, 460, startAngle, endAngle);
    ctx.stroke();
  }

  // Inner edge of donut
  ctx.lineWidth = 2;
  ctx.strokeStyle = LIGHT_BLUE_LIGHT;
  ctx.beginPath();
  ctx.arc(cx, cy, 450, 0, Math.PI * 2);
  ctx.stroke();

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'pattern-2-v2.png'), buffer);
  console.log('Generated pattern-2-v2.png (middle donut: 450-550)');
}

/**
 * Pattern 3 v2: Inner donut ring (radius 200-350)
 * Innermost pattern
 */
function generatePattern3V2() {
  const size = 800;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  // Outer edge
  ctx.strokeStyle = LIGHT_BLUE;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 350, 0, Math.PI * 2);
  ctx.stroke();

  // Partial arcs
  ctx.lineWidth = 8;
  ctx.strokeStyle = LIGHT_BLUE_MEDIUM;
  ctx.beginPath();
  ctx.arc(cx, cy, 320, -Math.PI * 0.3, Math.PI * 0.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 320, Math.PI * 0.7, Math.PI * 1.3);
  ctx.stroke();

  // Middle ring
  ctx.lineWidth = 2;
  ctx.strokeStyle = LIGHT_BLUE;
  ctx.beginPath();
  ctx.arc(cx, cy, 280, 0, Math.PI * 2);
  ctx.stroke();

  // Gear-like teeth
  const teethCount = 16;
  ctx.lineWidth = 3;
  ctx.strokeStyle = LIGHT_BLUE_LIGHT;
  for (let i = 0; i < teethCount; i++) {
    const angle = (i / teethCount) * Math.PI * 2 - Math.PI / 2;
    const innerR = 240;
    const outerR = 270;
    const x1 = cx + Math.cos(angle) * innerR;
    const y1 = cy + Math.sin(angle) * innerR;
    const x2 = cx + Math.cos(angle) * outerR;
    const y2 = cy + Math.sin(angle) * outerR;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Inner ring
  ctx.lineWidth = 2;
  ctx.strokeStyle = LIGHT_BLUE;
  ctx.beginPath();
  ctx.arc(cx, cy, 230, 0, Math.PI * 2);
  ctx.stroke();

  // Inner edge of donut
  ctx.lineWidth = 2;
  ctx.strokeStyle = LIGHT_BLUE_LIGHT;
  ctx.beginPath();
  ctx.arc(cx, cy, 200, 0, Math.PI * 2);
  ctx.stroke();

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'pattern-3-v2.png'), buffer);
  console.log('Generated pattern-3-v2.png (inner donut: 200-350)');
}

// Generate all patterns
console.log('Generating donut-shaped cyber patterns v2...');
console.log('Pattern radii designed to not overlap:');
console.log('  Pattern 1: 750-850 (outer)');
console.log('  Pattern 2: 450-550 (middle)');
console.log('  Pattern 3: 200-350 (inner)');
console.log('');
generatePattern1V2();
generatePattern2V2();
generatePattern3V2();
console.log('');
console.log('All v2 patterns generated successfully!');
