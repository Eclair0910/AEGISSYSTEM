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

/**
 * Pattern 1: Multi-ring HUD pattern with segments and tick marks
 * Large pattern (1800x1800)
 */
function generatePattern1() {
  const size = 1800;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  // Outer ring with segments
  ctx.strokeStyle = LIGHT_BLUE;
  ctx.lineWidth = 3;

  // Outermost thin ring
  ctx.beginPath();
  ctx.arc(cx, cy, 880, 0, Math.PI * 2);
  ctx.stroke();

  // Segmented ring (outer)
  ctx.lineWidth = 8;
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
    if (i % 5 !== 0) { // Skip every 5th segment for gaps
      const startAngle = angle;
      const endAngle = angle + (Math.PI * 2 / 60) * 0.7;
      ctx.beginPath();
      ctx.arc(cx, cy, 850, startAngle, endAngle);
      ctx.stroke();
    }
  }

  // Middle ring with thick segments
  ctx.lineWidth = 20;
  ctx.strokeStyle = LIGHT_BLUE_MEDIUM;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const startAngle = angle + 0.05;
    const endAngle = angle + (Math.PI * 2 / 12) - 0.1;
    ctx.beginPath();
    ctx.arc(cx, cy, 750, startAngle, endAngle);
    ctx.stroke();
  }

  // Inner decorative ring
  ctx.lineWidth = 2;
  ctx.strokeStyle = LIGHT_BLUE;
  ctx.beginPath();
  ctx.arc(cx, cy, 700, 0, Math.PI * 2);
  ctx.stroke();

  // Tick marks around inner ring
  ctx.lineWidth = 2;
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

  // Center rings
  ctx.lineWidth = 4;
  ctx.strokeStyle = LIGHT_BLUE_LIGHT;
  ctx.beginPath();
  ctx.arc(cx, cy, 500, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 450, 0, Math.PI * 2);
  ctx.stroke();

  // Arc segments at various positions
  ctx.lineWidth = 15;
  ctx.strokeStyle = LIGHT_BLUE_MEDIUM;

  // Top-right arc
  ctx.beginPath();
  ctx.arc(cx, cy, 600, -Math.PI * 0.3, Math.PI * 0.1);
  ctx.stroke();

  // Bottom-left arc
  ctx.beginPath();
  ctx.arc(cx, cy, 600, Math.PI * 0.7, Math.PI * 1.1);
  ctx.stroke();

  // Small decorative dots
  ctx.fillStyle = LIGHT_BLUE;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * 550;
    const y = cy + Math.sin(angle) * 550;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'pattern-1.png'), buffer);
  console.log('Generated pattern-1.png');
}

/**
 * Pattern 2: Gear-like pattern with notches
 * Medium pattern (600x600)
 */
function generatePattern2() {
  const size = 600;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  // Outer gear teeth
  ctx.strokeStyle = LIGHT_BLUE;
  ctx.lineWidth = 3;

  const teethCount = 24;
  const outerR = 280;
  const innerR = 250;
  const toothWidth = Math.PI * 2 / teethCount / 2;

  ctx.beginPath();
  for (let i = 0; i < teethCount; i++) {
    const angle = (i / teethCount) * Math.PI * 2 - Math.PI / 2;

    // Outer point
    const x1 = cx + Math.cos(angle) * outerR;
    const y1 = cy + Math.sin(angle) * outerR;

    // Inner corners
    const x2 = cx + Math.cos(angle + toothWidth * 0.3) * innerR;
    const y2 = cy + Math.sin(angle + toothWidth * 0.3) * innerR;
    const x3 = cx + Math.cos(angle + toothWidth * 1.7) * innerR;
    const y3 = cy + Math.sin(angle + toothWidth * 1.7) * innerR;

    if (i === 0) {
      ctx.moveTo(x1, y1);
    } else {
      ctx.lineTo(x1, y1);
    }
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
  }
  ctx.closePath();
  ctx.stroke();

  // Middle ring
  ctx.lineWidth = 6;
  ctx.strokeStyle = LIGHT_BLUE_MEDIUM;
  ctx.beginPath();
  ctx.arc(cx, cy, 200, 0, Math.PI * 2);
  ctx.stroke();

  // Segmented inner ring
  ctx.lineWidth = 12;
  ctx.strokeStyle = LIGHT_BLUE;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const startAngle = angle + 0.1;
    const endAngle = angle + (Math.PI * 2 / 8) - 0.2;
    ctx.beginPath();
    ctx.arc(cx, cy, 160, startAngle, endAngle);
    ctx.stroke();
  }

  // Inner decorative circle
  ctx.lineWidth = 2;
  ctx.strokeStyle = LIGHT_BLUE_LIGHT;
  ctx.beginPath();
  ctx.arc(cx, cy, 120, 0, Math.PI * 2);
  ctx.stroke();

  // Center cross pattern
  ctx.lineWidth = 4;
  ctx.strokeStyle = LIGHT_BLUE;

  // Horizontal line
  ctx.beginPath();
  ctx.moveTo(cx - 80, cy);
  ctx.lineTo(cx + 80, cy);
  ctx.stroke();

  // Vertical line
  ctx.beginPath();
  ctx.moveTo(cx, cy - 80);
  ctx.lineTo(cx, cy + 80);
  ctx.stroke();

  // Small center circle
  ctx.beginPath();
  ctx.arc(cx, cy, 30, 0, Math.PI * 2);
  ctx.stroke();

  // Dots at cross ends
  ctx.fillStyle = LIGHT_BLUE;
  [[cx - 90, cy], [cx + 90, cy], [cx, cy - 90], [cx, cy + 90]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'pattern-2.png'), buffer);
  console.log('Generated pattern-2.png');
}

/**
 * Pattern 3: Technical ring with data segments
 * Large pattern (1000x1000)
 */
function generatePattern3() {
  const size = 1000;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  // Outermost ring with gaps
  ctx.strokeStyle = LIGHT_BLUE;
  ctx.lineWidth = 4;

  // Draw ring with strategic gaps
  const gaps = [0.1, 0.35, 0.6, 0.85]; // Gap positions (0-1)
  const gapSize = 0.08;

  for (let i = 0; i < gaps.length; i++) {
    const startAngle = (gaps[i] + gapSize) * Math.PI * 2 - Math.PI / 2;
    const endAngle = (gaps[(i + 1) % gaps.length]) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 480, startAngle, endAngle);
    ctx.stroke();
  }

  // Data bars around outer edge
  ctx.lineWidth = 25;
  ctx.strokeStyle = LIGHT_BLUE_LIGHT;
  const barAngles = [0.15, 0.4, 0.65, 0.9];
  barAngles.forEach(pos => {
    const angle = pos * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 450, angle, angle + 0.15);
    ctx.stroke();
  });

  // Middle segmented ring
  ctx.lineWidth = 6;
  ctx.strokeStyle = LIGHT_BLUE;
  for (let i = 0; i < 36; i++) {
    if (i % 3 !== 0) { // Skip every 3rd for gaps
      const angle = (i / 36) * Math.PI * 2 - Math.PI / 2;
      const startAngle = angle;
      const endAngle = angle + (Math.PI * 2 / 36) * 0.6;
      ctx.beginPath();
      ctx.arc(cx, cy, 380, startAngle, endAngle);
      ctx.stroke();
    }
  }

  // Inner ring
  ctx.lineWidth = 3;
  ctx.strokeStyle = LIGHT_BLUE_MEDIUM;
  ctx.beginPath();
  ctx.arc(cx, cy, 320, 0, Math.PI * 2);
  ctx.stroke();

  // Tick marks
  ctx.lineWidth = 2;
  ctx.strokeStyle = LIGHT_BLUE;
  for (let i = 0; i < 48; i++) {
    const angle = (i / 48) * Math.PI * 2 - Math.PI / 2;
    const innerR = i % 4 === 0 ? 260 : 280;
    const outerR = 310;
    const x1 = cx + Math.cos(angle) * innerR;
    const y1 = cy + Math.sin(angle) * innerR;
    const x2 = cx + Math.cos(angle) * outerR;
    const y2 = cy + Math.sin(angle) * outerR;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Decorative inner elements
  ctx.lineWidth = 8;
  ctx.strokeStyle = LIGHT_BLUE_MEDIUM;

  // Partial arcs
  ctx.beginPath();
  ctx.arc(cx, cy, 220, -Math.PI * 0.4, Math.PI * 0.2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 220, Math.PI * 0.6, Math.PI * 1.2);
  ctx.stroke();

  // Inner circle
  ctx.lineWidth = 2;
  ctx.strokeStyle = LIGHT_BLUE;
  ctx.beginPath();
  ctx.arc(cx, cy, 160, 0, Math.PI * 2);
  ctx.stroke();

  // Center elements
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 100, 0, Math.PI * 2);
  ctx.stroke();

  // Connecting lines from center
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + Math.cos(angle) * 40;
    const y1 = cy + Math.sin(angle) * 40;
    const x2 = cx + Math.cos(angle) * 90;
    const y2 = cy + Math.sin(angle) * 90;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Center dot
  ctx.fillStyle = LIGHT_BLUE;
  ctx.beginPath();
  ctx.arc(cx, cy, 15, 0, Math.PI * 2);
  ctx.fill();

  // Small outer dots
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * 420;
    const y = cy + Math.sin(angle) * 420;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'pattern-3.png'), buffer);
  console.log('Generated pattern-3.png');
}

// Generate all patterns
console.log('Generating cyber patterns...');
generatePattern1();
generatePattern2();
generatePattern3();
console.log('All patterns generated successfully!');
