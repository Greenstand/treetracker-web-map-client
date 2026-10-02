// Public env vars that can be changed at container runtime without rebuilding
// the image. Served to the browser by /api/runtime-env, which sets
// window.__RUNTIME_ENV__; read directly from process.env on the server.
// Everything listed here is exposed to anonymous users: never add a secret.
export const RUNTIME_ENV_KEYS = Object.freeze([
  'NEXT_PUBLIC_API',
  'NEXT_PUBLIC_TILE_SERVER_URL',
  'NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS',
  'NEXT_PUBLIC_TILE_SERVER_WEBMAP_API',
  'NEXT_PUBLIC_IMAGE_API',
  'NEXT_PUBLIC_COUNTRY_LEADER_BOARD_DISABLED',
  'NEXT_PUBLIC_SERVER_CONFIG_DISABLED',
  'NEXT_PUBLIC_KEYCLOAK_URL',
  'NEXT_PUBLIC_KEYCLOAK_CLIENT_ID',
  'NEXT_PUBLIC_KEYCLOAK_REALM',
  'NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI',
]);

// Literal references so Next inlines the build-time values as fallbacks.
const BUILD_TIME = {
  NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
  NEXT_PUBLIC_TILE_SERVER_URL: process.env.NEXT_PUBLIC_TILE_SERVER_URL,
  NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS:
    process.env.NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS,
  NEXT_PUBLIC_TILE_SERVER_WEBMAP_API:
    process.env.NEXT_PUBLIC_TILE_SERVER_WEBMAP_API,
  NEXT_PUBLIC_IMAGE_API: process.env.NEXT_PUBLIC_IMAGE_API,
  NEXT_PUBLIC_COUNTRY_LEADER_BOARD_DISABLED:
    process.env.NEXT_PUBLIC_COUNTRY_LEADER_BOARD_DISABLED,
  NEXT_PUBLIC_SERVER_CONFIG_DISABLED:
    process.env.NEXT_PUBLIC_SERVER_CONFIG_DISABLED,
  NEXT_PUBLIC_KEYCLOAK_URL: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  NEXT_PUBLIC_KEYCLOAK_REALM: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI:
    process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI,
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

// Browser: window.__RUNTIME_ENV__. Server: process.env at call time (the
// container value, else what `next start` loaded from .env.production).
// Either way, falls back to the value inlined at build time.
export function getEnv(key) {
  if (!RUNTIME_ENV_KEYS.includes(key)) {
    throw new Error(`${key} is not a runtime env key`);
  }
  const value =
    typeof window !== 'undefined'
      ? // eslint-disable-next-line no-underscore-dangle
        window.__RUNTIME_ENV__?.[key]
      : process.env[key];
  if (typeof value === 'string' && value !== '') {
    return value;
  }
  return BUILD_TIME[key];
}
