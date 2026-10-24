/**
 * Build-time security guard: fails the build if any installed copy of `sharp`
 * is older than 0.35.5 (fix for the libvips/libheif RCE advisories affecting
 * Next.js image optimization on glibc-based Linux).
 */
const fs = require('fs');
const path = require('path');

const MIN = [0, 35, 5];

function isOlder(version) {
  const parts = version.split(/[.-]/).slice(0, 3).map(Number);
  for (let i = 0; i < 3; i++) {
    if (parts[i] > MIN[i]) return false;
    if (parts[i] < MIN[i]) return true;
  }
  return false;
}

function findSharpCopies(dir, found = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith('@')) {
      findSharpCopies(full, found);
    } else if (entry.name === 'sharp') {
      const pkg = path.join(full, 'package.json');
      if (fs.existsSync(pkg)) found.push({ where: full, version: require(pkg).version });
    } else {
      const nested = path.join(full, 'node_modules');
      if (fs.existsSync(nested)) findSharpCopies(nested, found);
    }
  }
  return found;
}

const copies = findSharpCopies(path.join(__dirname, '..', 'node_modules'));
const vulnerable = copies.filter((c) => isOlder(c.version));

if (vulnerable.length > 0) {
  console.error('\n[security] Vulnerable sharp version(s) detected (require >= 0.35.5):');
  vulnerable.forEach((c) => console.error(`  - sharp@${c.version} at ${c.where}`));
  console.error('Run: npm install sharp@latest && npm install\n');
  process.exit(1);
}

console.log(
  `[security] sharp OK: ${copies.map((c) => c.version).join(', ') || 'not installed'} (>= 0.35.5)`
);
