#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const [, , featureArg, ...rawArgs] = process.argv;

if (!featureArg) {
  console.error(
    'Usage: npm run g:feature <feature-name> [--public|--protected|--scope public|protected] [--kind server|client] [--route /custom/path] [--title "My Title"]'
  );
  process.exit(1);
}

// ---------- flags ----------
const args = parseArgs(rawArgs);
const featureKebab = sanitize(featureArg);
const featureCamel = toLowerCamel(featureKebab);
const featurePascal = capitalize(featureCamel);

// nombres para modo client
const screenFile = `${featureCamel}Page.tsx`;
const screenStyleFile = `${featureCamel}Page.style.ts`;
const screenComponent = `${featurePascal}Page`;

const title = args.title || featurePascal;
const routePath = args.route ? normalizeRoute(args.route) : `/${featureKebab}`;

// scope (public/protected)
let scope = args.scope;
if (scope == null) scope = args.public ? 'public' : args.protected ? 'protected' : undefined;
if (scope !== 'public' && scope !== 'protected') {
  const rl = readline.createInterface({ input, output });
  const ans = await rl.question('¿Dónde crear la ruta? (public/protected) [protected]: ');
  rl.close();
  scope = (ans || 'protected').trim().toLowerCase();
  if (scope !== 'public' && scope !== 'protected') scope = 'protected';
}

// kind (server/client)
let kind = (args.kind || '').toLowerCase();
if (kind !== 'server' && kind !== 'client') {
  const rl = readline.createInterface({ input, output });
  const ans = await rl.question('¿Tipo de módulo? (server/client) [client]: ');
  rl.close();
  kind = (ans || 'client').trim().toLowerCase();
  if (kind !== 'server' && kind !== 'client') kind = 'client';
}

// ---------- rutas destino en app/ ----------
const routeSegments = routePath.split('/').filter(Boolean);
const appGroup = scope === 'public' ? '(public)' : '(protected)';
const moduleDir = path.join('src', 'app', appGroup, ...routeSegments);

// subcarpetas del módulo (siempre)
const actionsDir = path.join(moduleDir, 'actions');
const componentsDir = path.join(moduleDir, 'components');
const hooksDir = path.join(moduleDir, 'hooks');
const modelsDir = path.join(moduleDir, 'models');
const storeDir = path.join(moduleDir, 'store');

// crear carpetas base
[
  moduleDir,
  actionsDir,
  componentsDir,
  hooksDir,
  modelsDir,
  storeDir,
].forEach((d) => fs.mkdirSync(d, { recursive: true }));

// ---------- generar según kind ----------
if (kind === 'client') {
  // page.tsx (Server Component DELGADO) que importa la pantalla client
  // NOTA: sin "use client" y sin async aquí → correcto en App Router
  const pagePath = path.join(moduleDir, 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    fs.writeFileSync(
      pagePath,
      `\
import { ${screenComponent} } from './${screenFile.replace('.tsx','')}';

export default function Page() {
  return <${screenComponent} />;
}
`,
      'utf8'
    );
  }

  // pantalla client
  const screenPath = path.join(moduleDir, screenFile);
  if (!fs.existsSync(screenPath)) {
    fs.writeFileSync(
      screenPath,
      `\
'use client';

import styled from '@emotion/styled';

const Wrapper = styled.main\`
  padding: 24px;
\`;

export function ${screenComponent}() {
  return (
    <Wrapper>
      <h1>${title}</h1>
      <p>${featureKebab} screen scaffolded (client component).</p>
    </Wrapper>
  );
}
`,
      'utf8'
    );
  }

  // styles de la pantalla
  const stylePath = path.join(moduleDir, screenStyleFile);
  touchIfMissing(stylePath, `// estilos específicos de ${screenComponent}\n`);

  // index del módulo
  const moduleIndex = path.join(moduleDir, 'index.ts');
  if (!fs.existsSync(moduleIndex)) {
    fs.writeFileSync(
      moduleIndex,
      [
        `export { ${screenComponent} } from './${screenFile.replace('.tsx','')}';`,
        "export * from './actions';",
        "export * from './components';",
        "export * from './hooks';",
        "export * from './models';",
        "export * from './store';",
        '',
      ].join('\n'),
      'utf8'
    );
  }
} else {
  // kind === 'server'
  // Estructura (pages)/{list,create,edit/[id]} con page.tsx + actions.ts
  const pagesDir = path.join(moduleDir, '(pages)');
  fs.mkdirSync(pagesDir, { recursive: true });

  // list y create (simples)
  const simpleSubpages = [
    { name: 'list',   title: `${title} - List` },
    { name: 'create', title: `${title} - Create` },
  ];

  for (const sp of simpleSubpages) {
    const spDir = path.join(pagesDir, sp.name);
    fs.mkdirSync(spDir, { recursive: true });

    const spPage = path.join(spDir, 'page.tsx');
    if (!fs.existsSync(spPage)) {
      fs.writeFileSync(
        spPage,
        `\
// Server Component (segmento: ${sp.name})
export const revalidate = 0;

export default async function Page() {
  await new Promise((r) => setTimeout(r, 300));
  return (
    <main style={{ padding: 24 }}>
      <h1>${sp.title}</h1>
      <p style={{ color: '#666' }}>Server-rendered page for ${sp.name}.</p>
    </main>
  );
}
`,
        'utf8'
      );
    }

    const spActions = path.join(spDir, 'actions.ts');
    if (!fs.existsSync(spActions)) {
      fs.writeFileSync(
        spActions,
        `\
'use server';

// Server Actions del segmento ${sp.name}
export async function submit${capitalize(sp.name)}(formData: FormData) {
  return { ok: true, at: new Date().toISOString() };
}

export async function load${capitalize(sp.name)}Data(id?: string) {
  return { id: id ?? 'demo', fetchedAt: new Date().toISOString() };
}
`,
        'utf8'
      );
    }

    const spIndex = path.join(spDir, 'index.ts');
    touchIfMissing(spIndex, `export * from './actions';\n`);
  }

  // edit con carpeta dinámica [id]
  const editDir = path.join(pagesDir, 'edit', '[id]');
  fs.mkdirSync(editDir, { recursive: true });

  const editPage = path.join(editDir, 'page.tsx');
  if (!fs.existsSync(editPage)) {
    fs.writeFileSync(
      editPage,
      `\
// Server Component (segmento: edit/[id])
export const revalidate = 0;

export default async function Page({ params }: { params: { id: string } }) {
  await new Promise((r) => setTimeout(r, 300));
  const { id } = params;
  return (
    <main style={{ padding: 24 }}>
      <h1>${title} - Edit</h1>
      <p style={{ color: '#666' }}>Editando recurso con id: {id}</p>
    </main>
  );
}
`,
      'utf8'
    );
  }

  const editActions = path.join(editDir, 'actions.ts');
  if (!fs.existsSync(editActions)) {
    fs.writeFileSync(
      editActions,
      `\
'use server';

// Server Actions del segmento edit/[id]
export async function submitEdit(id: string, formData: FormData) {
  // TODO: lógica real de actualización
  return { ok: true, id, at: new Date().toISOString() };
}

export async function loadEditData(id: string) {
  // TODO: fetch a DB/API por id
  return { id, fetchedAt: new Date().toISOString() };
}
`,
      'utf8'
    );
  }

  // barrels locales
  touchIfMissing(path.join(pagesDir, 'list', 'index.ts'), `export * from './actions';\n`);
  touchIfMissing(path.join(pagesDir, 'create', 'index.ts'), `export * from './actions';\n`);
  touchIfMissing(path.join(pagesDir, 'edit', '[id]', 'index.ts'), `export * from './actions';\n`);

  // loading.tsx a nivel del módulo (opcional)
  const loadingPath = path.join(moduleDir, 'loading.tsx');
  if (!fs.existsSync(loadingPath)) {
    fs.writeFileSync(
      loadingPath,
      `\
export default function Loading() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Cargando…</h1>
      <p>Preparando datos del servidor…</p>
    </main>
  );
}
`,
      'utf8'
    );
  }

  // index del módulo
  const moduleIndex = path.join(moduleDir, 'index.ts');
  if (!fs.existsSync(moduleIndex)) {
    fs.writeFileSync(
      moduleIndex,
      [
        "export * from './actions';",
        "export * from './components';",
        "export * from './hooks';",
        "export * from './models';",
        "export * from './store';",
        "export * from './(pages)/list';",
        "export * from './(pages)/create';",
        "export * from './(pages)/edit/[id]';",
        '',
      ].join('\n'),
      'utf8'
    );
  }
}

// ---------- barrels vacíos en subcarpetas ----------
touchIfMissing(path.join(actionsDir, 'index.ts'));
touchIfMissing(path.join(componentsDir, 'index.ts'));
touchIfMissing(path.join(hooksDir, 'index.ts'));
touchIfMissing(path.join(modelsDir, 'index.ts'));
touchIfMissing(path.join(storeDir, 'index.ts'));

// ---------- logs ----------
console.log('✅ Module scaffolded in App Router');
console.log(`  • Scope:      ${scope}`);
console.log(`  • Kind:       ${kind}`);
console.log(`  • Route:      ${routePath}`);
console.log(`  • Module dir: ${moduleDir}`);
if (kind === 'client') {
  console.log(`  • Files:      page.tsx, ${screenFile}, ${screenStyleFile}`);
} else {
  console.log(`  • Files:      (pages)/(list|create)/page.tsx + actions.ts, (pages)/edit/[id]/page.tsx + actions.ts, loading.tsx`);
}
console.log(`  • Folders:    actions/, components/, hooks/, models/, store/`);

// ---------- helpers ----------
function parseArgs(arr) {
  const out = {};
  for (let i = 0; i < arr.length; i++) {
    const a = arr[i];
    if (a === '--public') out.public = true;
    else if (a === '--protected') out.protected = true;
    else if (a === '--scope') out.scope = (arr[++i] || '').toLowerCase();
    else if (a === '--route') out.route = arr[++i];
    else if (a === '--title') out.title = arr[++i];
    else if (a === '--kind') out.kind = arr[++i];
  }
  return out;
}
function sanitize(s) {
  return s.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
}
function toLowerCamel(s) {
  return s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function normalizeRoute(r) {
  if (!r) return '/';
  let x = r.trim();
  if (!x.startsWith('/')) x = '/' + x;
  x = x.replace(/\/+/g, '/');
  return x;
}
function touchIfMissing(p, content = '') {
  if (!fs.existsSync(p)) fs.writeFileSync(p, content, 'utf8');
}
