/**
 * Bundles scripts/checks/audit.tsx with esbuild and runs it.
 * Keeps the audit harness out of the app bundle and out of `tsc -b`.
 */
import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const outfile = '.arena/.preview/audit.mjs';
mkdirSync('.arena/.preview', { recursive: true });

await build({
  entryPoints: ['scripts/checks/audit.tsx'],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  jsx: 'automatic',
  packages: 'external',
  logLevel: 'warning',
});

await import(pathToFileURL(outfile).href);
