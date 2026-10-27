// Genera www/index.html a partir de aviones-luna.html (la misma app que se publica en Render),
// con Astronomy Engine incrustado para que el cálculo funcione sin conexión dentro del APK.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
const src = readFileSync('aviones-luna.html', 'utf8');
const astro = readFileSync('node_modules/astronomy-engine/astronomy.browser.min.js', 'utf8');
const tag = /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/astronomy-engine@[^"]+"><\/script>/;
if (!tag.test(src)) throw new Error('No encuentro la etiqueta de Astronomy Engine en aviones-luna.html');
const ver = 'android 1.0.' + (process.env.GITHUB_RUN_NUMBER || 'local');
const out = src.replace(tag, () => '<script>' + astro.replace(/<\/script/gi, '<\\/script') + '</script>').replace("window.APP_VERSION='web'", `window.APP_VERSION='${ver}'`);
mkdirSync('www', { recursive: true });
writeFileSync('www/index.html', out);
if (existsSync('Aviones_Luna_manual.pdf')) copyFileSync('Aviones_Luna_manual.pdf', 'www/Aviones_Luna_manual.pdf');
console.log('www/index.html', (out.length / 1024).toFixed(0), 'KB');
