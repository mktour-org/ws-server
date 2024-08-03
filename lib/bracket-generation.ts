import type { GameModel, Result } from '@/types/tournaments';
import { db } from './db';
import {
  players,
  players_to_tournaments,
  games,
  type DatabasePlayer,
  type DatabasePlayerToTournament,
  tournaments,
  type DatabaseGame,
  type InsertDatabaseGame,
} from './db/schema/tournaments';
import { eq } from 'drizzle-orm';
import { newid } from './utils';

const TEST_TOURNAMENT = 'P9pqTDZv';
const TEST_ROUND_NUMBER = 0;


/**
 * This is a chess players pair with colours assigned
 */
interface ChessColouredMatchedPlayers {
  whitePlayer: DatabasePlayerToTournament;
  blackPlayer: DatabasePlayerToTournament;
}

/**
 * The type representing entities we are matching inside our algorithms
 * */
interface ChessTournamentEntity {
  entityId: string;
  entityColourIndex: number;
  entityRating: number;
}

/**
 * This is a set of a possible opponents, by entities' ids
 */
type PossibleMatches = Set<ChessTournamentEntity['entityId']>;

/**
 * This type is representing the bootstrapping material for the map of possible player pools
 */
type EntityIdPoolPair = [ChessTournamentEntity['entityId'], PossibleMatches];

/**
 * This interface is representing an entiies pair, which is already has colour in it
 */
interface ColouredEntitiesPair {
  whiteEntity: ChessTournamentEntity;
  blackEntity: ChessTournamentEntity;
}

interface NumberedEntitiesPair extends ColouredEntitiesPair {
  pairNumber: number;
}

/**
 * This is a generic type, which selects only unique properties of `Child`
 */
type OnlyChild<Child, Parent> = Omit<Child, keyof Parent>;

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
type PoolById = Map<ChessTournamentEntity['entityId'], PossibleMatches>;


/**
 * This function gets a list of entities, and populates it as a list of pairs of entity id, to the whole list excluding this entity.
 * This is done to have a bootstrap for mapping entities to the possible opponents for the round.
 * @param matchedEntities list with entities-like objects
 */
async function getInitialEntitiesIdPairs(
  matchedEntities: ChessTournamentEntity[],
) {
  // initializing a bootstrapping array
  const initialEntitiesIdPairs: EntityIdPoolPair[] = [];

  // getting a list of an entities ids only, because it's the only useful information for matching here
  const matchEntitiesIds: ChessTournamentEntity["entityId"][] = matchedEntities.map(
    (matchedEntity) => matchedEntity.entityId
  );

  // filling the bootstrapping array here
  matchedEntities.forEach(
    /**
     * This function is taking the matched entity, forms a copy of a big set of players, then removes the current entity from a
     * pool. Then it just forms a pair of values (this is a map bootstrap, remember?) and updates the outer array
     * @param matchedEntity
     */
    (matchedEntity: ChessTournamentEntity) => {
      const matchedEntitiesPool = new Set(matchEntitiesIds);
      matchedEntitiesPool.delete(matchedEntity.entityId);

      const poolIdPair: EntityIdPoolPair = [
        matchedEntity.entityId,
        matchedEntitiesPool,
      ];

      initialEntitiesIdPairs.push(poolIdPair);
    },
  );

  return initialEntitiesIdPairs;
}

/**
 * This simple converter is taking a joined player info and transforms it to a matched entity
 * @param playerAndPtt a joined representation of player
 */
async function convertPlayerToEntity(playerAndPtt: PlayerAndPtt) {
  const tournamentEntity: ChessTournamentEntity = {
    entityId: playerAndPtt.player.id,
    entityColourIndex: playerAndPtt.players_to_tournaments.color_index,
    entityRating: playerAndPtt.player.rating ?? 0, // If the player rating is null, we just use zero as a complement
  };
  return tournamentEntity;
}

/**
 * This function purposefully generates the bracket round for the round robin tournament. It gets the
 * tournamentId, checks the query for the current list of players, and  gets the games played by them.
 * By using that information, it returns the new games list, which are then published to the respective
 * ws.
 */
async function generateRoundRobinRound(tournamentId: string, roundNumber: number) {
  // getting the players to tournaments
  const allPlayersToTournaments = db.select().from(players_to_tournaments);

  // taking only those who are in the current tournament
  const tournamentPlayersToTournaments = allPlayersToTournaments.where(
    eq(players_to_tournaments.tournament_id, tournamentId),
  );

  // joining the player infromation for every ptt record
  const tournamentPlayersDetailed: PlayerAndPtt[] =
    await tournamentPlayersToTournaments.innerJoin(
      players,
      eq(players.id, players_to_tournaments.player_id),
    );

  // getting the played games list
  const allGames = db.select().from(games);
  const tournamentGames = await allGames.where(
    eq(games.tournament_id, tournamentId),
  );
  // TODO: add the game updating mechanism

  // converting the database specific players model to the agnostic one, and resolve all the promises
  const matchedEntitiesPromises = tournamentPlayersDetailed.map(
    convertPlayerToEntity,
  );
  const matchedEntities = await Promise.all(matchedEntitiesPromises);

  // getting the bootstrap for the map, initially for all the players the pools are the same
  const initialEntitiesPools = await getInitialEntitiesIdPairs(matchedEntities);
  const poolById: PoolById = new Map(initialEntitiesPools);
  const poolByIdUpdated = updateChessEntitiesMatches(poolById, tournamentGames);


  console.log( poolByIdUpdated)
  const entitiesMatchingsGenerated = await generateRoundRobinPairs(
    matchedEntities,
    tournamentGames,
  );
  const colouredMatchesPromises =
    entitiesMatchingsGenerated.map(getColouredPair);
  const colouredMatches = await Promise.all(colouredMatchesPromises);


  const currentOffset = tournamentGames.length;
  const numberedMatchesPromises = colouredMatches.map(
    (colouredMatch, coulouredMatchIndex) => getNumberedPair(colouredMatch, coulouredMatchIndex, currentOffset)
  );

  const numberedMatches = await Promise.all(numberedMatchesPromises);


  const gameToInsertPromises = numberedMatches.map(
    (numberedMatch) => getGameToInsert(numberedMatch, tournamentId, roundNumber)
  )
  const gamesToInsert = await Promise.all(gameToInsertPromises);

  // console.log(tournamentGames);
  // await db.insert(games).values(gamesToInsert);
}

async function getGameToInsert(numberedMatch: NumberedEntitiesPair, tournamentId: string, roundNumber: number): Promise<InsertDatabaseGame> {
    const gameId = newid();
    const whiteId = numberedMatch.whiteEntity.entityId;
    const blackId = numberedMatch.blackEntity.entityId;
    const gameToInsert: InsertDatabaseGame = {
      id: gameId,
      white_id: whiteId,
      black_id: blackId,
      tournament_id: tournamentId,
      round_number: roundNumber,
      round_name: null,
      white_prev_game_id: null,
      black_prev_game_id: null,
      result: null
    }
    return gameToInsert
}

/**
 * This function gets a coloured entities pair, and assigns them a provided number, judging by the offset. 
 * @param colouredPair a coloured pair
 * @param pairNumber a number to number a pair with
 * @param offset an offset, which is being added to provided pair number
 */
async function getNumberedPair(
  colouredPair: ColouredEntitiesPair,
  pairNumber: number,
  offset: number = 0
): Promise<NumberedEntitiesPair>{

  // getting the number offset of a current pair
  const pairNumberOffseted = pairNumber + offset;

  // constructing the additional properties of numbered pair
  const partialNumberedPair: OnlyChild<NumberedEntitiesPair, ColouredEntitiesPair> = {pairNumber: pairNumberOffseted}

  // merging coloured ones, and the new ones together
  const numberedPair: NumberedEntitiesPair = Object.assign(partialNumberedPair, colouredPair);
  
  return numberedPair;
};


/**
 * This function gets a pair, and colours it according to the colour index
 * @param uncolouredPair the pair of two entities, array like
 * @returns a promise of a coloured pair object
 */
async function getColouredPair(
  uncolouredPair: EntitiesPair,
): Promise<ColouredEntitiesPair> {
  let [whiteEntity, blackEntity] = uncolouredPair;

  // reversing the white and black, if the white colour index is bigger
  // (that means that current white has played more whites, than black player)
  // or if the colour is the same, then if the white rating is bigger, then we also reverse
  if (
    whiteEntity.entityColourIndex > blackEntity.entityColourIndex ||
    (whiteEntity.entityColourIndex === blackEntity.entityColourIndex &&
      whiteEntity.entityRating > blackEntity.entityRating)
  ) {
    [whiteEntity, blackEntity] = [blackEntity, whiteEntity];
  }
  const colouredPair: ColouredEntitiesPair = { whiteEntity, blackEntity };

  return colouredPair;
}

/**
 * This function takes an entities pool constructs a list of possible pairs of those
 * @param poolById always EVEN set of players
 */
async function generateRoundRobinPairs(
  poolById: PoolById
) {
  const generatedPairs = [];
  
  const entitiesIdIterator = poolById.keys();
  const entitiesIds = Array.from(entitiesIdIterator);

  // creating a copy for dynamic programming way of constructing pairs
  const remainingEntitiesPool = Array.from);

  // until the pool is not zero, we continue slicing it
  while (remainingEntitiesPool.length !== 0) {
    // it is guaranteed that it will be even, and thus we use a type guards here
    const firstEntity = remainingEntitiesPool.pop() as ChessTournamentEntity;
    const secondEntity = remainingEntitiesPool.pop() as ChessTournamentEntity;

    // generating a new pair
    const generatedPair: EntitiesPair = [firstEntity, secondEntity];
    generatedPairs.push(generatedPair);
  }

  return generatedPairs;
}

/**
 * This function gets the initial (or not) matched pools by id maps, which should show the possible opponent-entities for each entity
 * It also gets list of the games, by which the possible remained matches are being recorded
 * It returns the pools without already matched pairs, dual sided -- chess style
 * @param poolById  map-like which is recording which player pair played already
 * @param gamesPlayed a list of games
 * @returns the wasPlayed initial one, but with recorded games in it
 */
function updateChessEntitiesMatches(
  poolById: PoolById,
  gamesPlayed: DatabaseGame[],
) {

  // for every game we get the pair, and delete respective entry from each of the two pools of the possible
  // players
  gamesPlayed.forEach((chessGamePlayed) => {
    const { white_id: whiteId, black_id: blackId } = chessGamePlayed;
    const whitePool = poolById.get(whiteId);
    whitePool?.delete(blackId);
    const blackPool = poolById.get(blackId);
    blackPool?.delete(whiteId);
  });

  return poolById;
}


generateRoundRobinRound(TEST_TOURNAMENT, TEST_ROUND_NUMBER);
