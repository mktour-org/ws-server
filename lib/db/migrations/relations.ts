import { relations } from 'drizzle-orm/relations';
import {
  user,
  userSession,
  club,
  clubsToUsers,
  tournament,
  game,
  player,
  playersToTournaments,
  userPreferences,
} from './schema';

export const userSessionRelations = relations(userSession, ({ one }) => ({
  user: one(user, {
    fields: [userSession.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ one, many }) => ({
  userSessions: many(userSession),
  club: one(club, {
    fields: [user.selectedClub],
    references: [club.id],
  }),
  clubsToUsers: many(clubsToUsers),
  players: many(player),
  userPreferences: many(userPreferences),
}));

export const clubRelations = relations(club, ({ many }) => ({
  users: many(user),
  clubsToUsers: many(clubsToUsers),
  players: many(player),
  tournaments: many(tournament),
}));

export const clubsToUsersRelations = relations(clubsToUsers, ({ one }) => ({
  user: one(user, {
    fields: [clubsToUsers.userId],
    references: [user.id],
  }),
  club: one(club, {
    fields: [clubsToUsers.clubId],
    references: [club.id],
  }),
}));

export const gameRelations = relations(game, ({ one }) => ({
  tournament: one(tournament, {
    fields: [game.tournamentId],
    references: [tournament.id],
  }),
  player_blackId: one(player, {
    fields: [game.blackId],
    references: [player.id],
    relationName: 'game_blackId_player_id',
  }),
  player_whiteId: one(player, {
    fields: [game.whiteId],
    references: [player.id],
    relationName: 'game_whiteId_player_id',
  }),
}));

export const tournamentRelations = relations(tournament, ({ one, many }) => ({
  games: many(game),
  playersToTournaments: many(playersToTournaments),
  club: one(club, {
    fields: [tournament.clubId],
    references: [club.id],
  }),
}));

export const playerRelations = relations(player, ({ one, many }) => ({
  games_blackId: many(game, {
    relationName: 'game_blackId_player_id',
  }),
  games_whiteId: many(game, {
    relationName: 'game_whiteId_player_id',
  }),
  club: one(club, {
    fields: [player.clubId],
    references: [club.id],
  }),
  user: one(user, {
    fields: [player.userId],
    references: [user.id],
  }),
  playersToTournaments: many(playersToTournaments),
}));

export const playersToTournamentsRelations = relations(
  playersToTournaments,
  ({ one }) => ({
    tournament: one(tournament, {
      fields: [playersToTournaments.tournamentId],
      references: [tournament.id],
    }),
    player: one(player, {
      fields: [playersToTournaments.playerId],
      references: [player.id],
    }),
  }),
);

export const userPreferencesRelations = relations(
  userPreferences,
  ({ one }) => ({
    user: one(user, {
      fields: [userPreferences.userId],
      references: [user.id],
    }),
  }),
);
