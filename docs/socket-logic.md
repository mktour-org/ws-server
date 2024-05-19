

User initially connects to websockets. Then user subscribes to all the topics (see `socket-events.md`). Well, I've realised that every tournament has its own update scheme probably. I won't changet the scheme for now. 



WE have a new thing now, we have an id of tournament in the socket , but it just means that the scope is defined per-id


# tournament-games

this is a topic which contains mostly the game-related info, like standing changes and stuff. 


## game-result-changed

This dsecribes an event when a result of game was changed.


{   
    eventName: "result-changed",
    gameId: pk,
    gameResult: Result
}




# tournament-status

this topic is a mostly a thing, which represents current state of a tournament, if it is started, or stopped, or finished, or whatever.

## tournament-started

this event describes a tournament start

{
    eventName: "tournament-started",
}

## tournament-finished

this event describes a finish of a tournament

{
    eventName: "tournament-finished",
}

## tournament-renamed

this event represents change of tournament title

{
    eventName: "tournament-renamed",
    tournamentTitle
}

## tournament-type-changed

this event represents change of tournament type mostly

{
    eventName: "tournament-type-changed",
    tournamentType
}






# tournament-bracket

this topic is mostly for bracket related changes, when a new round is published, or something like that

## bracket-round-generated

{
    eventName: "bracket-generated",
    generatedGames: [
        {
            gameId,
            gameRoundNumber,
            gameWhiteId,
            gameBlackId,
            gameTournamentId
        },
        ...
    ]
}


# tournament-players

this is the only pure player related topic, which covers all the operations related to the  players in, out  and substitutets


## player-entered

this is an event which fires when player enters tournament.

{
    eventName: "player-entered",
    playerId,
    playerNickname,
    playerUserId,
    playerRating, 
    playerClubId
}

## player-substituted

this is an event firing in case of substitutions in-tournament

{
    eventName: "player-substituted",
    newPlayer: {
        playerId,
        playerNickname,
        playerUserId,
        playerRating, 
        playerClubId
    },
    oldPlayer: {
        playerId //TODO: rethink ????
    }
}


## player-left

if a player left the tournament

{
    eventName: "player-left",
    playerId
}
## player-renamed

if a player was renamed on the fly

{
    eventName: "player-renamed",
    playerId,
    playerNewNickname
}

