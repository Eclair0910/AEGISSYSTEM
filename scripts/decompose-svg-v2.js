const fs = require('fs');
const path = require('path');

// Read the original SVG
const svgPath = '/workspaces/AEGISSystem/public/images/logo/unnamed-変換元-jpg.svg';
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Extract all paths with their fill colors
const pathRegex = /<path[^>]*fill="([^"]*)"[^>]*d="([^"]*)"[^>]*\/>/g;
const paths = [];
let match;

while ((match = pathRegex.exec(svgContent)) !== null) {
  const fill = match[1];
  const d = match[2];

  // Parse the path to get bounding box
  const coords = d.match(/[\d.]+/g);
  if (coords && coords.length >= 2) {
    const numbers = coords.map(Number);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    for (let i = 0; i < numbers.length; i += 2) {
      if (i + 1 < numbers.length) {
        minX = Math.min(minX, numbers[i]);
        maxX = Math.max(maxX, numbers[i]);
        minY = Math.min(minY, numbers[i + 1]);
        maxY = Math.max(maxY, numbers[i + 1]);
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

console.log(`Found ${paths.length} paths`);

// Get SVG dimensions
const svgWidth = 962;
const svgHeight = 1024;
const centerX = svgWidth / 2;
const centerY = svgHeight / 2;

// Filter dark paths (the eagle shape is dark on light background)
const darkPaths = paths.filter(p => {
  const rgb = p.fill.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (rgb) {
    const r = parseInt(rgb[1]);
    const g = parseInt(rgb[2]);
    const b = parseInt(rgb[3]);
    // Dark colors (black, dark gray)
    return r < 100 && g < 100 && b < 100;
  }
  return false;
});

console.log(`Dark paths (eagle shape): ${darkPaths.length}`);

// Categorize dark paths by position
const shieldOuterPaths = [];
const shieldInnerPaths = [];
const eagleHeadPaths = [];
const leftWingPaths = [];
const rightWingPaths = [];

darkPaths.forEach(p => {
  const relativeX = p.centerX - centerX;
  const relativeY = p.centerY - centerY;
  const distFromCenter = Math.sqrt(relativeX * relativeX + relativeY * relativeY);

  // Shield outer: paths near the edges of the image
  if (p.minX < 120 || p.maxX > svgWidth - 120 || p.minY < 100 || p.maxY > svgHeight - 100) {
    if (distFromCenter > 300) {
      shieldOuterPaths.push(p);
    } else {
      shieldInnerPaths.push(p);
    }
  }
  // Eagle head: upper-center area (above center, near horizontal center)
  else if (relativeY < -50 && relativeY > -350 && Math.abs(relativeX) < 250) {
    eagleHeadPaths.push(p);
  }
  // Left wing: left side, middle-lower area
  else if (relativeX < -50 && relativeY > -150 && relativeY < 350) {
    leftWingPaths.push(p);
  }
  // Right wing: right side, middle-lower area
  else if (relativeX > 50 && relativeY > -150 && relativeY < 350) {
    rightWingPaths.push(p);
  }
  // Inner shield or other
  else {
    shieldInnerPaths.push(p);
  }
});

console.log(`Shield outer: ${shieldOuterPaths.length}`);
console.log(`Shield inner: ${shieldInnerPaths.length}`);
console.log(`Eagle head: ${eagleHeadPaths.length}`);
console.log(`Left wing: ${leftWingPaths.length}`);
console.log(`Right wing: ${rightWingPaths.length}`);

// Function to create SVG with cyan color
function createSVG(pathsArray, filename, description) {
  if (pathsArray.length === 0) {
    console.log(`Skipping ${filename} - no paths`);
    return;
  }

  // Convert to cyan color
  const combinedPaths = pathsArray.map(p =>
    `<path fill="#4dc9ff" d="${p.d}" />`
  ).join('\n  ');

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
  <!-- Paths: ${pathsArray.length} -->
  <g filter="url(#glow)">
  ${combinedPaths}
  </g>
</svg>`;

  const outputPath = path.join('/workspaces/AEGISSystem/public/images/logo/eagle', filename);
  fs.writeFileSync(outputPath, svg);
  console.log(`Created: ${outputPath}`);
}

// Create output directory
const outputDir = '/workspaces/AEGISSystem/public/images/logo/eagle';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate SVGs for each component
createSVG(shieldOuterPaths, 'shield-outer.svg', 'Shield Outer Frame');
createSVG(shieldInnerPaths, 'shield-inner.svg', 'Shield Inner Frame');
createSVG(eagleHeadPaths, 'eagle-head.svg', 'Eagle Head');
createSVG([...leftWingPaths, ...rightWingPaths], 'wings.svg', 'Wings (both)');

// Combined version
createSVG(darkPaths, 'combined.svg', 'All dark paths (full eagle)');

console.log('\nDone!');
