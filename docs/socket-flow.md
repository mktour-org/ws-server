


We have two basic entities, WS server and WS client. Here we try to capture main lines of activities of those, according to other normative documents. 



WS server defines its handlers basicly, when it starts. 

Let's dive deeper in them. 

Also it is worth to remember, that we design our socket system on the PUB/SUB paradigm.



Initially every entrant is subscribed to four topics. so for entry function of WS: 
1. tournament-games
2. tournament-status
3. tournament-bracket
4. tournament-players
. This is for open function of WS.

When the socket is closed, you should remember to unsubscribe the user from all the topics! 



tournament-games: 



1. game-result-added

Basically we would like the player to be able to say to us that game result was added. Probably this doesn't need serious action from the server. That thing can be published ONLY by the club administrator and moderator. If we receive that message on server, we surely want to set the `result` of game to the result we received by the `gameId`. If the client receives it, we would like to find that game on a page, if it is there, and

2. game-result-changed

This is meaning that we would like player to be able to change the result.  Also ADMIN | MODERATOR.


3. game-result-aborted

We would like player to destroy the game result, and leave a game without result. ADMIN | MODERATOR.


tournament-status:
1. tournament-started

We would like player to be able to receive updates that tournament has been started. Also, probably Admin should be able to manually start the tournament.


2. tournament-finished

Again, the way to update user that tournament has been finished is desirable. After that, the tournament 

3. tournament-renamed
4. tournament-type-changed

tournament-bracket:
1. bracket-round-generated

tournament-players:
1. player-entered
2. player-substituted
3. player-left
4. player-renamed
