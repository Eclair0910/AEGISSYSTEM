const fs = require('fs');
const path = require('path');

const svgWidth = 1024;
const svgHeight = 535;
const centerX = 512;

// Read AEGIS.svg
const svgPath = '/workspaces/AEGISSystem/public/images/AEGIS.svg';
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Extract paths with fill colors
const pathRegex = /<path\s+fill="([^"]+)"[^>]*d="\s*([\s\S]*?)"\s*\/>/g;
const paths = [];

let match;
while ((match = pathRegex.exec(svgContent)) !== null) {
  const fill = match[1];
  const d = match[2].replace(/\s+/g, ' ').trim();

  const coords = d.match(/[\d.]+/g);
  if (coords && coords.length >= 4) {
    const numbers = coords.map(Number);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    for (let i = 0; i < numbers.length - 1; i++) {
      const val = numbers[i];
      if (val > 0 && val < 1100) {
        if (i % 2 === 0) {
          minX = Math.min(minX, val);
          maxX = Math.max(maxX, val);
        } else {
          minY = Math.min(minY, val);
          maxY = Math.max(maxY, val);
        }
      }
    }

    paths.push({
      fill,
      d,
      minX, maxX, minY, maxY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      width: maxX - minX,
      height: maxY - minY
    });
  }
}

console.log(`Total paths: ${paths.length}`);

// Categorize WHITE paths
const categories = {
  circle: [],
  shield: [],
  cross: [],
  text: []  // Will be replaced with SVG text
};

paths.forEach((p, index) => {
  if (p.fill !== '#FFFFFF') return;

  // Text area (skip - we'll create text manually)
  if (p.minY >= 400) {
    return;
  }

  // Circle: arc decorations at top/bottom
  if (p.maxY < 145 || p.minY > 325) {
    categories.circle.push(p);
    console.log(`Path ${index}: CIRCLE`);
    return;
  }

  // Main shield area
  if (p.height > 180 && p.width > 300 && p.centerY > 200 && p.centerY < 280) {
    categories.shield.push(p);
    console.log(`Path ${index}: SHIELD main`);
    return;
  }

  // Internal elements - distinguish center cross from left/right shield elements
  if (p.minY > 140 && p.maxY < 340) {
    // Left/right elements go to shield (wings-like shapes)
    // Center elements stay in cross
    const distFromCenter = Math.abs(p.centerX - centerX);

    if (distFromCenter > 60) {
      // Left or right side elements -> shield
      categories.shield.push(p);
      console.log(`Path ${index}: SHIELD (side element, dist=${distFromCenter.toFixed(0)})`);
    } else {
      // Center elements -> cross
      categories.cross.push(p);
      console.log(`Path ${index}: CROSS (center, dist=${distFromCenter.toFixed(0)})`);
    }
    return;
  }

  categories.shield.push(p);
  console.log(`Path ${index}: SHIELD default`);
});

console.log('\n--- Category counts ---');
console.log(`  Circle (円): ${categories.circle.length}`);
console.log(`  Shield (盾): ${categories.shield.length}`);
console.log(`  Cross (十字架): ${categories.cross.length}`);

// Create output directory
const outputDir = '/workspaces/AEGISSystem/public/images/logo/aegis';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create SVG with cyan glow
function createCyanSVG(pathsArray, filename, description) {
  if (pathsArray.length === 0) {
    console.log(`Skipping ${filename} - no paths`);
    return;
  }

  const pathElements = pathsArray.map(p =>
    `    <path fill="#4dc9ff" opacity="0.9" d="${p.d}" />`
  ).join('\n');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- ${description} -->
  <g filter="url(#glow)">
${pathElements}
  </g>
</svg>`;

  fs.writeFileSync(path.join(outputDir, filename), svg);
  console.log(`Created: ${filename} (${pathsArray.length} paths)`);
}

// Create text.svg with actual text elements
function createTextSVG() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <style>
      .aegis-text {
        font-family: 'Arial Black', 'Helvetica Neue', Arial, sans-serif;
        font-weight: 900;
        fill: #4dc9ff;
        letter-spacing: 0.15em;
      }
      .aegis-main {
        font-size: 52px;
      }
      .aegis-sub {
        font-size: 14px;
        letter-spacing: 0.3em;
      }
    </style>
  </defs>
  <!-- AEGIS Text (文字) -->
  <g filter="url(#glow)">
    <!-- Main AEGIS text -->
    <text x="512" y="445" text-anchor="middle" class="aegis-text aegis-main">AEGIS</text>
    <!-- Subtitle -->
    <text x="512" y="485" text-anchor="middle" class="aegis-text aegis-sub">DEFENSE SYSTEM</text>
  </g>
</svg>`;

  fs.writeFileSync(path.join(outputDir, 'text.svg'), svg);
  console.log('Created: text.svg (SVG text elements)');
}

console.log('\n--- Creating SVG files ---');

createCyanSVG(categories.circle, 'circle.svg', 'Circle - Outer Arc Decorations (円)');
createCyanSVG(categories.shield, 'shield.svg', 'Shield - Shield with Side Elements (盾)');
createCyanSVG(categories.cross, 'cross.svg', 'Cross - Central Design (十字架)');
createTextSVG();

// Combined
const allDesign = [
  ...categories.circle,
  ...categories.shield,
  ...categories.cross
];

// Combined with text as paths for visual consistency
const combinedSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <style>
      .aegis-text {
        font-family: 'Arial Black', 'Helvetica Neue', Arial, sans-serif;
        font-weight: 900;
        fill: #4dc9ff;
        letter-spacing: 0.15em;
      }
    </style>
  </defs>
  <!-- All AEGIS Parts Combined -->
  <g filter="url(#glow)">
${allDesign.map(p => `    <path fill="#4dc9ff" opacity="0.9" d="${p.d}" />`).join('\n')}
    <!-- AEGIS Text -->
    <text x="512" y="445" text-anchor="middle" class="aegis-text" style="font-size: 52px;">AEGIS</text>
    <text x="512" y="485" text-anchor="middle" class="aegis-text" style="font-size: 14px; letter-spacing: 0.3em;">DEFENSE SYSTEM</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(outputDir, 'combined.svg'), combinedSvg);
console.log(`Created: combined.svg (${allDesign.length} paths + text)`);

// Preview HTML
const previewHtml = `<!DOCTYPE html>
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
      max-width: 1200px;
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
    .card object {
      width: 100%;
      height: 120px;
      object-fit: contain;
    }
    .full-width {
      grid-column: 1 / -1;
    }
    .full-width object {
      height: 200px;
    }
  </style>
</head>
<body>
  <h1>AEGIS Logo Parts - 分解版</h1>

  <h2>パーツ一覧</h2>
  <div class="grid">
    <div class="card">
      <h3>1. Circle (円)<br>外周弧装飾</h3>
      <object data="circle.svg" type="image/svg+xml"></object>
    </div>
    <div class="card">
      <h3>2. Shield (盾)<br>盾と左右要素</h3>
      <object data="shield.svg" type="image/svg+xml"></object>
    </div>
    <div class="card">
      <h3>3. Cross (十字架)<br>中央デザイン</h3>
      <object data="cross.svg" type="image/svg+xml"></object>
    </div>
    <div class="card">
      <h3>4. Text (文字)<br>AEGIS</h3>
      <object data="text.svg" type="image/svg+xml"></object>
    </div>
    <div class="card full-width">
      <h3>Combined (全パーツ結合)</h3>
      <object data="combined.svg" type="image/svg+xml"></object>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'preview.html'), previewHtml);
console.log('Created: preview.html');

console.log('\nDone!');
