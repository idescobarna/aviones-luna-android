# Aviones Luna

Planificador para fotografiar un avión por delante de la Luna o del Sol en Barcelona-El Prat, Girona, Reus y Zaragoza.

- **Web**: https://aviones-luna.onrender.com (Render publica `aviones-luna.html` en cada cambio).
- **Android**: https://github.com/idescobarna/Aviones-Luna/releases/latest/download/aviones-luna.apk

## Cómo se genera el APK

Cada vez que cambia `aviones-luna.html` (o los archivos de abajo), GitHub Actions:

1. crea `www/index.html` a partir de `aviones-luna.html`, con Astronomy Engine incrustado para que el cálculo funcione sin conexión;
2. crea el proyecto Android con Capacitor 8 y le pone los iconos de `android-res/`, el permiso de ubicación, la versión y la firma;
3. compila el APK y lo publica en **Releases** como `aviones-luna.apk`.

También se puede lanzar a mano en **Actions → APK Android → Run workflow**.

| Archivo | Para qué sirve |
|---|---|
| `aviones-luna.html` | La app. Es el único archivo que hay que tocar para cambiarla. |
| `package.json`, `package-lock.json` | Versiones de Capacitor y de sus complementos (archivos, compartir, navegador, GPS, barra de estado). |
| `capacitor.config.json` | Nombre e identificador de la app (`com.iamarketers.avionesluna`). |
| `scripts/` | Preparan la web y el proyecto Android. |
| `android-res/` | Icono y pantalla de inicio. |
| `aviones-luna.keystore` | Firma del APK. Mantener siempre el mismo para que las actualizaciones se instalen encima. |
| `.github/workflows/android.yml` | El proceso de compilación. |

La firma usa una contraseña por defecto (`avionesluna`). Vale para compartir la app con amigos; para publicarla en Google Play, crea otra firma y guárdala como secretos del repositorio (`KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`).
