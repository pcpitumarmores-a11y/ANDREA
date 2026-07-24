const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = ['index.html', 'privacy.html', 'styles.css', 'script.js'];

for (const file of files) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}

console.log('Static site build completed successfully.');
