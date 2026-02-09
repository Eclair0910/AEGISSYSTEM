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
const widthMatch = svgContent.match(/width="(\d+)"/);
const heightMatch = svgContent.match(/height="(\d+)"/);
const svgWidth = widthMatch ? parseInt(widthMatch[1]) : 962;
const svgHeight = heightMatch ? parseInt(heightMatch[1]) : 1024;
const centerX = svgWidth / 2;
const centerY = svgHeight / 2;

console.log(`SVG dimensions: ${svgWidth}x${svgHeight}, center: (${centerX}, ${centerY})`);

// Analyze color distribution
const colorCounts = {};
paths.forEach(p => {
  colorCounts[p.fill] = (colorCounts[p.fill] || 0) + 1;
});
console.log('Color distribution:', colorCounts);

// Group paths by region and color
// The eagle logo typically has:
// - Outer shield frame (around the edges)
// - Inner shield frame
// - Eagle head (center-top area)
// - Wings (center-left and center-right, lower area)

const cyanPaths = paths.filter(p => {
  const rgb = p.fill.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (rgb) {
    const r = parseInt(rgb[1]);
    const g = parseInt(rgb[2]);
    const b = parseInt(rgb[3]);
    // Cyan-ish colors (high blue, medium-high green, low-medium red)
    return b > 150 && g > 100 && r < 150;
  }
  return false;
});

const darkPaths = paths.filter(p => {
  const rgb = p.fill.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (rgb) {
    const r = parseInt(rgb[1]);
    const g = parseInt(rgb[2]);
    const b = parseInt(rgb[3]);
    return r < 50 && g < 50 && b < 50;
  }
  return false;
});

console.log(`Cyan paths: ${cyanPaths.length}, Dark paths: ${darkPaths.length}`);

// Categorize cyan paths by position
const shieldOuterPaths = [];
const shieldInnerPaths = [];
const eagleHeadPaths = [];
const wingsPaths = [];
const otherPaths = [];

cyanPaths.forEach(p => {
  const distFromCenter = Math.sqrt(Math.pow(p.centerX - centerX, 2) + Math.pow(p.centerY - centerY, 2));
  const relativeX = p.centerX - centerX;
  const relativeY = p.centerY - centerY;

  // Shield outer: near the edges
  if (distFromCenter > 350 || p.minX < 100 || p.maxX > svgWidth - 100 || p.minY < 80 || p.maxY > svgHeight - 80) {
    shieldOuterPaths.push(p);
  }
  // Shield inner: slightly inside the outer
  else if (distFromCenter > 280 && distFromCenter <= 350) {
    shieldInnerPaths.push(p);
  }
  // Eagle head: upper-center area
  else if (relativeY < 0 && Math.abs(relativeX) < 200) {
    eagleHeadPaths.push(p);
  }
  // Wings: lower sides
  else if (relativeY > -100 && relativeY < 300) {
    wingsPaths.push(p);
  }
  else {
    otherPaths.push(p);
  }
});

console.log(`Shield outer: ${shieldOuterPaths.length}, Shield inner: ${shieldInnerPaths.length}`);
console.log(`Eagle head: ${eagleHeadPaths.length}, Wings: ${wingsPaths.length}, Other: ${otherPaths.length}`);

// Function to create SVG from paths
function createSVG(pathsArray, filename, description) {
  if (pathsArray.length === 0) {
    console.log(`Skipping ${filename} - no paths`);
    return;
  }

  // Combine all path data
  const combinedPaths = pathsArray.map(p =>
    `<path fill="${p.fill}" stroke="${p.fill}" stroke-width="0.5" d="${p.d}" />`
  ).join('\n  ');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <!-- ${description} -->
  <!-- Paths: ${pathsArray.length} -->
  ${combinedPaths}
</svg>`;

  const outputPath = path.join('/workspaces/AEGISSystem/public/images/logo/eagle', filename);
  fs.writeFileSync(outputPath, svg);
  console.log(`Created: ${outputPath} (${pathsArray.length} paths)`);
}

// Create output directory
const outputDir = '/workspaces/AEGISSystem/public/images/logo/eagle';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate SVGs for each component
createSVG(shieldOuterPaths, 'shield-outer-traced.svg', 'Shield Outer Frame');
createSVG(shieldInnerPaths, 'shield-inner-traced.svg', 'Shield Inner Frame');
createSVG(eagleHeadPaths, 'eagle-head-traced.svg', 'Eagle Head');
createSVG(wingsPaths, 'wings-traced.svg', 'Wings');

// Also create a combined version with all cyan paths
createSVG(cyanPaths, 'combined-traced.svg', 'All cyan paths combined');

// Create version with dark (background) paths for reference
createSVG(darkPaths.slice(0, 100), 'background-sample.svg', 'Background paths sample');

console.log('\nDone! Check the eagle/ directory for the decomposed SVGs.');
