function read(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function optional(name: string): string | undefined {
  const value = process.env[name];
  return value === "" ? undefined : value;
}

/**
 * Server-safe env access. Do not import this file from Client Components.
 * Public values intended for the browser live in `publicEnv`.
 */
export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: optional("DATABASE_URL"),
  authSecret: optional("AUTH_SECRET"),
  openrouterApiKey: optional("OPENROUTER_API_KEY"),
};

export const publicEnv = {
  appUrl: read("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
};

export function assertServerSecrets() {
  read("DATABASE_URL");
  read("AUTH_SECRET");
}
