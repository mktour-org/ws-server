


We have two basic entities, WS server and WS client. Here we try to capture main lines of activities of those, according to other normative documents. 



WS server defines its handlers basicly, when it starts. 

Let's dive deeper in them. 

Also it is worth to remember, that we design our socket system on the PUB/SUB paradigm.



# open function ws client


Initially every entrant is subscribed to one topic, related to the tournament this user currently watches. There are 4 topics for each  of events: 
topics:
1. tournament/id/games
2. tournament/id/status
3. tournament/id/bracket
4. tournament/id/players

. This is for open function of WS. So we need to receive the watched tournament, and then subscribe!.

When the socket is closed, you should remember to unsubscribe the user from all the topics!


### checking the user status for roles 
That thing can be published ONLY by the club administrator and moderator, we check that by checking `clubs-to-users` table. 


tournament-games: 



1. game-result-added
ROLE-PUB: ADMIN|MODERATOR
ROLE-SUB: ANYONE
DESCRIPTION: Basically we would like the player to be able to say to us that game result was added.
SERVER-RECEIVE: We surely want to set the `result` of game to the result we received by the `gameId` in the database.
CLIENT-PUB: Client sends the message with the form of the related event `game-result-added` to the needed topic.
CLIENT-RECEIVE: We would like to find that game on a client's page, if it is there, and update it's result accordingly.

2. game-result-changed

This is meaning that we would like player to be able to change the result.  

ROLE-PUB: ADMIN|MODERATOR
ROLE-SUB: ANYONE
DESCRIPTION: Basically we would like the player to be able to say to us that game result was changed. 
SERVER-RECEIVE: We surely want to set the `result` of game to the result we received by the `gameId`. 
CLIENT-PUB: Client sends the message with the form of the related event `game-result-added` to the needed topic.
CLIENT-RECEIVE: We would like to find that game on a client's page, if it is there, and update it's result accordingly.


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
