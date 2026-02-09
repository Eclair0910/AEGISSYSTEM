const fs = require('fs');
const path = require('path');

// Output directory
const outputDir = '/workspaces/AEGISSystem/public/images/logo/aegis';

// SVG dimensions - focused on logo area, larger scale
const svgWidth = 400;
const svgHeight = 400;
const centerX = 200;
const centerY = 180;

// Glow filter definition
const glowFilter = `
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>`;

// Helper function to create arc path
function describeArc(cx, cy, r, startAngle, endAngle, strokeWidth = 3) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  // Create arc with thickness using two arcs
  const innerR = r - strokeWidth / 2;
  const outerR = r + strokeWidth / 2;

  const outerStart = polarToCartesian(cx, cy, outerR, endAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, startAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);

  return [
    "M", outerStart.x, outerStart.y,
    "A", outerR, outerR, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
    "L", innerStart.x, innerStart.y,
    "A", innerR, innerR, 0, largeArcFlag, 1, innerEnd.x, innerEnd.y,
    "Z"
  ].join(" ");
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = (angleDeg - 90) * Math.PI / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  };
}

// Create circle.svg - Outer arc decorations
function createCircleSVG() {
  const arcs = [];

  // Top arcs (outer ring decorations)
  // Main arc segments at top
  arcs.push(describeArc(centerX, centerY, 140, -70, -30, 4));
  arcs.push(describeArc(centerX, centerY, 140, -150, -110, 4));
  arcs.push(describeArc(centerX, centerY, 135, -65, -35, 2));
  arcs.push(describeArc(centerX, centerY, 135, -145, -115, 2));

  // Bottom arcs
  arcs.push(describeArc(centerX, centerY, 140, 30, 70, 4));
  arcs.push(describeArc(centerX, centerY, 140, 110, 150, 4));
  arcs.push(describeArc(centerX, centerY, 135, 35, 65, 2));
  arcs.push(describeArc(centerX, centerY, 135, 115, 145, 2));

  // Outer decorative thin arcs
  arcs.push(describeArc(centerX, centerY, 148, -60, -40, 1.5));
  arcs.push(describeArc(centerX, centerY, 148, -140, -120, 1.5));
  arcs.push(describeArc(centerX, centerY, 148, 40, 60, 1.5));
  arcs.push(describeArc(centerX, centerY, 148, 120, 140, 1.5));

  const paths = arcs.map(d => `    <path fill="#4dc9ff" opacity="0.9" d="${d}" />`).join('\n');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
${glowFilter}
  <!-- Circle - Outer Arc Decorations (円) -->
  <g filter="url(#glow)">
${paths}
  </g>
</svg>`;

  fs.writeFileSync(path.join(outputDir, 'circle.svg'), svg);
  console.log('Created: circle.svg');
}

// Create shield.svg - Main shield shape
function createShieldSVG() {
  const paths = [];

  // Shield outer ring
  paths.push(describeArc(centerX, centerY, 120, -160, 160, 6));

  // Shield inner decorative rings
  paths.push(describeArc(centerX, centerY, 110, -150, 150, 3));
  paths.push(describeArc(centerX, centerY, 100, -140, 140, 2));

  // Side accent arcs (left)
  paths.push(describeArc(centerX, centerY, 125, -175, -165, 3));
  paths.push(describeArc(centerX, centerY, 115, -178, -162, 2));

  // Side accent arcs (right)
  paths.push(describeArc(centerX, centerY, 125, 165, 175, 3));
  paths.push(describeArc(centerX, centerY, 115, 162, 178, 2));

  // Bottom shield point extensions
  const bottomY = centerY + 130;
  paths.push(`M ${centerX - 8} ${bottomY - 20} L ${centerX} ${bottomY + 10} L ${centerX + 8} ${bottomY - 20} Z`);

  const pathElements = paths.map(d => `    <path fill="#4dc9ff" opacity="0.9" d="${d}" />`).join('\n');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
${glowFilter}
  <!-- Shield - Main Shield Shape (盾) -->
  <g filter="url(#glow)">
${pathElements}
  </g>
</svg>`;

  fs.writeFileSync(path.join(outputDir, 'shield.svg'), svg);
  console.log('Created: shield.svg');
}

// Create cross.svg - Central cross design
function createCrossSVG() {
  const cx = centerX;
  const cy = centerY;

  // Cross paths - vertical and horizontal bars with decorations
  const paths = [];

  // Vertical bar
  paths.push(`M ${cx - 4} ${cy - 80} L ${cx + 4} ${cy - 80} L ${cx + 4} ${cy + 80} L ${cx - 4} ${cy + 80} Z`);

  // Horizontal bar
  paths.push(`M ${cx - 70} ${cy - 4} L ${cx + 70} ${cy - 4} L ${cx + 70} ${cy + 4} L ${cx - 70} ${cy + 4} Z`);

  // Center diamond
  paths.push(`M ${cx} ${cy - 15} L ${cx + 15} ${cy} L ${cx} ${cy + 15} L ${cx - 15} ${cy} Z`);

  // Arrow tips
  // Top
  paths.push(`M ${cx - 8} ${cy - 75} L ${cx} ${cy - 90} L ${cx + 8} ${cy - 75} Z`);
  // Bottom
  paths.push(`M ${cx - 8} ${cy + 75} L ${cx} ${cy + 90} L ${cx + 8} ${cy + 75} Z`);
  // Left
  paths.push(`M ${cx - 75} ${cy - 8} L ${cx - 90} ${cy} L ${cx - 75} ${cy + 8} Z`);
  // Right
  paths.push(`M ${cx + 75} ${cy - 8} L ${cx + 90} ${cy} L ${cx + 75} ${cy + 8} Z`);

  // Decorative corner elements
  const cornerDist = 45;
  const cornerSize = 12;
  // Top-left
  paths.push(`M ${cx - cornerDist} ${cy - cornerDist - cornerSize} L ${cx - cornerDist + cornerSize} ${cy - cornerDist} L ${cx - cornerDist} ${cy - cornerDist + cornerSize} L ${cx - cornerDist - cornerSize} ${cy - cornerDist} Z`);
  // Top-right
  paths.push(`M ${cx + cornerDist} ${cy - cornerDist - cornerSize} L ${cx + cornerDist + cornerSize} ${cy - cornerDist} L ${cx + cornerDist} ${cy - cornerDist + cornerSize} L ${cx + cornerDist - cornerSize} ${cy - cornerDist} Z`);
  // Bottom-left
  paths.push(`M ${cx - cornerDist} ${cy + cornerDist - cornerSize} L ${cx - cornerDist + cornerSize} ${cy + cornerDist} L ${cx - cornerDist} ${cy + cornerDist + cornerSize} L ${cx - cornerDist - cornerSize} ${cy + cornerDist} Z`);
  // Bottom-right
  paths.push(`M ${cx + cornerDist} ${cy + cornerDist - cornerSize} L ${cx + cornerDist + cornerSize} ${cy + cornerDist} L ${cx + cornerDist} ${cy + cornerDist + cornerSize} L ${cx + cornerDist - cornerSize} ${cy + cornerDist} Z`);

  const pathElements = paths.map(d => `    <path fill="#4dc9ff" opacity="0.9" d="${d}" />`).join('\n');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
${glowFilter}
  <!-- Cross - Central Design (十字架) -->
  <g filter="url(#glow)">
${pathElements}
  </g>
</svg>`;

  fs.writeFileSync(path.join(outputDir, 'cross.svg'), svg);
  console.log('Created: cross.svg');
}

// Create text.svg using opentype.js
async function createTextSVG() {
  const opentype = require('opentype.js');

  const fontBlack = opentype.loadSync('/workspaces/AEGISSystem/fonts/Orbitron/static/Orbitron-Black.ttf');
  const fontBold = opentype.loadSync('/workspaces/AEGISSystem/fonts/Orbitron/static/Orbitron-Bold.ttf');

  // Main text: A.E.G.I.S.
  const mainText = 'A.E.G.I.S.';
  const mainFontSize = 28;
  const mainY = 330;

  // Subtitle: Performance Monitor
  const subText = 'Performance Monitor';
  const subFontSize = 9;
  const subY = 355;

  // Create path for main text
  const mainPath = fontBlack.getPath(mainText, 0, 0, mainFontSize);
  const mainBBox = mainPath.getBoundingBox();
  const mainWidth = mainBBox.x2 - mainBBox.x1;
  const mainX = centerX - mainWidth / 2;
  const mainPathCentered = fontBlack.getPath(mainText, mainX, mainY, mainFontSize);
  const mainPathD = mainPathCentered.toPathData(2);

  // Create path for subtitle
  const subPath = fontBold.getPath(subText, 0, 0, subFontSize);
  const subBBox = subPath.getBoundingBox();
  const subWidth = subBBox.x2 - subBBox.x1;
  const subX = centerX - subWidth / 2;
  const subPathCentered = fontBold.getPath(subText, subX, subY, subFontSize);
  const subPathD = subPathCentered.toPathData(2);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
${glowFilter}
  <!-- AEGIS Text (文字) - Orbitron font -->
  <g filter="url(#glow)">
    <path fill="#4dc9ff" opacity="0.9" d="${mainPathD}" />
    <path fill="#4dc9ff" opacity="0.9" d="${subPathD}" />
  </g>
</svg>`;

  fs.writeFileSync(path.join(outputDir, 'text.svg'), svg);
  console.log('Created: text.svg');
}

// Create combined.svg
async function createCombinedSVG() {
  // Read all parts
  const circleSvg = fs.readFileSync(path.join(outputDir, 'circle.svg'), 'utf-8');
  const shieldSvg = fs.readFileSync(path.join(outputDir, 'shield.svg'), 'utf-8');
  const crossSvg = fs.readFileSync(path.join(outputDir, 'cross.svg'), 'utf-8');
  const textSvg = fs.readFileSync(path.join(outputDir, 'text.svg'), 'utf-8');

  // Extract paths
  function extractPaths(svgContent) {
    const pathRegex = /<path[^>]*\/>/g;
    return svgContent.match(pathRegex) || [];
  }

  const circlePaths = extractPaths(circleSvg);
  const shieldPaths = extractPaths(shieldSvg);
  const crossPaths = extractPaths(crossSvg);
  const textPaths = extractPaths(textSvg);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
${glowFilter}
  <!-- All AEGIS Parts Combined -->
  <g filter="url(#glow)">
    <!-- Circle -->
${circlePaths.map(p => '    ' + p).join('\n')}
    <!-- Shield -->
${shieldPaths.map(p => '    ' + p).join('\n')}
    <!-- Cross -->
${crossPaths.map(p => '    ' + p).join('\n')}
    <!-- Text -->
${textPaths.map(p => '    ' + p).join('\n')}
  </g>
</svg>`;

  fs.writeFileSync(path.join(outputDir, 'combined.svg'), svg);
  console.log('Created: combined.svg');
}

// Create preview HTML
function createPreviewHTML() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>AEGIS Logo Parts Preview</title>
  <style>
    body {
      background: #0a0a1a;
      color: #4dc9ff;
      font-family: monospace;
      padding: 20px;
    }
    h1, h2 { text-align: center; }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .card {
      background: #111;
      border: 1px solid #4dc9ff33;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    .card h3 {
      margin: 0 0 10px 0;
      font-size: 12px;
    }
    .card object, .card img {
      width: 100%;
      height: 200px;
      object-fit: contain;
    }
    .full-width {
      grid-column: 1 / -1;
    }
    .full-width object, .full-width img {
      height: 350px;
    }
  </style>
</head>
<body>
  <h1>AEGIS Logo Parts - 分解版 (大きいサイズ)</h1>

  <h2>パーツ一覧</h2>
  <div class="grid">
    <div class="card">
      <h3>1. Circle (円)<br>外周弧装飾</h3>
      <object data="circle.svg" type="image/svg+xml"></object>
    </div>
    <div class="card">
      <h3>2. Shield (盾)<br>盾の輪郭</h3>
      <object data="shield.svg" type="image/svg+xml"></object>
    </div>
    <div class="card">
      <h3>3. Cross (十字架)<br>中央デザイン</h3>
      <object data="cross.svg" type="image/svg+xml"></object>
    </div>
    <div class="card">
      <h3>4. Text (文字)<br>A.E.G.I.S.</h3>
      <object data="text.svg" type="image/svg+xml"></object>
    </div>
    <div class="card full-width">
      <h3>Combined (全パーツ結合)</h3>
      <object data="combined.svg" type="image/svg+xml"></object>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, 'preview.html'), html);
  console.log('Created: preview.html');
}

// Main execution
async function main() {
  console.log('Creating AEGIS SVG parts (larger size, calculated arcs)...\n');

  createCircleSVG();
  createShieldSVG();
  createCrossSVG();
  await createTextSVG();
  await createCombinedSVG();
  createPreviewHTML();

  console.log('\nDone! SVG size: ' + svgWidth + 'x' + svgHeight);
}

main().catch(console.error);
