// HTTP Toolkit Next Team Kit - managed file.
// Verifies that the current Node.js process is running through HTTP Toolkit.

import { pathToFileURL } from 'node:url';

const TEST_URL = 'https://amiusing.httptoolkit.tech/';
const TIMEOUT_MS = 10_000;

function isTruthy(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value ?? '').toLowerCase());
}

function assertSupportedNode() {
  const major = Number.parseInt(process.versions.node.split('.')[0], 10);

  if (!Number.isFinite(major) || major < 18) {
    throw new Error(
      `Este script requiere Node.js 18 o superior. Version actual: ${process.versions.node}`,
    );
  }
}

export async function checkHttpToolkit() {
  if (isTruthy(process.env.SKIP_HTTP_TOOLKIT_CHECK)) {
    console.warn(
      '[HTTP Toolkit] ADVERTENCIA: se omitio la validacion por SKIP_HTTP_TOOLKIT_CHECK=1.',
    );
    console.warn(
      '[HTTP Toolkit] La terminal igualmente debe haberse abierto desde Intercept > Fresh Terminal.',
    );
    return true;
  }

  assertSupportedNode();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(TEST_URL, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'next-http-toolkit-team-check/1.0',
      },
    });

    const active =
      response.headers.get('httptoolkit-active')?.toLowerCase() === 'true';

    if (!active) {
      console.error('\n[HTTP Toolkit] ERROR: este proceso de Node no esta siendo interceptado.\n');
      console.error('Pasos correctos:');
      console.error('  1. Abrir HTTP Toolkit.');
      console.error('  2. Ir a Intercept.');
      console.error('  3. Seleccionar Fresh Terminal.');
      console.error('  4. Entrar al proyecto desde esa terminal.');
      console.error('  5. Ejecutar nuevamente el comando dev:network.\n');
      return false;
    }

    console.log('[HTTP Toolkit] OK: el proceso de Node esta siendo interceptado.');
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    console.error('\n[HTTP Toolkit] ERROR: no se pudo completar la validacion.');
    console.error(`[HTTP Toolkit] Detalle: ${message}\n`);
    console.error('Verificar HTTP Toolkit, VPN, firewall y acceso al dominio de prueba.');
    console.error('Solo si la red corporativa bloquea la validacion, se puede omitir con');
    console.error('SKIP_HTTP_TOOLKIT_CHECK=1, manteniendo el uso de Fresh Terminal.\n');
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  const success = await checkHttpToolkit();
  process.exitCode = success ? 0 : 1;
}
