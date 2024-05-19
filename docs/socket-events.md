This is a file which depicts types of socket events related to tournament standings.
PUB-SUB


every tournament has its own prefix, so it looks like this. id is id of tournament, see schema.

maintenance:
1. socket-died

topics:
1. tournament/id

tournament-games: 
1. game-result-changed

tournament-status:
1. tournament-started
2. tournament-finished
3. tournament-renamed
4. tournament-type-changed

tournament-bracket:
1. bracket-round-generated

tournament-players:
1. player-entered 
2. player-substituted
3. player-left
4. player-renamed
