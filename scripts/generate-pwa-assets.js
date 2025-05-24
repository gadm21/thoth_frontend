const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Ensure the public/icons directory exists
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const appleIconSizes = [57, 60, 72, 76, 114, 120, 144, 152, 180];

// Path to your source icon (should be at least 512x512)
const sourceIcon = path.join(__dirname, '../public/icon-512x512.png');

// Generate icons
async function generateIcons() {
  try {
    // Generate standard favicon
    await sharp(sourceIcon)
      .resize(32, 32)
      .toFile(path.join(iconsDir, 'favicon.ico'));

    // Generate standard icons
    await Promise.all(iconSizes.map(size => {
      return sharp(sourceIcon)
        .resize(size, size)
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
    }));

    // Generate Apple touch icons
    await Promise.all(appleIconSizes.map(size => {
      return sharp(sourceIcon)
        .resize(size, size)
        .toFile(path.join(iconsDir, `apple-touch-icon-${size}x${size}.png`));
    }));

    // Also create a standard apple-touch-icon.png (180x180 is the recommended size)
    await sharp(sourceIcon)
      .resize(180, 180)
      .toFile(path.join(iconsDir, 'apple-touch-icon.png'));

    console.log('✅ PWA assets generated successfully!');
  } catch (error) {
    console.error('❌ Error generating PWA assets:', error);
    process.exit(1);
  }
}

generateIcons();
