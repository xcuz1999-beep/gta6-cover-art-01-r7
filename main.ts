// Palmera Cover Studio — hand-in program for gta6-cover-art-01 (Node 22, standard library only).
//
// The entry is the static web app under app/ (index.html plus its ES modules, the display font and
// the sample photos; no build step, no network). This program copies app/ and screenshots/ into
// the output directory and writes dossier.json there with buildDossier from the vendored
// make.fun library, so the scorer sees exactly the files the judge reads about.
//
// Run it the way the grader does, or locally with an output override:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import {
  cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

// The screenshots row of the gate, checked here so a bad capture fails the
// hand-in loudly instead of scoring 0: 3-4 images with plain names, each at
// most 256 KiB, long side at most 1280 px, short side at least 480 px.
function imageSize(buf: Buffer): { w: number; h: number } {
  if (buf.length > 24 && buf.toString('latin1', 1, 4) === 'PNG') {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let off = 2;
    while (off + 9 < buf.length) {
      if (buf[off] !== 0xff) { off += 1; continue; }
      const marker = buf[off + 1];
      if (marker >= 0xc0 && marker <= 0xc3) {
        return { w: buf.readUInt16BE(off + 7), h: buf.readUInt16BE(off + 5) };
      }
      off += 2 + buf.readUInt16BE(off + 2);
    }
  }
  throw new Error('unrecognised image format (want PNG or JPEG)');
}

function validateScreenshots(dir: string): void {
  const names = readdirSync(dir).filter((n) => !n.startsWith('.')).sort();
  if (names.length < 3 || names.length > 4) {
    throw new Error(`screenshots: want 3-4 images, found ${names.length}`);
  }
  for (const name of names) {
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(name)) {
      throw new Error(`screenshots: bad file name ${name}`);
    }
    const file = join(dir, name);
    const bytes = statSync(file).size;
    if (bytes > 262144) throw new Error(`screenshots: ${name} is ${bytes} bytes, over 256 KiB`);
    const { w, h } = imageSize(readFileSync(file));
    if (Math.max(w, h) > 1280 || Math.min(w, h) < 480) {
      throw new Error(`screenshots: ${name} is ${w}x${h}, outside the gate's pixel limits`);
    }
  }
}

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

validateScreenshots(join(repoRoot, 'screenshots'));

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

const dossierPath = join(outDir, 'dossier.json');
writeFileSync(dossierPath, buildDossier(outDir, GATE));
console.log(`dossier.json written (${statSync(dossierPath).size} bytes) -> ${dossierPath}`);
