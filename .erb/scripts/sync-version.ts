import fs from 'fs';
import path from 'path';

const mainPackagePath = path.join(__dirname, '../../package.json');
const releasePackagePath = path.join(__dirname, '../../release/app/package.json');

const mainPackage = JSON.parse(fs.readFileSync(mainPackagePath, 'utf-8'));
const releasePackage = JSON.parse(fs.readFileSync(releasePackagePath, 'utf-8'));

releasePackage.version = mainPackage.version;

fs.writeFileSync(releasePackagePath, JSON.stringify(releasePackage, null, 2) + '\n');

console.log(`Synced version ${mainPackage.version} to release/app/package.json`);
