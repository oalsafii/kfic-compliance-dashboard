/**
 * Builds the PRIVATE artifact body: the same page with a snapshot of the
 * calendar baked in, so it renders even when the workspace store does not
 * answer. The snapshot holds CMA correspondence and personal employment
 * dates, and this repository is public — so the output goes to the
 * scratchpad and is never written back into the tree.
 *
 *   node build-artifact.mjs <snapshot.json> <out.html>
 */
import { readFile, writeFile } from 'node:fs/promises';

const [, , dataPath, outPath] = process.argv;
if (!dataPath || !outPath) { console.error('usage: build-artifact.mjs <snapshot.json> <out.html>'); process.exit(1); }

const body = await readFile(new URL('./compliance-desk.html', import.meta.url), 'utf8');
const snap = JSON.parse(await readFile(dataPath, 'utf8'));
const seed = { items: snap.items ?? [], holidays: snap.holidays ?? [], seeded: 'kept' };

const marker = 'const SEED=null; /*__SEED__*/';
if (!body.includes(marker)) { console.error('seed marker missing'); process.exit(1); }

// </script> inside a string literal would close the block early.
const json = JSON.stringify(seed).replace(/<\//g, '<\\/');
const out = body.replace(marker, `const SEED=${json}; /*__SEED__*/`);
await writeFile(outPath, out);
console.log(`${outPath} — ${seed.items.length} items, ${seed.holidays.length} holidays, ${(out.length/1024).toFixed(1)} KB`);
