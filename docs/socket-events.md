This is a file which depicts types of socket events related to tournament standings.
PUB-SUB


every tournament has its own prefix, so it looks like this. id is id of tournament, see schema.

topics:
1. tournament/id/games
2. tournament/id/status
3. tournament/id/bracket
4. tournament/id/players

tournament-games: 
1. game-result-added
2. game-result-changed
3. game-result-aborted

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
