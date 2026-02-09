const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Light blue color theme
const LIGHT_BLUE = '#4dc9ff';
const LIGHT_BLUE_MEDIUM = 'rgba(77, 201, 255, 0.7)';

// Output directory
const OUTPUT_DIR = path.join(__dirname, '../public/images/cyber-patterns');

/**
 * Pattern 4: Two opposing 1/6 arcs (outer only)
 * Size between pattern-1 and pattern-2 (radius ~550-600)
 * Fast rotating paired arcs
 */
function generatePattern4() {
  const size = 1400;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  // 1/6 of a circle = 60 degrees = PI/3 radians
  const arcLength = Math.PI / 3;
  const radius = 580;

  // Arc 1 - top right area
  ctx.strokeStyle = LIGHT_BLUE;
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';

  const arc1Start = -Math.PI / 6; // -30 degrees
  const arc1End = arc1Start + arcLength;

  ctx.beginPath();
  ctx.arc(cx, cy, radius, arc1Start, arc1End);
  ctx.stroke();

  // Arc 2 - bottom left area (opposite, 180 degrees offset)
  const arc2Start = arc1Start + Math.PI; // 150 degrees
  const arc2End = arc2Start + arcLength;

  ctx.beginPath();
  ctx.arc(cx, cy, radius, arc2Start, arc2End);
  ctx.stroke();

  // Small dots at arc ends for decoration
  ctx.fillStyle = LIGHT_BLUE;
  const dotRadius = 5;

  // Dots for arc 1
  const dot1x1 = cx + Math.cos(arc1Start) * radius;
  const dot1y1 = cy + Math.sin(arc1Start) * radius;
  const dot1x2 = cx + Math.cos(arc1End) * radius;
  const dot1y2 = cy + Math.sin(arc1End) * radius;

  ctx.beginPath();
  ctx.arc(dot1x1, dot1y1, dotRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(dot1x2, dot1y2, dotRadius, 0, Math.PI * 2);
  ctx.fill();

  // Dots for arc 2
  const dot2x1 = cx + Math.cos(arc2Start) * radius;
  const dot2y1 = cy + Math.sin(arc2Start) * radius;
  const dot2x2 = cx + Math.cos(arc2End) * radius;
  const dot2y2 = cy + Math.sin(arc2End) * radius;

  ctx.beginPath();
  ctx.arc(dot2x1, dot2y1, dotRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(dot2x2, dot2y2, dotRadius, 0, Math.PI * 2);
  ctx.fill();

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'pattern-4.png'), buffer);
  console.log('Generated pattern-4.png (paired 1/6 arcs, outer only)');
}

console.log('Generating pattern-4...');
generatePattern4();
console.log('Done!');
