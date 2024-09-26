import type { DatabasePlayer } from '@/lib/db/schema/tournaments';
import type { GameModel, PlayerModel } from './tournaments';

type Message =
  | { type: 'add-existing-player'; body: PlayerModel }
  | { type: 'add-new-player'; body: PlayerModel }
  | { type: 'remove-player'; id: string } // onError add-exidsting-player
  | { type: 'set-game-result'; gameId: string; result: Result }
  | { type: 'start-tournament'; started_at: Date }
  | { type: 'reset-tournament' }
  | { type: 'new-round'; newGames: GameModel[] }
  | ErrorMessage;

type ErrorMessage = {
  type: 'error';
  data: Message;
};