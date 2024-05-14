import { db } from './db';
import {
  players_to_tournaments,
  type DatabasePlayerToTournament,
} from './db/schema/tournaments';
import { newid } from './utils';

export const handleMessage = async (message: Message, tournamentId: string) => {
  switch (message.type) {
    case 'add-existing-player':
      const newRelation: DatabasePlayerToTournament = {
        id: newid(),
        player_id: message.body.id,
        tournament_id: tournamentId,
        wins: message.body.wins,
        losses: message.body.losses,
        draws: message.body.draws,
        color_index: message.body.color_index,
        place: null,
      };
      await db.insert(players_to_tournaments).values(newRelation);
      break;

    default:
      break;
  }
};
