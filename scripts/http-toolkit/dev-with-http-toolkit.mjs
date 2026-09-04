// HTTP Toolkit Next Team Kit - managed file.
// Validates interception and then starts the existing package.json "dev" script.

import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { checkHttpToolkit } from './check-http-toolkit.mjs';

const projectRoot = process.cwd();
const packageJsonPath = path.join(projectRoot, 'package.json');

async function readPackageJson() {
  try {
    await access(packageJsonPath, constants.R_OK);
  } catch {
    throw new Error(
      `No se encontro package.json en ${projectRoot}. Ejecutar el comando desde la raiz del proyecto Next.js.`,
    );
  }

  const raw = await readFile(packageJsonPath, 'utf8');
  return JSON.parse(raw);
}

function resolvePackageManager(packageJson) {
  const npmExecPath = process.env.npm_execpath;

  if (npmExecPath) {
    return {
      command: process.execPath,
      args: [npmExecPath, 'run', 'dev'],
      shell: false,
    };
  }

  const declared = String(packageJson.packageManager ?? '').split('@')[0];

  if (declared === 'pnpm') {
    return { command: 'pnpm', args: ['run', 'dev'], shell: process.platform === 'win32' };
  }

  if (declared === 'yarn') {
    return { command: 'yarn', args: ['dev'], shell: process.platform === 'win32' };
  }

  if (declared === 'bun') {
    return { command: 'bun', args: ['run', 'dev'], shell: process.platform === 'win32' };
  }

  return { command: 'npm', args: ['run', 'dev'], shell: process.platform === 'win32' };
}

async function main() {
  const packageJson = await readPackageJson();
  const devScript = packageJson.scripts?.dev;

  if (!devScript) {
    throw new Error('package.json no contiene un script "dev".');
  }

  if (String(devScript).includes('dev-with-http-toolkit.mjs')) {
    throw new Error(
      'El script "dev" no debe apuntar a dev-with-http-toolkit.mjs porque generaria recursion.',
    );
  }

  const intercepted = await checkHttpToolkit();

  if (!intercepted) {
    process.exitCode = 1;
    return;
  }

  const runner = resolvePackageManager(packageJson);
  console.log(`[HTTP Toolkit] Iniciando el script dev original: ${devScript}`);

  const child = spawn(runner.command, runner.args, {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit',
    shell: runner.shell,
  });

  const forwardSignal = (signal) => {
    if (!child.killed) {
      child.kill(signal);
    }
  };

  process.once('SIGINT', () => forwardSignal('SIGINT'));
  process.once('SIGTERM', () => forwardSignal('SIGTERM'));

  child.on('error', (error) => {
    console.error(`[HTTP Toolkit] No se pudo iniciar el script dev: ${error.message}`);
    process.exitCode = 1;
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`[HTTP Toolkit] El proceso dev termino por la senal ${signal}.`);
      process.exitCode = 1;
      return;
    }

    process.exitCode = code ?? 1;
  });
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[HTTP Toolkit] ERROR: ${message}`);
  process.exitCode = 1;
});
