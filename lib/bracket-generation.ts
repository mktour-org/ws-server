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
interface ChessTournamentEntity { 
  entityId: string;
  colourIndex: number;
}

/**
 * This is a set of a possible opponents, by entities' ids
 */
type PossibleMatches = Set<ChessTournamentEntity>


/**
 * This type is representing the bootstrapping material for the map of possible player pools
 */
type EntityIdPoolPair = [ChessTournamentEntity["entityId"], PossibleMatches]

interface ColouredEntitiesPair {
  whiteEntity: ChessTournamentEntity,
  blackEntity: ChessTournamentEntity
}

/**
 * First generated type of a round is just a pair of two entities
 */
type EntitiesPair = [ChessTournamentEntity, ChessTournamentEntity];

/**
 * Entity combining both the player general info and player tournament information
 */
interface PlayerAndPtt {
  player: DatabasePlayer;
  players_to_tournaments: DatabasePlayerToTournament;
}

/**
 * This is a map-like which maps every entity id to a set of possible matches for it
 */
type PoolById = Map<ChessTournamentEntity["entityId"], PossibleMatches>


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
async function getInitialEntitiesIdPairs(matchedEntities: ChessTournamentEntity[]) {

  // initializing a bootstrapping array
  const initialEntitiesIdPairs: EntityIdPoolPair[] = [];

  // filling the bootstrapping array here
  matchedEntities.forEach(
    /**
     * This function is taking the matched entity, forms a copy of a big set of players, then removes the current entity from a 
     * pool. Then it just forms a pair of values (this is a map bootstrap, remember?) and updates the outer array
     * @param matchedEntity 
     */
    (matchedEntity: ChessTournamentEntity) => {
      const matchedEntitiesPool = new Set(matchedEntities);
      matchedEntitiesPool.delete(matchedEntity);
      
      const poolIdPair: EntityIdPoolPair = [matchedEntity.entityId, matchedEntitiesPool];

      initialEntitiesIdPairs.push(poolIdPair);
    }
  )

  return initialEntitiesIdPairs;
}

/**
 * This simple converter is taking a joined player info and transforms it to a matched entity
 * @param playerAndPtt a joined representation of player 
 */
async function convertPlayerToEntity(playerAndPtt: PlayerAndPtt) {
  const tournamentEntity: ChessTournamentEntity = {
    entityId: playerAndPtt.player.id,
    colourIndex: playerAndPtt.players_to_tournaments.color_index
  };
  return tournamentEntity;
}

/**
 * This function purposefully generates the bracket round for the round robin tournament. It gets the 
 * tournamentId, checks the query for the current list of players, and  gets the games played by them. 
 * By using that information, it returns the new games list, which are then published to the respective
 * ws.
 */
async function generateRoundRobinRound(tournamentId: string){
    // getting the players to tournaments
    const allPlayersToTournaments = db.select().from(players_to_tournaments);
    
    // taking only those who are in the current tournament
    const tournamentPlayersToTournaments = allPlayersToTournaments.where(
      eq(players_to_tournaments.tournament_id, tournamentId)
      );
  
    // joining the player infromation for every ptt record
    const tournamentPlayersDetailed: PlayerAndPtt[] = await tournamentPlayersToTournaments.innerJoin(players, 
      eq(players.id,
         players_to_tournaments.player_id
        )
      );
    
    

    // getting the played games list
    const allGames = db.select().from(games);
    const tournamentGames = await allGames.where(
        eq(games.tournament_id, tournamentId)
    );
    // TODO: add the game updating mechanism



    // converting the database specific players model to the agnostic one, and resolve all the promises
    const matchedEntitiesPromises = tournamentPlayersDetailed.map(convertPlayerToEntity);
    const matchedEntities = await Promise.all(matchedEntitiesPromises)

    // // getting the bootstrap for the map, initially for all the players the pools are the same
    // const initialEntitiesPools = await getInitialEntitiesIdPairs(matchedRoundRobinEntities);
    // const poolById: PoolById = new Map(initialEntitiesPools);
    // // const poolByIdUpdated = updateEntitiesMatches(poolById, gamesPlayed);

    const entitiesMatchingsGenerated = await generateRoundRobinPairs(matchedEntities, tournamentGames);
    


}


/**
 * This function gets a pair, and colours it according to the colour index
 * @param uncolouredPair the pair of two entities, array like
 * @returns a promise of a coloured pair object
 */
async function getColouredPair(uncolouredPair: EntitiesPair): Promise<ColouredEntitiesPair>{
  let [whiteEntity, blackEntity] = uncolouredPair;
  
  // reversing the white and black, if the white colour index is bigger 
  // (that means that current white has played more whites, than black player)
  if (whiteEntity.colourIndex > blackEntity.colourIndex) {
    [whiteEntity, blackEntity] = [blackEntity, whiteEntity];
    
  } 
  const colouredPair: ColouredEntitiesPair = {whiteEntity, blackEntity};

  return colouredPair;
}

/**
 * This function takes an entities pool constructs a list of possible pairs of those
 * @param playerPool always EVEN set of players
 * @param gamesPlayed the list of games played in tournament
 */
async function generateRoundRobinPairs(evenEntitiesPool: ChessTournamentEntity[], previousGames: DatabaseGame[]) {

  const generatedPairs = [];

  // if there is no games, we just straightforwardly generate a list of games
  if (previousGames.length === 0) {

    // creating a copy for dynamic programming way of constructing pairs
    const remainingEntitiesPool = Array.from(evenEntitiesPool);

    // until the pool is not zero, we continue slicing it
    while (remainingEntitiesPool.length !== 0) {

      // it is guaranteed that it will be even, and thus we use a type guards here
      const firstEntity = remainingEntitiesPool.pop() as ChessTournamentEntity;
      const secondEntity = remainingEntitiesPool.pop() as ChessTournamentEntity;


      // generating a new pair 
      const generatedPair: EntitiesPair = [firstEntity, secondEntity];
      generatedPairs.push(generatedPair);
    }
  }

  return generatedPairs;
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
      let whiteEntity;
    }
  )

  return poolById
}

generateRoundRobinRound(TEST_TOURNAMENT)
  
