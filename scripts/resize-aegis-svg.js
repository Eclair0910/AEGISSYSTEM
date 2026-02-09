const fs = require('fs');
const path = require('path');

const outputDir = '/workspaces/AEGISSystem/public/images/logo/aegis';

// Original viewBox: 0 0 1024 535
// Logo center is around x=512, y=230 (main shield area)
// We'll crop to focus on the logo and make it appear larger

// New focused viewBox - crop to logo area only
// Original logo area roughly: x=370-650, y=80-490
const cropX = 350;
const cropY = 70;
const cropWidth = 324;  // Focus on logo width
const cropHeight = 440; // Focus on logo height

// Output size (6x larger display)
const outputWidth = cropWidth * 2;
const outputHeight = cropHeight * 2;

function updateSVG(filename) {
  const filePath = path.join(outputDir, filename);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Update width, height, and viewBox
  content = content.replace(
    /width="1024" height="535" viewBox="0 0 1024 535"/,
    `width="${outputWidth}" height="${outputHeight}" viewBox="${cropX} ${cropY} ${cropWidth} ${cropHeight}"`
  );

  fs.writeFileSync(filePath, content);
  console.log(`Updated: ${filename}`);
}

// Update all SVG files
['circle.svg', 'shield.svg', 'cross.svg', 'text.svg', 'combined.svg'].forEach(updateSVG);

console.log(`\nNew SVG size: ${outputWidth}x${outputHeight}`);
console.log(`ViewBox: ${cropX} ${cropY} ${cropWidth} ${cropHeight}`);
console.log('\nDone!');
