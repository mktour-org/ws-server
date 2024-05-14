interface Message {
  type: MessageType;
  body: PlayerModel;
}

type MessageType = 'add-existing-player' | 'add-new-player';

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
