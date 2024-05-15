type Message = 
  | {type: 'add-existing-player', id: string}
  | {type: 'add-new-player', body: PlayerModel}
  | {type: 'remove-player', id: string}

type MessageType = 'add-existing-player' | 'add-new-player' | 'remove-player';

interface PlayerModel {
  id: string;
  nickname: string;
  realname?: string | null;
  rating?: number | null;
  club_id: string;
  wins: number;
  draws: number;
  losses: number;
  color_index: number;
}
