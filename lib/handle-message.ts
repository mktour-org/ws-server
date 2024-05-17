import type { ServerWebSocket } from 'bun';
import { db } from './db';
import {
  players,
  players_to_tournaments,
  type DatabasePlayer,
  type DatabasePlayerToTournament,
} from './db/schema/tournaments';
import { newid } from './utils';
import type { WebSocketData } from '..';
import { and, eq } from 'drizzle-orm';
import { errorMessage } from './ws-error-message';
import type { Message } from '@/types/ws-events';

export const handleMessage = async (
  ws: ServerWebSocket<WebSocketData>,
  message: Message,
  tournamentId: string,
) => {
  switch (message.type) {
    case 'add-existing-player':
      const newRelation: DatabasePlayerToTournament = {
        id: `${message.id}=${tournamentId}`,
        player_id: message.id,
        tournament_id: tournamentId,
        wins: 0,
        losses: 0,
        draws: 0,
        color_index: 0,
        place: null,
        exited: null,
      };
      try {
        await db.insert(players_to_tournaments).values(newRelation);
      } catch (e) {
        ws.send(errorMessage(message));
      }
      break;
    case 'add-new-player':
      try {
        const newPlayer: DatabasePlayer = {
          id: message.body.id,
          club_id: message.body.club_id,
          nickname: message.body.nickname,
          realname: null,
          rating: message.body.rating ?? null,
          user_id: null,
          last_seen: 0,
        };
        await db.insert(players).values(newPlayer);
        const playerToTournament: DatabasePlayerToTournament = {
          player_id: message.body.id,
          tournament_id: tournamentId,
          id: `${message.body.id}=${tournamentId}`,
          wins: 0,
          losses: 0,
          draws: 0,
          color_index: 0,
          place: null,
          exited: null,
        };
        await db.insert(players_to_tournaments).values(playerToTournament);
      } catch (e) {
        ws.send(errorMessage(message));
      }
      break;
    case 'remove-player':
      try{
      await db
        .delete(players_to_tournaments)
        .where(
          and(
            eq(players_to_tournaments.player_id, message.id),
            eq(players_to_tournaments.tournament_id, tournamentId),
          ),
        );
      } catch (e) {
        ws.send(errorMessage(message));
      }
      break;

    default:
      break;
  }
};
