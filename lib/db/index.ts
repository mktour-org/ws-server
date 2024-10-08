import * as schema from '@/lib/db/migrations/schema';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '../config/urls';

export const sqlite = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
});

export const db = drizzle(sqlite, { schema });
