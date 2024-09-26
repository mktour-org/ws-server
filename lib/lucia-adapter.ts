import { db } from '@/lib/db';
import { user, userSession } from '@/lib/db/migrations/schema';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

export const adapter = new DrizzleSQLiteAdapter(db, userSession, user);
