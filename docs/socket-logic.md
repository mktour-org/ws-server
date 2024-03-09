

User initially connects to websockets. Then user subscribes to all the topics (see `socket-events.md`).



# tournament-games

this is a topic which contains mostly the game-related info, like standing changes and stuff. 

## game-result-added 

This describes an event when someone added a game result. 

{   
    gameId: pk,
    gameResult: Result
}


## game-result-changed

This dsecribes an event when a result of game was changed.


{   
    gameId: pk,
    gameResult: Result
}

## game-result-aborted

This describes a retract of game result

{   
    gameId: pk
}



# tournament-status

this topic is a mostly a thing, which represents current state of a tournament, if it is started, or stopped, or finished, or whatever.

## tournament-started

this event describes a tournament start

{
    tournamentId
}

## tournament-finished

this event describes a finish of a tournament

{
    tournamentId
}

## tournament-renamed

this event represents change of tournament title

{
    tournamentId,
    tournamentTitle
}

## tournament-type-changed

this event represents change of tournament type mostly

{
    tournamentId,
    tournamentType
}






# tournament-bracket

this topic is mostly for bracket related changes, when a new round is published, or something like that

## bracket-round-generated

{
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
    playerId,
    playerNickname,
    playerUserId,
    playerRating, 
    playerClubId
}

## player-substituted

this is an event firing in case of substitutions in-tournament

{
    newPlayer: {
        playerId,
        playerNickname,
        playerUserId,
        playerRating, 
        playerClubId
    },
    oldPlayer: {
        playerId
    }
}


## player-left

if a player left the tournament

{
    playerId
}
## player-renamed

if a player was renamed on the fly

{
    playerId,
    playerNewNickname
}

