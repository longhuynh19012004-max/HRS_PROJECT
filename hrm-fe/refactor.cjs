const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/pages/SchedulePage.tsx',
  'src/pages/ProfilePage.tsx',
  'src/pages/HomePage.tsx',
  'src/pages/DashboardPage.tsx',
  'src/pages/SettingsPage.tsx'
];

function removeCopy(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Regex to remove the copy block
  content = content.replace(/const copy = \{[\s\S]*?^\};\r?\n?/m, '');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Cleaned up ${filePath}`);
}

targetFiles.forEach(removeCopy);
