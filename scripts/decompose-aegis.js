const fs = require('fs');
const path = require('path');

const svgWidth = 1024;
const svgHeight = 535;
const centerX = svgWidth / 2;  // 512
const centerY = svgHeight / 2; // 267.5

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

// Categorize paths
// Based on analysis:
// - Text (AEGIS) is at y ~409-490 range
// - Shield/Eagle design is at y ~90-400 range
// - Circle outer decorations might be on edges
// - Cross would be in the center of shield

const categories = {
  circle: [],     // 円 - Circular border elements
  shield: [],     // 盾 - Main shield shape
  cross: [],      // 十字架 - Cross inside shield
  text: []        // 文字 - AEGIS text
};

// Skip background path (first one covering entire canvas)
paths.forEach((p, index) => {
  // Skip background
  if (p.width > 900 && p.height > 400) {
    console.log(`Skipping background path ${index}`);
    return;
  }

  // Text area: y coordinates mainly in 400-490 range
  if (p.minY >= 400 && p.maxY <= 500) {
    categories.text.push(p);
    return;
  }

  // If path includes text area coordinates (mixed content)
  if (p.centerY > 420) {
    categories.text.push(p);
    return;
  }

  // Shield/Eagle area: main design
  // The inner design includes shield outline, eagle, decorations

  // Circular outer elements - check for paths that form the outer ring
  // These would be at the extreme edges of the design
  const distFromCenter = Math.sqrt(
    Math.pow(p.centerX - 514, 2) + Math.pow(p.centerY - 230, 2)
  );

  // If it's a small decorative element near edges
  if (distFromCenter > 150 && p.width < 100 && p.height < 100) {
    categories.circle.push(p);
    return;
  }

  // Main shield area (eagle design with shield)
  categories.shield.push(p);
});

console.log('\nCategories:');
console.log(`  Circle (円): ${categories.circle.length}`);
console.log(`  Shield (盾): ${categories.shield.length}`);
console.log(`  Cross (十字架): ${categories.cross.length}`);
console.log(`  Text (文字): ${categories.text.length}`);

// Create output directory
const outputDir = '/workspaces/AEGISSystem/public/images/logo/aegis';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// SVG template with glow effect (inverted style)
function createInvertedSVG(pathsArray, filename, description) {
  if (pathsArray.length === 0) {
    console.log(`Skipping ${filename} - no paths`);
    return;
  }

  // Create mask paths (black on white for cutout effect)
  const maskPaths = pathsArray
    .filter(p => p.fill === '#FFFFFF')
    .map(p => `      <path fill="black" d="${p.d}" />`)
    .join('\n');

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
    <mask id="cutout-mask">
      <rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="white"/>
${maskPaths}
    </mask>
  </defs>
  <!-- ${description} -->
  <g filter="url(#glow)">
    <rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="#4dc9ff" mask="url(#cutout-mask)" opacity="0.9"/>
  </g>
</svg>`;

  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, svg);
  console.log(`Created: ${filename} (${pathsArray.filter(p => p.fill === '#FFFFFF').length} white paths)`);
}

// Alternative: Create SVG preserving original black/white colors
function createOriginalSVG(pathsArray, filename, description) {
  if (pathsArray.length === 0) {
    console.log(`Skipping ${filename} - no paths`);
    return;
  }

  const pathElements = pathsArray.map(p =>
    `  <path fill="${p.fill}" opacity="1.000000" stroke="none" d="${p.d}" />`
  ).join('\n');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
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

// Re-analyze paths more carefully for AEGIS structure
// Looking at the paths, the design appears to be:
// - Outer ring decorations (small elements at edges)
// - Main shield with eagle inside
// - Text "AEGIS" at bottom

// Let's recategorize based on detailed analysis
const redesignedCategories = {
  circle: [],     // 円 - Outer decorative ring/frame
  shield: [],     // 盾 - Shield outline + eagle design
  cross: [],      // 十字架 - Internal cross elements
  text: []        // 文字 - AEGIS letters
};

// Looking at y-coordinate ranges from the file:
// Y < 100: Outer decorations (arcs at top)
// 100 < Y < 400: Main shield and eagle
// Y > 400: Text area

paths.forEach((p, index) => {
  // Skip background (fills entire canvas)
  if (p.width > 900 && p.height > 400) return;

  // White paths are the actual design elements
  if (p.fill !== '#FFFFFF') {
    // Black paths inside the design - could be negative space
    // Check if it's within shield area
    if (p.minY >= 100 && p.maxY <= 400 && p.fill === '#000000') {
      // Internal black element - could be part of shield detail
      redesignedCategories.shield.push(p);
    }
    return;
  }

  // Text: y-coordinates mainly between 409-490
  if (p.minY >= 400) {
    redesignedCategories.text.push(p);
    return;
  }

  // Top arc decorations (outer circle): paths that are at the very top/edges
  if (p.maxY < 130 || p.minY > 340) {
    redesignedCategories.circle.push(p);
    return;
  }

  // Main shield and eagle design
  redesignedCategories.shield.push(p);
});

console.log('\nRedesigned Categories:');
console.log(`  Circle (円): ${redesignedCategories.circle.length}`);
console.log(`  Shield (盾): ${redesignedCategories.shield.length}`);
console.log(`  Cross (十字架): ${redesignedCategories.cross.length}`);
console.log(`  Text (文字): ${redesignedCategories.text.length}`);

// Looking at the original file analysis, the AEGIS design seems to be:
// - A shield/badge with an eagle inside
// - Circular arc decorations at top and bottom
// - Text "AEGIS" at the bottom

// Let's create SVGs with cyan glow effect (like eagle parts)
// Use inverted style: cyan background with shape cutouts

console.log('\n--- Creating Inverted Style SVGs ---');

// Circle - Outer decorative elements
createInvertedSVG(redesignedCategories.circle, 'circle.svg', 'Circle - Outer Ring Decorations (円)');

// Shield - Main shield with eagle
createInvertedSVG(redesignedCategories.shield, 'shield.svg', 'Shield with Eagle Design (盾)');

// Text - AEGIS lettering
createInvertedSVG(redesignedCategories.text, 'text.svg', 'AEGIS Text (文字)');

// Combined - All parts together
const allParts = [
  ...redesignedCategories.circle,
  ...redesignedCategories.shield,
  ...redesignedCategories.text
];
createInvertedSVG(allParts, 'combined.svg', 'All AEGIS Parts Combined');

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
      <h3>1. Circle (円)<br>外周装飾</h3>
      <object data="circle.svg" type="image/svg+xml"></object>
    </div>
    <div class="card">
      <h3>2. Shield (盾)<br>盾とイーグル</h3>
      <object data="shield.svg" type="image/svg+xml"></object>
    </div>
    <div class="card">
      <h3>3. Cross (十字架)<br>内部十字</h3>
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
