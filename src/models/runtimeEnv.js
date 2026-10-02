// Env vars that can be changed at container runtime without rebuilding the
// image. Served by /api/runtime-env, which sets window.__RUNTIME_ENV__.
export const RUNTIME_ENV_KEYS = Object.freeze([
  'NEXT_PUBLIC_TILE_SERVER_URL',
  'NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS',
  'NEXT_PUBLIC_TILE_SERVER_WEBMAP_API',
]);

// Literal references so Next inlines the build-time values as fallbacks.
const BUILD_TIME = {
  NEXT_PUBLIC_TILE_SERVER_URL: process.env.NEXT_PUBLIC_TILE_SERVER_URL,
  NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS:
    process.env.NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS,
  NEXT_PUBLIC_TILE_SERVER_WEBMAP_API:
    process.env.NEXT_PUBLIC_TILE_SERVER_WEBMAP_API,
};

// Server-side only. Dynamic key lookup so webpack can't inline the value.
export function getRuntimeEnvFromProcess() {
  const env = {};
  RUNTIME_ENV_KEYS.forEach((key) => {
    const value = process.env[key];
    if (value !== undefined) {
      env[key] = value;
    }
  });
  return env;
}

export function getEnv(key) {
  if (!RUNTIME_ENV_KEYS.includes(key)) {
    throw new Error(`${key} is not a runtime env key`);
  }
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-underscore-dangle
    const value = window.__RUNTIME_ENV__?.[key];
    if (typeof value === 'string' && value !== '') {
      return value;
    }
  }
  return BUILD_TIME[key];
}
