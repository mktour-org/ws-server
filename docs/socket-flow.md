


We have two basic entities, WS server and WS client. Here we try to capture main lines of activities of those, according to other normative documents. 



WS server defines its handlers basicly, when it starts. 

Let's dive deeper in them. 

Also it is worth to remember, that we design our socket system on the PUB/SUB paradigm.



# open function ws client


Initially every entrant is subscribed to one topic, related to the tournament this user currently watches. There are 1 topic for each  of events: 
topic:
tournament/id/


. This is for open function of WS. So we need to receive the watched tournament, and then subscribe!.

When the socket is closed, you should remember to unsubscribe the user from all the topics!


### checking the user status for roles 
That thing can be published ONLY by the club administrator and moderator, we check that by checking `clubs-to-users` table. 


tournament-games: 

1. game-result-changed

This is meaning that we would like player to be able to change the result.  

ROLE-PUB: ADMIN|MODERATOR
ROLE-SUB: ANYONE
DESCRIPTION: Basically we would like the player to be able to say to us that game result was changed. 
SERVER-RECEIVE: We surely want to set the `result` of game to the result we received by the `gameId`. 
CLIENT-PUB: Client sends the message with the form of the related event `game-result-changed` to the needed topic.
CLIENT-RECEIVE: We would like to find that game on a client's page, if it is there, and update it's result accordingly.



tournament-status:
1. tournament-started


ROLE-PUB: ADMIN|MODERATOR
ROLE-SUB: ANYONE
DESCRIPTION: Basically we would like to inform about the tournament starting sequence. 
SERVER-RECEIVE: Update the tournament db by id, more precisely `is-started` field
CLIENT-PUB: Client sends the message with the form of the related event `tournament-started` to the needed topic.
CLIENT-RECEIVE: We would like to execute sequence of tournament starting on the page. 

2. tournament-finished


ROLE-PUB: ADMIN|MODERATOR
ROLE-SUB: ANYONE
DESCRIPTION: Basically we would like to inform about the tournament is finished. 
SERVER-RECEIVE: Update the tournament db by id, more precisely `is-closed` field.
CLIENT-PUB: Client sends the message with the form of the related event `tournament-finished` to the needed topic.
CLIENT-RECEIVE: We would like to execute sequence of tournament finishing on the page. 


3. tournament-renamed


ROLE-PUB: ADMIN|MODERATOR
ROLE-SUB: ANYONE
DESCRIPTION: Informing the people about the new tournament name!! 
SERVER-RECEIVE: Update the tournament db by id, more precisely put the string from the event `tournamentTitle` to the
CLIENT-PUB: Client sends the message with the form of the related event `tournament-renamed` to the needed topic.
CLIENT-RECEIVE: We would like to change the name dynamically on the webpage

4. tournament-type-changed

ROLE-PUB: ADMIN|MODERATOR
ROLE-SUB: ANYONE
DESCRIPTION: This is a bit tricky, bceause we need to change our structure on the fly. 
SERVER-RECEIVE: We would update the type of a tournament `format` field basically, also the generated rounds should be changed, and regenerated. So all the games would be dropped, or at least retracted. 
CLIENT-PUB: Client sends the message with the form of the related event `tournament-type-changed` to the needed topic.
CLIENT-RECEIVE: We would like to change the type on the page, and also catch all the new games, but probably through the other topics.



tournament-bracket:
1. bracket-round-generated

ROLE-PUB: SERVER
ROLE-SUB: ANYONE
DESCRIPTION: New bracket should be, when dropped, inform about itself.
SERVER-RECEIVE: server cannot receive anything like this
CLIENT-PUB: client cannot publish it
CLIENT-RECEIVE: so we would like to receive an array of new games generated, create a new page accordingly for those .



tournament-players:
1. player-entered
ROLE-PUB: USER
ROLE-SUB: ANYONE
DESCRIPTION: New player entered the tournament!
SERVER-RECEIVE: Some magic in the server like adding the player to the list
CLIENT-PUB: Client informs everyone here. 
CLIENT-RECEIVE: If we didn't publish this, we want to know something happened!

2. player-substituted
ROLE-PUB: USER
ROLE-SUB: ANYONE
DESCRIPTION: New player entered the tournament!
SERVER-RECEIVE: Some magic in the server like adding the player to the list
CLIENT-PUB: Client informs everyone here. 
CLIENT-RECEIVE: If we didn't publish this, we want to know something happened!

3. player-left
4. player-renamed
