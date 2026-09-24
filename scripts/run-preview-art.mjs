/**
 * Bundles scripts/preview-art.tsx with the esbuild that ships with Vite and
 * runs it. Keeps the preview harness out of the app bundle and out of
 * `tsc -b` (tsconfig only includes /src).
 */
import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// The bundle has to live inside the project so Node can resolve node_modules.
const outfile = '.arena/.preview/preview-art.mjs';
mkdirSync('.arena/.preview', { recursive: true });

await build({
  entryPoints: ['scripts/preview-art.tsx'],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  jsx: 'automatic',
  packages: 'external',
  logLevel: 'warning',
});

// The bundled module reads process.argv[2] for its output directory, and
// process.argv is shared, so `node scripts/run-preview-art.mjs <dir>` works.
await import(pathToFileURL(outfile).href);
