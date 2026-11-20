// Palmera Cover Studio — hand-in program for gta6-cover-art-01 (Node 22, standard library only).
//
// The entry is the static web app under app/ (index.html plus its ES modules, the display font and
// the sample photos; no build step, no network). This program copies app/ and screenshots/ into
// the output directory and writes dossier.json there with buildDossier from the vendored
// make.fun library, so the scorer sees exactly the files the judge reads about.
//
// Run it the way the grader does, or locally with an output override:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate's own caps, mirrored so a bad hand-in fails here first instead of at the scorer.
const GATE = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
} as const;

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

const dossierPath = join(outDir, 'dossier.json');
writeFileSync(dossierPath, buildDossier(outDir, GATE));
console.log(`dossier.json written (${statSync(dossierPath).size} bytes) -> ${dossierPath}`);
