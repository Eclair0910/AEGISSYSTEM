const fs = require('fs');
const path = require('path');

const svgWidth = 962;
const svgHeight = 1024;

// Read the original file.svg to extract paths
const svgPath = '/workspaces/AEGISSystem/public/images/logo/file.svg';
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Extract paths
const pathTags = svgContent.match(/<path[\s\S]*?\/>/g) || [];
const paths = [];

pathTags.forEach((tag, index) => {
  const dMatch = tag.match(/d="\s*([\s\S]*?)"/);
  if (dMatch) {
    const d = dMatch[1].replace(/\s+/g, ' ').trim();

    // Parse coordinates for bounding box
    const coords = d.match(/[\d.]+/g);
    if (coords && coords.length >= 4) {
      const numbers = coords.map(Number);
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

      for (let i = 0; i < numbers.length - 1; i++) {
        const val = numbers[i];
        if (val > 0 && val < 1000) {
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

const centerX = svgWidth / 2;
const centerY = svgHeight / 2;

// Skip background path
const eaglePaths = paths.filter(p => !(p.width > 900 && p.height > 900));

// Categorize paths
const categories = {
  head: [],
  wings: [],
  body: []
};

eaglePaths.forEach(p => {
  const relX = p.centerX - centerX;
  const relY = p.centerY - centerY;

  // Eagle head: upper center
  if (relY < -100 && Math.abs(relX) < 300) {
    categories.head.push(p);
  }
  // Wings and body: lower parts
  else if (Math.abs(relX) > 100 && relY > -200) {
    categories.wings.push(p);
  }
  else {
    categories.body.push(p);
  }
});

// Function to create inverted SVG (eagle cut out from solid)
function createInvertedSVG(pathsArray, filename, description) {
  const clipPaths = pathsArray.map((p, i) =>
    `      <path d="${p.d}" />`
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
    <mask id="eagle-mask">
      <!-- White background = visible, black paths = cut out -->
      <rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="white"/>
${clipPaths.replace(/fill="[^"]*"/g, '').split('\n').map(line => line.replace('<path', '<path fill="black"')).join('\n')}
    </mask>
  </defs>
  <!-- ${description} -->
  <g filter="url(#glow)">
    <rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="#4dc9ff" mask="url(#eagle-mask)" opacity="0.9"/>
  </g>
</svg>`;

  const outputPath = path.join('/workspaces/AEGISSystem/public/images/logo/eagle', filename);
  fs.writeFileSync(outputPath, svg);
  console.log(`Created: ${filename}`);
}

// Create inverted versions
createInvertedSVG(eaglePaths, 'inverted-combined.svg', 'Inverted - Eagle cutout from cyan');
createInvertedSVG(categories.head, 'inverted-head.svg', 'Inverted - Head cutout');
createInvertedSVG(categories.wings, 'inverted-wings.svg', 'Inverted - Wings cutout');
createInvertedSVG(categories.body, 'inverted-body.svg', 'Inverted - Body cutout');

// Create complemented shield (inverted style - outline only)
const shieldSVG = `<?xml version="1.0" encoding="UTF-8"?>
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
    <!-- 盾の外枠（太め） -->
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
         Z" />
    <!-- 盾の内枠（細め） -->
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
         Z" />
  </g>
</svg>`;

fs.writeFileSync('/workspaces/AEGISSystem/public/images/logo/eagle/shield-frame.svg', shieldSVG);
console.log('Created: shield-frame.svg (補完された盾の枠)');

console.log('\nDone!');
