import type { User } from 'lucia';
import {
  clubsToUsers,
  player,
  playersToTournaments,
  tournament,
} from './db/migrations/schema';
import { db } from './db';
import { and, eq } from 'drizzle-orm';

export type Status = 'organizer' | 'player' | 'viewer';

export const getStatusInTournament = async (
  user: User | null,
  tournamentId: string,
) => {
  if (!user) return 'viewer';
  const clubId = (
    await db
      .select({ club: tournament.clubId })
      .from(tournament)
      .where(eq(tournament.id, tournamentId))
  ).at(0)?.club;
  if (!clubId) throw new Error('cannot resolve tournament organizer');

  const dbStatus = (
    await db
      .select({ status: clubsToUsers.status })
      .from(clubsToUsers)
      .where(
        and(eq(clubsToUsers.clubId, clubId), eq(clubsToUsers.userId, user.id)),
      )
  ).at(0)?.status;
  if (dbStatus) return 'organizer';
  const playerDb = (
    await db.select().from(player).where(eq(player.userId, user.id))
  ).at(0);
  if (!playerDb) return 'viewer';
  const isHere = (
    await db
      .select()
      .from(playersToTournaments)
      .where(
        and(
          eq(playersToTournaments.playerId, player.id),
          eq(playersToTournaments.tournamentId, tournamentId),
        ),
      )
  ).at(0);
  if (isHere) return 'player';
  else return 'viewer';
};
