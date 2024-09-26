import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

export const userSession = sqliteTable('user_session', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  expiresAt: integer('expires_at').notNull(),
});

export const user = sqliteTable(
  'user',
  {
    id: text('id').primaryKey().notNull(),
    name: text('name'),
    email: text('email').notNull(),
    username: text('username').notNull(),
    rating: integer('rating'),
    selectedClub: text('selected_club')
      .notNull()
      .references(() => club.id),
    createdAt: integer('created_at'),
  },
  (table) => {
    return {
      usernameUnique: uniqueIndex('user_username_unique').on(table.username),
      emailUnique: uniqueIndex('user_email_unique').on(table.email),
    };
  },
);

export const club = sqliteTable('club', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at'),
  lichessTeam: text('lichess_team'),
});

export const clubsToUsers = sqliteTable('clubs_to_users', {
  id: text('id').primaryKey().notNull(),
  clubId: text('club_id')
    .notNull()
    .references(() => club.id),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  status: text('status').notNull(),
});

export const game = sqliteTable('game', {
  id: text('id').primaryKey().notNull(),
  roundNumber: integer('round_number').notNull(),
  roundName: text('round_name'),
  whiteId: text('white_id')
    .notNull()
    .references(() => player.id),
  blackId: text('black_id')
    .notNull()
    .references(() => player.id),
  whitePrevGameId: text('white_prev_game_id'),
  blackPrevGameId: text('black_prev_game_id'),
  result: text('result'),
  tournamentId: text('tournament_id')
    .notNull()
    .references(() => tournament.id),
  gameNumber: integer('game_number'),
});

export const player = sqliteTable('player', {
  id: text('id').primaryKey().notNull(),
  nickname: text('nickname').notNull(),
  realname: text('realname'),
  userId: text('user_id').references(() => user.id),
  rating: integer('rating'),
  clubId: text('club_id')
    .notNull()
    .references(() => club.id),
  lastSeen: integer('last_seen'),
});

export const playersToTournaments = sqliteTable('players_to_tournaments', {
  id: text('id').primaryKey().notNull(),
  playerId: text('player_id')
    .notNull()
    .references(() => player.id),
  tournamentId: text('tournament_id')
    .notNull()
    .references(() => tournament.id),
  wins: integer('wins').notNull(),
  losses: integer('losses').notNull(),
  draws: integer('draws').notNull(),
  colorIndex: integer('color_index').notNull(),
  place: integer('place'),
  exited: integer('exited'),
});

export const userPreferences = sqliteTable('user_preferences', {
  userId: text('user_id')
    .primaryKey()
    .notNull()
    .references(() => user.id),
  language: text('language'),
});

export const tournament = sqliteTable('tournament', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  format: text('format').notNull(),
  type: text('type').notNull(),
  date: text('date').notNull(),
  createdAt: integer('created_at').notNull(),
  clubId: text('club_id')
    .notNull()
    .references(() => club.id),
  startedAt: integer('started_at'),
  closedAt: integer('closed_at'),
  roundsNumber: integer('rounds_number'),
  ongoingRound: integer('ongoing_round').notNull(),
  rated: integer('rated'),
});

export type DatabasePlayer = InferSelectModel<typeof player>;
export type DatabaseTournament = InferSelectModel<typeof tournament>;
export type DatabaseClub = InferSelectModel<typeof club>;
export type DatabaseClubsToUsers = InferSelectModel<typeof clubsToUsers>;
export type DatabaseGame = InferSelectModel<typeof game>;
export type DatabasePlayerToTournament = InferSelectModel<
  typeof playersToTournaments
>;
export type InsertDatabasePlayer = InferInsertModel<typeof player>;
export type InsertDatabaseTournament = InferInsertModel<typeof tournament>;
export type InsertDatabaseClub = InferInsertModel<typeof club>;
export type InsertDatabaseClubsToUsers = InferInsertModel<typeof clubsToUsers>;
export type InsertDatabaseGame = InferInsertModel<typeof game>;
export type InsertDatabasePlayerToTournament = InferInsertModel<
  typeof playersToTournaments
>;
export type StatusInClub = 'admin' | 'moderator';

export type DatabaseSession = InferSelectModel<typeof userSession>;
export type DatabasePreferences = InferSelectModel<typeof userPreferences>;
export type DatabaseUser = InferSelectModel<typeof user>;
export type InsertDatabaseSession = InferInsertModel<typeof userSession>;
export type InsertDatabasePreferences = InferInsertModel<
  typeof userPreferences
>;
export type InsertDatabaseUser = InferInsertModel<typeof user>;
