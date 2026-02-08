const fs = require('fs');
const path = require('path');

// Read the original SVG
const svgPath = '/workspaces/AEGISSystem/public/images/logo/file.svg';
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Extract paths - this SVG has multi-line path data
const pathRegex = /<path[^>]*d="\s*([\s\S]*?)"\s*\/>/g;
const fillRegex = /fill="([^"]*)"/;

const paths = [];
let match;

// Split by path tags
const pathTags = svgContent.match(/<path[\s\S]*?\/>/g) || [];

pathTags.forEach((tag, index) => {
  const fillMatch = tag.match(fillRegex);
  const dMatch = tag.match(/d="\s*([\s\S]*?)"/);

  if (dMatch) {
    const fill = fillMatch ? fillMatch[1] : '#000000';
    const d = dMatch[1].replace(/\s+/g, ' ').trim();

    // Parse coordinates to get bounding box
    const coords = d.match(/[\d.]+/g);
    if (coords && coords.length >= 4) {
      const numbers = coords.map(Number);
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

      for (let i = 0; i < numbers.length - 1; i++) {
        const val = numbers[i];
        if (val > 0 && val < 1000) {
          // Assume alternating x,y
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
        index,
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
});

console.log(`Found ${paths.length} paths`);

const svgWidth = 962;
const svgHeight = 1024;
const centerX = svgWidth / 2;
const centerY = svgHeight / 2;

// Categorize paths
const shieldOuterPaths = [];
const shieldInnerPaths = [];
const eagleHeadPaths = [];
const wingsPaths = [];
const bodyPaths = [];
const backgroundPath = null;

paths.forEach(p => {
  // Skip the main background/outline path (covers entire image)
  if (p.width > 900 && p.height > 900) {
    console.log(`Background path ${p.index}: ${p.width}x${p.height}`);
    return;
  }

  const relX = p.centerX - centerX;
  const relY = p.centerY - centerY;
  const dist = Math.sqrt(relX * relX + relY * relY);

  // Shield detection: paths near the outer edge
  if (p.minY < 150 || p.maxY > 900 || p.minX < 150 || p.maxX > 800) {
    if (p.width > 200 || p.height > 200) {
      shieldOuterPaths.push(p);
    } else {
      shieldInnerPaths.push(p);
    }
  }
  // Eagle head: upper center
  else if (relY < -100 && Math.abs(relX) < 300) {
    eagleHeadPaths.push(p);
  }
  // Wings: lower left and right sides
  else if (Math.abs(relX) > 100 && relY > -200) {
    wingsPaths.push(p);
  }
  // Body/center details
  else {
    bodyPaths.push(p);
  }
});

console.log(`Shield outer: ${shieldOuterPaths.length}`);
console.log(`Shield inner: ${shieldInnerPaths.length}`);
console.log(`Eagle head: ${eagleHeadPaths.length}`);
console.log(`Wings: ${wingsPaths.length}`);
console.log(`Body: ${bodyPaths.length}`);

// Function to create clean SVG with cyan color and glow
function createSVG(pathsArray, filename, description, extraPaths = '') {
  if (pathsArray.length === 0 && !extraPaths) {
    console.log(`Skipping ${filename} - no paths`);
    return;
  }

  const pathElements = pathsArray.map(p =>
    `  <path fill="#4dc9ff" d="${p.d}" />`
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
${extraPaths}
  </g>
</svg>`;

  const outputPath = path.join('/workspaces/AEGISSystem/public/images/logo/eagle', filename);
  fs.writeFileSync(outputPath, svg);
  console.log(`Created: ${outputPath}`);
}

// Create clean shield frame (補完付き)
function createShieldSVG() {
  // Create a complete shield outline path (補完)
  const shieldPath = `
  <!-- 補完された盾の外枠 -->
  <path fill="none" stroke="#4dc9ff" stroke-width="8" stroke-linejoin="round"
    d="M 481 25
       C 550 25, 700 50, 780 80
       C 850 110, 900 180, 910 280
       C 920 400, 900 550, 850 680
       C 800 800, 700 900, 481 1000
       C 262 900, 162 800, 112 680
       C 62 550, 42 400, 52 280
       C 62 180, 112 110, 182 80
       C 262 50, 412 25, 481 25
       Z" />`;

  const shieldInnerPath = `
  <!-- 補完された盾の内枠 -->
  <path fill="none" stroke="#4dc9ff" stroke-width="3" stroke-linejoin="round"
    d="M 481 70
       C 540 70, 670 90, 740 115
       C 800 140, 845 200, 855 290
       C 865 400, 850 530, 805 650
       C 760 760, 670 850, 481 940
       C 292 850, 202 760, 157 650
       C 112 530, 97 400, 107 290
       C 117 200, 162 140, 222 115
       C 292 90, 422 70, 481 70
       Z" />`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <g filter="url(#glow)">
${shieldPath}
${shieldInnerPath}
  </g>
</svg>`;

  fs.writeFileSync('/workspaces/AEGISSystem/public/images/logo/eagle/shield-outer.svg', svg);
  console.log('Created: shield-outer.svg (補完付き)');
}

// Create output directory
const outputDir = '/workspaces/AEGISSystem/public/images/logo/eagle';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate SVGs
createShieldSVG();
createSVG(eagleHeadPaths, 'eagle-head.svg', 'Eagle Head');
createSVG(wingsPaths, 'wings.svg', 'Wings');
createSVG(bodyPaths, 'eagle-body.svg', 'Eagle Body/Details');

// Combined (all dark paths except background)
const allPaths = [...shieldOuterPaths, ...shieldInnerPaths, ...eagleHeadPaths, ...wingsPaths, ...bodyPaths];
createSVG(allPaths, 'combined.svg', 'All eagle parts combined');

// Also extract and show the actual path data for debugging
console.log('\n--- Path Analysis ---');
paths.slice(0, 10).forEach(p => {
  console.log(`Path ${p.index}: center(${Math.round(p.centerX)}, ${Math.round(p.centerY)}) size(${Math.round(p.width)}x${Math.round(p.height)})`);
});

console.log('\nDone!');
