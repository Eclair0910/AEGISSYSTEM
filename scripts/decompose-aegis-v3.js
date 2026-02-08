const fs = require('fs');
const path = require('path');

const svgWidth = 1024;
const svgHeight = 535;

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

  // Parse coordinates from path
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

// Categorize WHITE paths (these are the actual design elements in AEGIS)
// BLACK paths form the background/negative space
const categories = {
  circle: [],     // 円 - Outer circular arc decorations (top and bottom arcs)
  shield: [],     // 盾 - Main shield outline
  cross: [],      // 十字架 - Internal shield design/cross
  text: []        // 文字 - AEGIS text at bottom
};

console.log('\n--- Categorizing WHITE paths (design elements) ---');

paths.forEach((p, index) => {
  // Only process WHITE paths (these are the design elements)
  if (p.fill !== '#FFFFFF') {
    return;
  }

  // Text area: y coordinates mainly between 409-490
  if (p.minY >= 400) {
    categories.text.push(p);
    console.log(`Path ${index}: TEXT (y=${p.minY.toFixed(0)}-${p.maxY.toFixed(0)})`);
    return;
  }

  // Circle: Outer arc decorations at top (y < 145) and bottom (y > 325)
  // These are thin horizontal bands
  if (p.maxY < 145 || p.minY > 325) {
    categories.circle.push(p);
    console.log(`Path ${index}: CIRCLE arc (y=${p.minY.toFixed(0)}-${p.maxY.toFixed(0)}, size=${p.width.toFixed(0)}x${p.height.toFixed(0)})`);
    return;
  }

  // Main shield area (y 125-340)
  // The main shield outline is the large central element
  if (p.height > 180 && p.width > 300 && p.centerY > 200 && p.centerY < 280) {
    // This is the main shield outline
    categories.shield.push(p);
    console.log(`Path ${index}: SHIELD main (size=${p.width.toFixed(0)}x${p.height.toFixed(0)})`);
    return;
  }

  // Internal elements within the shield = cross/internal design
  if (p.minY > 140 && p.maxY < 340) {
    categories.cross.push(p);
    console.log(`Path ${index}: CROSS internal (y=${p.minY.toFixed(0)}-${p.maxY.toFixed(0)}, size=${p.width.toFixed(0)}x${p.height.toFixed(0)})`);
    return;
  }

  // Default: put in shield category
  categories.shield.push(p);
  console.log(`Path ${index}: SHIELD default (y=${p.minY.toFixed(0)}-${p.maxY.toFixed(0)})`);
});

console.log('\n--- Category counts ---');
console.log(`  Circle (円): ${categories.circle.length}`);
console.log(`  Shield (盾): ${categories.shield.length}`);
console.log(`  Cross (十字架): ${categories.cross.length}`);
console.log(`  Text (文字): ${categories.text.length}`);

// Create output directory
const outputDir = '/workspaces/AEGISSystem/public/images/logo/aegis';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create SVG with cyan glow (same style as eagle parts)
function createCyanSVG(pathsArray, filename, description) {
  if (pathsArray.length === 0) {
    console.log(`Skipping ${filename} - no paths`);
    // Create empty placeholder
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
  <!-- ${description} - Empty placeholder -->
</svg>`;
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, svg);
    console.log(`Created: ${filename} (empty placeholder)`);
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

  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, svg);
  console.log(`Created: ${filename} (${pathsArray.length} paths)`);
}

console.log('\n--- Creating SVG files ---');

// Create each category
createCyanSVG(categories.circle, 'circle.svg', 'Circle - Outer Arc Decorations (円)');
createCyanSVG(categories.shield, 'shield.svg', 'Shield - Main Shield Outline (盾)');
createCyanSVG(categories.cross, 'cross.svg', 'Cross - Internal Shield Design (十字架)');
createCyanSVG(categories.text, 'text.svg', 'AEGIS Text (文字)');

// Combined - all white paths (design elements)
const allDesign = [
  ...categories.circle,
  ...categories.shield,
  ...categories.cross,
  ...categories.text
];
createCyanSVG(allDesign, 'combined.svg', 'All AEGIS Parts Combined');

// Create preview HTML
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
      <h3>2. Shield (盾)<br>盾の輪郭</h3>
      <object data="shield.svg" type="image/svg+xml"></object>
    </div>
    <div class="card">
      <h3>3. Cross (十字架)<br>盾内部デザイン</h3>
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
