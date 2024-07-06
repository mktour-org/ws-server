import type { GameModel } from '@/types/tournaments';
import { db } from './db';
import {
  players,
  players_to_tournaments,
  games,
  type DatabasePlayer,
  type DatabasePlayerToTournament,
  tournaments,
  type DatabaseGame,
} from './db/schema/tournaments';
import { eq } from 'drizzle-orm';


const TEST_TOURNAMENT = "P9pqTDZv"

/**
 * This is a chess players pair with colours assigned
 */
interface ChessColouredMatchedPlayers {
  whitePlayer: DatabasePlayerToTournament,
  blackPlayer: DatabasePlayerToTournament
}

/** 
 * The type representing entities we are matching inside our algorithms 
 * */
interface MatchedEntity { 
  entityId: string
}

/**
 * This is a set of a possible opponents, by entities' ids
 */
type PossibleMatches = Set<MatchedEntity>


/**
 * This type is representing the bootstrapping material for the map of possible player pools
 */
type EntityIdPoolPair = [MatchedEntity["entityId"], PossibleMatches]

interface ColouredEntitiesPair {
  whiteId: string,
  blackId: string
}


/**
 * This is a map-like which maps every entity id to a set of possible matches for it
 */
type PoolById = Map<MatchedEntity["entityId"], PossibleMatches>


/**
 * This function gets a pair of players, and returns a game, which is ready to be fed to drizzle
 */
async function constructNewGame() {
  
}


/**
 * This function gets a list of entities, and populates it as a list of pairs of entity id, to the whole list excluding this entity.
 * This is done to have a bootstrap for mapping entities to the possible opponents for the round.
 * @param matchedEntities list with entities-like objects
 */
async function getInitialEntitiesIdPairs(matchedEntities: MatchedEntity[]) {

  // initializing a bootstrapping array
  const initialEntitiesIdPairs: EntityIdPoolPair[] = [];

  // filling the bootstrapping array here
  matchedEntities.forEach(
    /**
     * This function is taking the matched entity, forms a copy of a big set of players, then removes the current entity from a 
     * pool. Then it just forms a pair of values (this is a map bootstrap, remember?) and updates the outer array
     * @param matchedEntity 
     */
    (matchedEntity: MatchedEntity) => {
      const matchedEntitiesPool = new Set(matchedEntities);
      matchedEntitiesPool.delete(matchedEntity);
      
      const poolIdPair: EntityIdPoolPair = [matchedEntity.entityId, matchedEntitiesPool];

      initialEntitiesIdPairs.push(poolIdPair);
    }
  )

  return initialEntitiesIdPairs;
}

/**
 * This simple converter is taking a PTT and transforms it to a matched entity
 * @param playerToTournament database player to tournament , a player representation
 */
async function convertPlayerToTournamentToEntity(playerToTournament: DatabasePlayerToTournament) {
  const matchedEntity: MatchedEntity = {
    entityId: playerToTournament.player_id
  };
  return matchedEntity;
}

/**
 * This function purposefully generates the bracket round for the round robin tournament. It gets the 
 * tournamentId, checks the query for the current list of players, and  gets the games played by them. 
 * By using that information, it returns the new games list, which are then published to the respective
 * ws.
 */
async function generateRoundRobinRound(tournamentId: string){
    // getting the players pool in the tournmament
    const currentPlayers = await db.select().from(players_to_tournaments).where(
    eq(players_to_tournaments.tournament_id, tournamentId)
    );

    // getting the played games list
    const gamesPlayed = await db.select().from(games).where(
        eq(games.tournament_id, tournamentId)
    );


    // converting the database specific players model to the agnostic one, and resolve all the promises
    const matchedRoundRobinEntitiesPromises = currentPlayers.map(convertPlayerToTournamentToEntity);
    const matchedRoundRobinEntities = await Promise.all(matchedRoundRobinEntitiesPromises)

    // getting the bootstrap for the map, initially for all the players the pools are the same
    const initialEntitiesPools = await getInitialEntitiesIdPairs(matchedRoundRobinEntities);
    const poolById: PoolById = new Map(initialEntitiesPools);

    const poolByIdUpdated = updateEntitiesMatches(poolById, gamesPlayed);

    

}


/**
 * This function takes a players pool, and a list of games already played in the tournament, and then 
 * constructs a list of possible pairs of those who didn't play still
 * @param playerPool always EVEN set of players
 * @param gamesPlayed the list of games
 */
function generateRRPairs(playerPool: DatabasePlayerToTournament[], playerToPossiblePool): MatchedPlayers[] {

  const generatedPairs = [];
  if (gamesPlayed.length === 0) {
    let availablePlayerPool = playerPool;
    while (availablePlayerPool.length !== 0) {
      const randomPlayer = availablePlayerPool.pop();
      const pairedPlayer = availablePlayerPool.pop();
      const generatedPair: MatchedPlayers =  {
        firstPlayer: randomPlayer,
        secondPlayer: pairedPlayer
      };
    }
  }
  console.log(newGames);


}




/**
 * This function gets the initial (or not) matched pools by id maps, which should show the possible opponent-entities for each entity 
 * It also gets list of the games, by which the possible remained matches are being recorded
 * @param poolById  map-like which is recording which player pair played already
 * @param gamesPlayed a list of games
 * @returns the wasPlayed initial one, but with recorded games in it
 */
function updateEntitiesMatches(poolById: PoolById, gamesPlayed: DatabaseGame[], ) {
  
  gamesPlayed.forEach(
    (gamePlayed) => {
      const {white_id, black_id } = gamePlayed;
      const whiteEntity = 
    }
  )

  return poolById
}

generateRoundRobinRound(TEST_TOURNAMENT)
  
