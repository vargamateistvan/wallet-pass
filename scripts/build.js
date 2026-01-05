const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(command) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    process.exit(1);
  }
}

const rootDir = process.cwd();
console.log(`Root directory: ${rootDir}`);

// 1. Build shared package using Turbo
console.log('Building shared package...');
run('yarn turbo build --filter=@wallet-pass/shared');

// 2. Build frontend using Vite directly (bypassing Turbo to avoid output path issues)
console.log('Building frontend...');
const frontendDir = path.join(rootDir, 'apps', 'frontend');
process.chdir(frontendDir);
console.log(`Changed directory to: ${process.cwd()}`);

// Ensure dependencies are installed (should be from root, but just in case)
// run('yarn install'); // Skip this as Vercel runs installCommand at root

// Run vite build
// We use the binary from root node_modules
const viteBin = path.join(rootDir, 'node_modules', '.bin', 'vite');
run(`${viteBin} build`);

// 3. Verify output
const distDir = path.join(frontendDir, 'dist');
if (!fs.existsSync(distDir)) {
  console.error(`Error: dist directory not found at ${distDir}`);
  // List contents of frontend dir for debugging
  console.log('Contents of frontend directory:');
  run('ls -la');
  process.exit(1);
}

// 4. Move to root dist
process.chdir(rootDir);
const rootDist = path.join(rootDir, 'dist');

console.log(`Moving ${distDir} to ${rootDist}`);
if (fs.existsSync(rootDist)) {
  fs.rmSync(rootDist, { recursive: true, force: true });
}

fs.renameSync(distDir, rootDist);

console.log('Build completed successfully.');
console.log('Contents of root dist:');
run('ls -la dist');
