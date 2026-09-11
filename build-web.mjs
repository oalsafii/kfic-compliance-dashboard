/**
 * Builds the standalone web copy of the compliance desk.
 *
 * compliance-desk.html is authored as an Artifact body — the platform
 * supplies the document skeleton there. On a normal host nothing does,
 * so this wraps the same source in a real document and adds the head
 * bits a hosted page needs. One source, two targets.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const body = await readFile(new URL('./compliance-desk.html', import.meta.url), 'utf8');

const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="light dark">
<meta name="description" content="Personal operating desk for Kuwait compliance work.">
<meta name="theme-color" content="#111418" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#F5F6F4" media="(prefers-color-scheme: light)">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">' +
  '<rect width="22" height="22" rx="4" fill="#111418"/>' +
  '<path d="M4 3.5 L18 3.5 L11 11 L18 18.5 L4 18.5 L11 11 Z" fill="#C99457"/></svg>'
)}">
<style>
  /* The skeleton the Artifact host would otherwise provide. */
  html{color-scheme:light dark}
  body{margin:0;font:14px system-ui,sans-serif}
  img{max-width:100%}
  [hidden]{display:none!important}
</style>
</head>
<body>
${body}
</body>
</html>
`;

await mkdir(new URL('./web/', import.meta.url), { recursive: true });
await writeFile(new URL('./web/index.html', import.meta.url), doc);
console.log(`web/index.html — ${(doc.length / 1024).toFixed(1)} KB`);
