const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Logo dimensions
const WIDTH = 400;
const HEIGHT = 480;

// Colors
const CYAN = '#4dc9ff';
const DARK_BG = 'transparent';

function createLogo() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Clear with transparent background
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Center point
  const centerX = WIDTH / 2;
  const centerY = HEIGHT / 2;

  // ==========================================
  // 1. Shield Frame (Outer - Thick)
  // ==========================================
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  // Top left corner
  ctx.moveTo(centerX, 30);
  // Top edge curves to right
  ctx.lineTo(centerX + 150, 60);
  // Right edge curves down
  ctx.quadraticCurveTo(centerX + 170, 150, centerX + 140, 280);
  // Bottom right curve to point
  ctx.quadraticCurveTo(centerX + 80, 400, centerX, 450);
  // Bottom left curve
  ctx.quadraticCurveTo(centerX - 80, 400, centerX - 140, 280);
  // Left edge curves up
  ctx.quadraticCurveTo(centerX - 170, 150, centerX - 150, 60);
  // Back to top
  ctx.lineTo(centerX, 30);
  ctx.stroke();

  // ==========================================
  // 2. Inner Frame (Thin)
  // ==========================================
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(centerX, 55);
  ctx.lineTo(centerX + 125, 80);
  ctx.quadraticCurveTo(centerX + 142, 155, centerX + 115, 265);
  ctx.quadraticCurveTo(centerX + 65, 370, centerX, 415);
  ctx.quadraticCurveTo(centerX - 65, 370, centerX - 115, 265);
  ctx.quadraticCurveTo(centerX - 142, 155, centerX - 125, 80);
  ctx.lineTo(centerX, 55);
  ctx.stroke();

  // ==========================================
  // 3. Eagle Head Profile (ASUS-style)
  // ==========================================
  ctx.lineWidth = 3;
  ctx.fillStyle = CYAN;

  // Eagle head facing right
  ctx.beginPath();

  // Start from back of head
  ctx.moveTo(centerX - 60, 180);

  // Top of head curve
  ctx.quadraticCurveTo(centerX - 40, 140, centerX + 10, 145);

  // Forehead to beak
  ctx.quadraticCurveTo(centerX + 50, 150, centerX + 80, 175);

  // Beak tip (sharp, curved down)
  ctx.quadraticCurveTo(centerX + 95, 185, centerX + 85, 200);

  // Under beak
  ctx.quadraticCurveTo(centerX + 70, 210, centerX + 50, 205);

  // Jaw line
  ctx.quadraticCurveTo(centerX + 20, 215, centerX - 10, 230);

  // Neck
  ctx.quadraticCurveTo(centerX - 40, 250, centerX - 60, 240);

  // Back of neck to head
  ctx.quadraticCurveTo(centerX - 70, 220, centerX - 60, 180);

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Eye
  ctx.fillStyle = '#0a1628';
  ctx.beginPath();
  ctx.arc(centerX + 15, 175, 8, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlight
  ctx.fillStyle = CYAN;
  ctx.beginPath();
  ctx.arc(centerX + 18, 172, 3, 0, Math.PI * 2);
  ctx.fill();

  // ==========================================
  // 4. Wings
  // ==========================================
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = CYAN;
  ctx.fillStyle = CYAN;

  // Left Wing
  ctx.beginPath();
  ctx.moveTo(centerX - 50, 250);

  // Wing spreads out and up
  ctx.quadraticCurveTo(centerX - 90, 240, centerX - 110, 280);
  ctx.quadraticCurveTo(centerX - 125, 310, centerX - 100, 340);

  // Feather details
  ctx.lineTo(centerX - 85, 320);
  ctx.lineTo(centerX - 95, 355);
  ctx.lineTo(centerX - 75, 330);
  ctx.lineTo(centerX - 80, 365);
  ctx.lineTo(centerX - 55, 340);
  ctx.lineTo(centerX - 55, 375);
  ctx.lineTo(centerX - 35, 345);

  // Back to body
  ctx.quadraticCurveTo(centerX - 30, 300, centerX - 50, 250);

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right Wing
  ctx.beginPath();
  ctx.moveTo(centerX + 50, 250);

  // Wing spreads out and up
  ctx.quadraticCurveTo(centerX + 90, 240, centerX + 110, 280);
  ctx.quadraticCurveTo(centerX + 125, 310, centerX + 100, 340);

  // Feather details
  ctx.lineTo(centerX + 85, 320);
  ctx.lineTo(centerX + 95, 355);
  ctx.lineTo(centerX + 75, 330);
  ctx.lineTo(centerX + 80, 365);
  ctx.lineTo(centerX + 55, 340);
  ctx.lineTo(centerX + 55, 375);
  ctx.lineTo(centerX + 35, 345);

  // Back to body
  ctx.quadraticCurveTo(centerX + 30, 300, centerX + 50, 250);

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // ==========================================
  // Add glow effect by drawing again with blur
  // ==========================================
  ctx.shadowColor = CYAN;
  ctx.shadowBlur = 15;
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 1;

  // Redraw shield outline with glow
  ctx.beginPath();
  ctx.moveTo(centerX, 30);
  ctx.lineTo(centerX + 150, 60);
  ctx.quadraticCurveTo(centerX + 170, 150, centerX + 140, 280);
  ctx.quadraticCurveTo(centerX + 80, 400, centerX, 450);
  ctx.quadraticCurveTo(centerX - 80, 400, centerX - 140, 280);
  ctx.quadraticCurveTo(centerX - 170, 150, centerX - 150, 60);
  ctx.lineTo(centerX, 30);
  ctx.stroke();

  return canvas;
}

// Generate and save the logo
const canvas = createLogo();
const outputDir = path.join(__dirname, '../public/images/logo');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Save as PNG
const buffer = canvas.toBuffer('image/png');
const outputPath = path.join(outputDir, 'ilis-logo-new.png');
fs.writeFileSync(outputPath, buffer);

console.log(`Logo saved to: ${outputPath}`);
console.log(`Size: ${WIDTH}x${HEIGHT}px`);
