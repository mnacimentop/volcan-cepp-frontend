#!/usr/bin/env node
// Installs the reusable HTTP Toolkit workflow in an existing Next.js project.

import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MANAGED_SCRIPTS = {
  'dev:network': 'node ./scripts/http-toolkit/dev-with-http-toolkit.mjs',
  'network:check': 'node ./scripts/http-toolkit/check-http-toolkit.mjs',
};

function printHelp() {
  console.log(`
Uso:
  node installer/install.mjs --target <ruta-del-proyecto-next>

Opciones:
  --target <ruta>  Raiz del proyecto que contiene package.json.
  --force          Sobrescribe archivos o scripts administrados existentes.
  --dry-run        Valida y muestra los cambios sin escribir archivos.
  --help           Muestra esta ayuda.
`);
}

function parseArgs(argv) {
  const result = { target: process.cwd(), force: false, dryRun: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--force') {
      result.force = true;
    } else if (arg === '--dry-run') {
      result.dryRun = true;
    } else if (arg === '--target') {
      index += 1;
      if (!argv[index]) throw new Error('Falta el valor de --target.');
      result.target = argv[index];
    } else {
      throw new Error(`Opcion no reconocida: ${arg}`);
    }
  }

  return result;
}

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function backupName(packageJsonPath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${packageJsonPath}.http-toolkit-backup-${timestamp}`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const targetRoot = path.resolve(args.target);
  const packageJsonPath = path.join(targetRoot, 'package.json');

  if (!(await exists(packageJsonPath))) {
    throw new Error(`No se encontro package.json en: ${targetRoot}`);
  }

  const raw = await readFile(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(raw);

  if (!packageJson.scripts?.dev) {
    throw new Error('El proyecto debe tener un script package.json "dev" antes de instalar el kit.');
  }

  const nextVersion = packageJson.dependencies?.next ?? packageJson.devDependencies?.next;
  if (!nextVersion) {
    console.warn('[Instalador] ADVERTENCIA: no se encontro Next.js en dependencies/devDependencies.');
  }

  for (const [name, value] of Object.entries(MANAGED_SCRIPTS)) {
    const current = packageJson.scripts?.[name];
    if (current && current !== value && !args.force) {
      throw new Error(
        `El script "${name}" ya existe con otro valor. Revisarlo o volver a ejecutar con --force.`,
      );
    }
  }

  const installerDir = path.dirname(fileURLToPath(import.meta.url));
  const assetsDir = path.join(installerDir, 'assets');
  const targetScriptsDir = path.join(targetRoot, 'scripts', 'http-toolkit');

  const files = [
    ['check-http-toolkit.mjs', 'check-http-toolkit.mjs'],
    ['dev-with-http-toolkit.mjs', 'dev-with-http-toolkit.mjs'],
  ];

  for (const [, destinationName] of files) {
    const destination = path.join(targetScriptsDir, destinationName);
    if ((await exists(destination)) && !args.force) {
      const existing = await readFile(destination, 'utf8');
      if (!existing.includes('HTTP Toolkit Next Team Kit - managed file.')) {
        throw new Error(
          `El archivo ${destination} ya existe y no parece administrado por este kit. Use --force solo despues de revisarlo.`,
        );
      }
    }
  }

  console.log('[Instalador] Proyecto objetivo:', targetRoot);
  console.log('[Instalador] Script dev existente:', packageJson.scripts.dev);
  if (nextVersion) console.log('[Instalador] Version declarada de Next.js:', nextVersion);
  console.log('[Instalador] Se agregaran los scripts:', Object.keys(MANAGED_SCRIPTS).join(', '));

  if (args.dryRun) {
    console.log('[Instalador] Dry run finalizado. No se escribieron archivos.');
    return;
  }

  const backupPath = backupName(packageJsonPath);
  await copyFile(packageJsonPath, backupPath);
  await mkdir(targetScriptsDir, { recursive: true });

  for (const [sourceName, destinationName] of files) {
    await copyFile(
      path.join(assetsDir, sourceName),
      path.join(targetScriptsDir, destinationName),
    );
  }

  packageJson.scripts = {
    ...packageJson.scripts,
    ...MANAGED_SCRIPTS,
  };

  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');

  console.log('\n[Instalador] Instalacion completada.');
  console.log('[Instalador] Backup:', backupPath);
  console.log('\nSiguientes pasos:');
  console.log('  1. Revisar git diff.');
  console.log('  2. Instalar HTTP Toolkit Desktop en la computadora del desarrollador.');
  console.log('  3. Abrir HTTP Toolkit > Intercept > Fresh Terminal.');
  console.log('  4. Entrar al proyecto y ejecutar npm run dev:network.');
  console.log('  5. Validar las requests Next.js -> backend en la pantalla View.\n');
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[Instalador] ERROR: ${message}`);
  process.exitCode = 1;
});
