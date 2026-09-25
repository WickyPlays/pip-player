import fs from 'fs';
import path from 'path';

const mainPackagePath = path.join(__dirname, '../../package.json');
const releasePackagePath = path.join(__dirname, '../../release/app/package.json');
const pushTagJsonPath = path.join(__dirname, '../../.github/act/push-tag.json');
const releaseJsonPath = path.join(__dirname, '../../.github/act/release.json');

const mainPackage = JSON.parse(fs.readFileSync(mainPackagePath, 'utf-8'));
const releasePackage = JSON.parse(fs.readFileSync(releasePackagePath, 'utf-8'));

// Sync version to release/app/package.json
releasePackage.version = mainPackage.version;
fs.writeFileSync(releasePackagePath, JSON.stringify(releasePackage, null, 2) + '\n');
console.log(`Synced version ${mainPackage.version} to release/app/package.json`);

// Sync version to .github/act/push-tag.json
const pushTagJson = JSON.parse(fs.readFileSync(pushTagJsonPath, 'utf-8'));
pushTagJson.ref = `refs/tags/v${mainPackage.version}`;
fs.writeFileSync(pushTagJsonPath, JSON.stringify(pushTagJson, null, 2) + '\n');
console.log(`Synced version ${mainPackage.version} to .github/act/push-tag.json`);

// Sync version to .github/act/release.json
const releaseJson = JSON.parse(fs.readFileSync(releaseJsonPath, 'utf-8'));
releaseJson.inputs.tag = `v${mainPackage.version}`;
fs.writeFileSync(releaseJsonPath, JSON.stringify(releaseJson, null, 2) + '\n');
console.log(`Synced version ${mainPackage.version} to .github/act/release.json`);
