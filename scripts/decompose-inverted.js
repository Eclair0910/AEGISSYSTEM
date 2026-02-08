const fs = require('fs');
const path = require('path');

const svgWidth = 962;
const svgHeight = 1024;
const centerX = svgWidth / 2;
const centerY = svgHeight / 2;

// Read original file.svg to extract paths
const svgPath = '/workspaces/AEGISSystem/public/images/logo/file.svg';
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Extract paths
const pathTags = svgContent.match(/<path[\s\S]*?\/>/g) || [];
const paths = [];

pathTags.forEach((tag, index) => {
  const dMatch = tag.match(/d="\s*([\s\S]*?)"/);
  if (dMatch) {
    const d = dMatch[1].replace(/\s+/g, ' ').trim();

    // Parse coordinates
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
        index,
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

console.log(`Total paths: ${paths.length}`);

// Skip background path and categorize
const categories = {
  shieldOuter: [],
  shieldInner: [],
  eagleHead: [],
  wingsLeft: [],
  wingsRight: [],
  body: []
};

paths.forEach(p => {
  // Skip background
  if (p.width > 900 && p.height > 900) return;

  const relX = p.centerX - centerX;
  const relY = p.centerY - centerY;

  // Shield outer: paths at the very edge (corners, top/bottom edges)
  if (p.minY < 60 || p.maxY > 980 || p.minX < 80 || p.maxX > 880) {
    if (p.height > 100 || p.width > 100) {
      categories.shieldOuter.push(p);
    } else {
      categories.shieldInner.push(p);
    }
  }
  // Eagle head: upper center (y < 450, near center x)
  else if (p.centerY < 450 && Math.abs(relX) < 350) {
    categories.eagleHead.push(p);
  }
  // Left wing: left side, lower half
  else if (relX < -80 && p.centerY > 400) {
    categories.wingsLeft.push(p);
  }
  // Right wing: right side, lower half
  else if (relX > 80 && p.centerY > 400) {
    categories.wingsRight.push(p);
  }
  // Body/center
  else {
    categories.body.push(p);
  }
});

console.log('Categories:');
console.log(`  Shield Outer: ${categories.shieldOuter.length}`);
console.log(`  Shield Inner: ${categories.shieldInner.length}`);
console.log(`  Eagle Head: ${categories.eagleHead.length}`);
console.log(`  Wings Left: ${categories.wingsLeft.length}`);
console.log(`  Wings Right: ${categories.wingsRight.length}`);
console.log(`  Body: ${categories.body.length}`);

// SVG template with mask (inverted style)
function createInvertedSVG(pathsArray, filename, description) {
  const maskPaths = pathsArray.map(p =>
    `      <path fill="black" d="${p.d}" />`
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

  const outputPath = path.join('/workspaces/AEGISSystem/public/images/logo/eagle', filename);
  fs.writeFileSync(outputPath, svg);
  console.log(`Created: ${filename}`);
}

// Shield outer - 補完版（完全な盾の形状）
function createShieldOuter() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Shield Outer Frame (補完版・太め) -->
  <g filter="url(#glow)">
    <path fill="none" stroke="#4dc9ff" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"
      d="M 481 20
         C 560 20, 720 45, 800 80
         C 870 115, 920 190, 935 300
         C 950 430, 925 580, 865 710
         C 805 840, 690 940, 481 1010
         C 272 940, 157 840, 97 710
         C 37 580, 12 430, 27 300
         C 42 190, 92 115, 162 80
         C 242 45, 402 20, 481 20
         Z" />
  </g>
</svg>`;

  fs.writeFileSync('/workspaces/AEGISSystem/public/images/logo/eagle/shield-outer.svg', svg);
  console.log('Created: shield-outer.svg (補完版・太め)');
}

// Shield inner - 補完版（細め）
function createShieldInner() {
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
  <!-- Shield Inner Frame (補完版・細め) -->
  <g filter="url(#glow)">
    <path fill="none" stroke="#4dc9ff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"
      d="M 481 65
         C 550 65, 690 85, 760 115
         C 820 145, 865 210, 880 310
         C 895 425, 875 560, 820 680
         C 770 795, 665 885, 481 950
         C 297 885, 192 795, 142 680
         C 87 560, 67 425, 82 310
         C 97 210, 142 145, 202 115
         C 272 85, 412 65, 481 65
         Z" />
  </g>
</svg>`;

  fs.writeFileSync('/workspaces/AEGISSystem/public/images/logo/eagle/shield-inner.svg', svg);
  console.log('Created: shield-inner.svg (補完版・細め)');
}

// Output directory
const outputDir = '/workspaces/AEGISSystem/public/images/logo/eagle';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create all SVGs
createShieldOuter();
createShieldInner();

// Eagle head
createInvertedSVG(categories.eagleHead, 'eagle-head.svg', 'Eagle Head Profile');

// Wings (combined left + right)
const allWings = [...categories.wingsLeft, ...categories.wingsRight];
createInvertedSVG(allWings, 'wings.svg', 'Wings (Left + Right)');

// Combined - all eagle parts
const allEagleParts = [
  ...categories.eagleHead,
  ...categories.wingsLeft,
  ...categories.wingsRight,
  ...categories.body
];
createInvertedSVG(allEagleParts, 'combined.svg', 'All Eagle Parts Combined');

console.log('\nDone!');
