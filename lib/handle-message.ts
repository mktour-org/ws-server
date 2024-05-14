import { db } from './db';
import {
  players,
  players_to_tournaments,
  type DatabasePlayer,
  type DatabasePlayerToTournament,
} from './db/schema/tournaments';
import { newid } from './utils';

export const handleMessage = async (
  ws,
  message: Message,
  tournamentId: string,
) => {
  switch (message.type) {
    case 'add-existing-player':
      const newRelation: DatabasePlayerToTournament = {
        id: `${message.body.id}=${tournamentId}`,
        player_id: message.body.id,
        tournament_id: tournamentId,
        wins: message.body.wins,
        losses: message.body.losses,
        draws: message.body.draws,
        color_index: message.body.color_index,
        place: null,
      };
      try {
        await db.insert(players_to_tournaments).values(newRelation);
      } catch (e) {
        ws.send({
          type: 'error',
          body: {
            message: "couldn't add player to the tournament",
            type: message.type,
            body: message.body,
          },
        });
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
        };
        await db.insert(players).values(newPlayer);
        const playerToTournament: DatabasePlayerToTournament = {
          player_id: message.body.id,
          tournament_id: tournamentId,
          id: `${message.body.id}=${tournamentId}`,
          wins: message.body.wins,
          losses: message.body.losses,
          draws: message.body.draws,
          color_index: message.body.color_index,
          place: null,
        };
        await db.insert(players_to_tournaments).values(playerToTournament);
      } catch (e) {
        ws.send({
          type: 'error',
          body: {
            message:
              "couldn't create new player and add player to the tournament",
            type: message.type,
            body: message.body,
          },
        });
      }
      break;

    default:
      break;
  }
};
