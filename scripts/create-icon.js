const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

// Create canvas
const size = 512;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Fill background
ctx.fillStyle = '#1F2937';
ctx.fillRect(0, 0, size, size);

// Add text
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 200px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('MS', size / 2, size / 2);

// Save to file
const out = fs.createWriteStream(path.join(__dirname, '../public/icon-512x512.png'));
const stream = canvas.createPNGStream();
stream.pipe(out);

out.on('finish', () => console.log('Icon created successfully!'));
out.on('error', (err) => console.error('Error creating icon:', err));
