<!--- (описание тестов функции "добавить игрока". возникла мысль сделать просто два отдельных типа сообщения — "добавить существующего игрока в турнир" и добавить нового (то есть создать его тоже). проблемы какиеЖ тогда чтобы у нас он правильный добавлялся на других клиентах и запихивался в базы на сервере, нам надо всю его форму изначальную создавать на первом клиенте. и все айди тоже по итогу у людей в браузерах генерятся. это норм структура? звучит что можно как-то полегче реализовать, (в плане с меньшей нагрузкой на клиента)) -->

# test descriptions for ws-messages adding players to a tournament

## adding existing player

1. message shape:
   ```ts
   interface AddPlayer {
     type: 'add-player';
     body: {
       id: string;
       nickname: string;
       rating?: number | null;
       club_id: string;
       wins: number;
       draws: number;
       losses: number;
       color_index: number;
     };
   }
   ```
2. user who sends message has status `organizer` in the tournament, which means is 'admin' or 'moderator' in the organizing club.
3. `players` table has player with this message.body `id`
4. `club_id` of message body matches the `club_id` (or `organizer_id`) of this tournament
5. `players_to_tournaments` table doesn't already contain this player relation to this tournament
6. after message handled, there is a new relation created in `players_to_tournament` where `player_id` matches this message.body.id and tournament id matches accordingly

## add completely new player

1. message shape:
   ```ts
   interface AddPlayer {
     type: 'add-new-player';
     body: {
       id: string;
       nickname: string;
       fullname?: string | null;
       rating?: number | null;
       club_id: string;
       wins: number;
       draws: number;
       losses: number;
       color_index: number;
     };
   }
   ```

2. there is no player in `players` table with this message.body `id`
3. after message handled, there is a new player in `players` table with `club_id` matching `club_id` (or `organizer_id`)of this tournament and id matching this message.body `id`
4. after message handled, there is a new relation created in `players_to_tournament` where `player_id` matches this message.body.id and tournament id matches accordingly
