const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const svgWidth = 1024;
const svgHeight = 535;
const centerX = 512;

// Load fonts
const fontBlack = opentype.loadSync('/workspaces/AEGISSystem/fonts/Orbitron/static/Orbitron-Black.ttf');
const fontBold = opentype.loadSync('/workspaces/AEGISSystem/fonts/Orbitron/static/Orbitron-Bold.ttf');

console.log('Fonts loaded successfully');

// Main text: A.E.G.I.S.
const mainText = 'A.E.G.I.S.';
const mainFontSize = 48;
const mainY = 445;

// Subtitle: Performance Monitor
const subText = 'Performance Monitor';
const subFontSize = 14;
const subY = 485;

// Create path for main text
const mainPath = fontBlack.getPath(mainText, 0, 0, mainFontSize);
const mainBBox = mainPath.getBoundingBox();
const mainWidth = mainBBox.x2 - mainBBox.x1;

// Center the main text
const mainX = centerX - mainWidth / 2;
const mainPathCentered = fontBlack.getPath(mainText, mainX, mainY, mainFontSize);
const mainPathD = mainPathCentered.toPathData(2);

console.log(`Main text: "${mainText}"`);
console.log(`  Width: ${mainWidth.toFixed(2)}px, X: ${mainX.toFixed(2)}`);

// Create path for subtitle
const subPath = fontBold.getPath(subText, 0, 0, subFontSize);
const subBBox = subPath.getBoundingBox();
const subWidth = subBBox.x2 - subBBox.x1;

// Center the subtitle
const subX = centerX - subWidth / 2;
const subPathCentered = fontBold.getPath(subText, subX, subY, subFontSize);
const subPathD = subPathCentered.toPathData(2);

console.log(`Subtitle: "${subText}"`);
console.log(`  Width: ${subWidth.toFixed(2)}px, X: ${subX.toFixed(2)}`);

// Create text.svg
const textSvg = `<?xml version="1.0" encoding="UTF-8"?>
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
  <!-- AEGIS Text (文字) - Orbitron font converted to paths -->
  <g filter="url(#glow)">
    <!-- Main A.E.G.I.S. text -->
    <path fill="#4dc9ff" opacity="0.9" d="${mainPathD}" />
    <!-- Subtitle: Performance Monitor -->
    <path fill="#4dc9ff" opacity="0.9" d="${subPathD}" />
  </g>
</svg>`;

const outputDir = '/workspaces/AEGISSystem/public/images/logo/aegis';
fs.writeFileSync(path.join(outputDir, 'text.svg'), textSvg);
console.log('\nCreated: text.svg (vector paths)');

// Update combined.svg
// First, read existing parts
const circleSvg = fs.readFileSync(path.join(outputDir, 'circle.svg'), 'utf-8');
const shieldSvg = fs.readFileSync(path.join(outputDir, 'shield.svg'), 'utf-8');
const crossSvg = fs.readFileSync(path.join(outputDir, 'cross.svg'), 'utf-8');

// Extract paths from each SVG
function extractPaths(svgContent) {
  const pathRegex = /<path[^>]*d="([^"]+)"[^>]*\/>/g;
  const paths = [];
  let match;
  while ((match = pathRegex.exec(svgContent)) !== null) {
    paths.push(match[0]);
  }
  return paths;
}

const circlePaths = extractPaths(circleSvg);
const shieldPaths = extractPaths(shieldSvg);
const crossPaths = extractPaths(crossSvg);

console.log(`\nExtracted paths: circle=${circlePaths.length}, shield=${shieldPaths.length}, cross=${crossPaths.length}`);

// Create combined SVG
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
  </defs>
  <!-- All AEGIS Parts Combined -->
  <g filter="url(#glow)">
    <!-- Circle (円) -->
${circlePaths.map(p => '    ' + p).join('\n')}
    <!-- Shield (盾) -->
${shieldPaths.map(p => '    ' + p).join('\n')}
    <!-- Cross (十字架) -->
${crossPaths.map(p => '    ' + p).join('\n')}
    <!-- Text (文字) - A.E.G.I.S. -->
    <path fill="#4dc9ff" opacity="0.9" d="${mainPathD}" />
    <path fill="#4dc9ff" opacity="0.9" d="${subPathD}" />
  </g>
</svg>`;

fs.writeFileSync(path.join(outputDir, 'combined.svg'), combinedSvg);
console.log('Created: combined.svg (with vector text)');

console.log('\nDone!');
