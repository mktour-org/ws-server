import type { Config } from 'drizzle-kit';
import { defineConfig } from 'drizzle-kit';
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from './lib/config/urls';

export default defineConfig({
  schema: './lib/db/schema',
  out: './lib/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  },
} satisfies Config);
