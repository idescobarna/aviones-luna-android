// Ajusta el proyecto Android que crea «npx cap add android»: iconos, pantalla de inicio,
// permiso de ubicación, número de versión y firma.
import { readFileSync, writeFileSync, cpSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const A = 'android/app';
const RES = join(A, 'src/main/res');
const run = process.env.GITHUB_RUN_NUMBER || '1';

// 1. Iconos y pantalla de inicio
for (const d of readdirSync(RES)) if (/^drawable-(port|land)-/.test(d)) rmSync(join(RES, d), { recursive: true, force: true });
cpSync('android-res', RES, { recursive: true, force: true });

// 2. Permisos de ubicación (botón «Usar mi ubicación»)
const mf = join(A, 'src/main/AndroidManifest.xml');
let m = readFileSync(mf, 'utf8');
if (!m.includes('ACCESS_FINE_LOCATION')) {
  m = m.replace('<uses-permission android:name="android.permission.INTERNET" />',
`<uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-feature android:name="android.hardware.location.gps" android:required="false" />`);
  writeFileSync(mf, m);
}

// 3. Versión y firma
const bg = join(A, 'build.gradle');
let g = readFileSync(bg, 'utf8');
g = g.replace(/versionCode \d+/, `versionCode ${run}`).replace(/versionName "[^"]*"/, `versionName "1.0.${run}"`);
if (!g.includes('signingConfigs')) {
  g = g.replace(/\n    buildTypes \{/, `
    signingConfigs {
        release {
            storeFile rootProject.file(System.getenv("KEYSTORE_FILE") ?: "../aviones-luna.keystore")
            storePassword System.getenv("KEYSTORE_PASSWORD") ?: "avionesluna"
            keyAlias System.getenv("KEY_ALIAS") ?: "avionesluna"
            keyPassword System.getenv("KEY_PASSWORD") ?: "avionesluna"
        }
    }
    buildTypes {`);
  g = g.replace(/release \{\n(\s+)minifyEnabled false/, (s, sp) => `release {\n${sp}signingConfig signingConfigs.release\n${sp}minifyEnabled false`);
  writeFileSync(bg, g);
}
if (!existsSync('aviones-luna.keystore')) throw new Error('Falta aviones-luna.keystore en la raíz del repositorio');
console.log('Proyecto Android preparado · versión 1.0.' + run);
