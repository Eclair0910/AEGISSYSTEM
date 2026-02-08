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

// Debug: Print path info
paths.forEach((p, i) => {
  console.log(`Path ${i}: fill=${p.fill}, center=(${p.centerX.toFixed(0)}, ${p.centerY.toFixed(0)}), size=(${p.width.toFixed(0)}x${p.height.toFixed(0)}), y=${p.minY.toFixed(0)}-${p.maxY.toFixed(0)}`);
});

// Categorize BLACK paths (these are the actual design elements)
// White paths are just internal details
const categories = {
  circle: [],     // 円 - Outer circular arc decorations
  shield: [],     // 盾 - Shield outline
  cross: [],      // 十字架 - Cross/internal shield design
  text: []        // 文字 - AEGIS text
};

console.log('\n--- Categorizing paths ---');

paths.forEach((p, index) => {
  // Skip background (first path that covers entire canvas)
  if (p.width > 900 && p.height > 400) {
    console.log(`Path ${index}: BACKGROUND (skipped)`);
    return;
  }

  // Only process BLACK paths (these are the design elements)
  // White paths are fill/detail within the black shapes
  if (p.fill !== '#000000') {
    console.log(`Path ${index}: WHITE detail (skipped for main categorization)`);
    return;
  }

  // Text area: y coordinates mainly between 409-490
  if (p.minY >= 400) {
    categories.text.push(p);
    console.log(`Path ${index}: TEXT`);
    return;
  }

  // Main design area (y roughly 77-390)
  // Need to distinguish: circle (arcs), shield (main outline), cross (internal)

  // Circle: Outer decorative arcs
  // These are typically thin elements at the top/bottom edges
  // Check for paths that span the width but are thin (small height)
  // Or paths that are clearly arc decorations (y < 100 or y > 340)

  if ((p.minY < 100 && p.maxY < 145) || (p.minY > 325 && p.maxY < 400)) {
    // These are arc decorations at top or bottom
    categories.circle.push(p);
    console.log(`Path ${index}: CIRCLE (arc decoration)`);
    return;
  }

  // Main shield area (y 125-342)
  // The shield contains the cross/internal design
  // Large path that forms the main shield shape
  if (p.height > 150 && p.width > 200 && p.centerY > 150 && p.centerY < 300) {
    // This is likely the main shield with internal cross design
    // We'll put it in cross category as it contains the internal design
    categories.cross.push(p);
    console.log(`Path ${index}: CROSS (shield interior)`);
    return;
  }

  // Smaller elements in the shield area could be shield outline or details
  categories.shield.push(p);
  console.log(`Path ${index}: SHIELD (outline/detail)`);
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
// For AEGIS, the BLACK paths are the design, so we use them as cyan fills
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

  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, svg);
  console.log(`Created: ${filename} (${pathsArray.length} paths)`);
}

console.log('\n--- Creating SVG files ---');

// Create each category
createCyanSVG(categories.circle, 'circle.svg', 'Circle - Outer Arc Decorations (円)');
createCyanSVG(categories.shield, 'shield.svg', 'Shield - Shield Outline (盾)');
createCyanSVG(categories.cross, 'cross.svg', 'Cross - Internal Shield Design (十字架)');
createCyanSVG(categories.text, 'text.svg', 'AEGIS Text (文字)');

// Combined - all black paths (design elements)
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
