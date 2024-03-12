

User initially connects to websockets. Then user subscribes to all the topics (see `socket-events.md`).



# tournament-games

this is a topic which contains mostly the game-related info, like standing changes and stuff. 

## game-result-added 

This describes an event when someone added a game result. 

{   
    topicName: "tournament-games",
    eventName: "result-added",
    gameId: pk,
    gameResult: Result
}


## game-result-changed

This dsecribes an event when a result of game was changed.


{   
    topicName: "tournament-games",
    eventName: "result-changed",
    gameId: pk,
    gameResult: Result
}

## game-result-aborted

This describes a retract of game result

{   
    topicName: "tournament-games",
    eventName: "result-aborted"
    gameId: pk
}



# tournament-status

this topic is a mostly a thing, which represents current state of a tournament, if it is started, or stopped, or finished, or whatever.

## tournament-started

this event describes a tournament start

{
    topicName: "tournament-status",
    eventName: "tournament-started"
    tournamentId
}

## tournament-finished

this event describes a finish of a tournament

{
    topicName: "tournament-status",
    eventName: "tournament-finished",
    tournamentId
}

## tournament-renamed

this event represents change of tournament title

{
    topicName: "tournament-status",
    eventName: "tournament-renamed",
    tournamentId,
    tournamentTitle
}

## tournament-type-changed

this event represents change of tournament type mostly

{
    topicName: "tournament-type-changed",
    eventName: "tournament-started",
    tournamentId,
    tournamentType
}






# tournament-bracket

this topic is mostly for bracket related changes, when a new round is published, or something like that

## bracket-round-generated

{
    topicName: "tournament-bracket",
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
    topicName: "tournament-players",
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
    topicName: "tournament-players",
    eventName: "player-substituted",
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
    topicName: "tournament-players",
    eventName: "player-left",
    playerId
}
## player-renamed

if a player was renamed on the fly

{
    topicName: "tournament-players",
    eventName: "player-renamed",
    playerId,
    playerNewNickname
}

