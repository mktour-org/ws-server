import { Lucia, type Session, type User } from "lucia";
import { adapter } from "@/lib/lucia-adapter";
import type { DatabaseUser } from "@/lib/db/schema/auth";

export const lucia = new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: process.env.NODE_ENV === 'production',
      },
    },
    getUserAttributes: (attributes) => {
      return {
        username: attributes.username,
        name: attributes.name,
        email: attributes.email,
        rating: attributes.rating,
        default_club: attributes.default_club,
      };
    },
  });

  declare module 'lucia' {
    interface Register {
      Lucia: typeof lucia;
      DatabaseUserAttributes: Omit<DatabaseUser, 'id'>;
    }
  }