import type { GameModel } from '@/types/tournaments';
import { db } from './db';
import {
  players,
  players_to_tournaments,
  games,
  type DatabasePlayer,
  type DatabasePlayerToTournament,
  tournaments,
} from './db/schema/tournaments';
import { eq } from 'drizzle-orm';


const TEST_TOURNAMENT = "P9pqTDZv"



/**
 * This function purposefully generates the bracket round for the round robin tournament. It gets the 
 * tournamentId, checks the query for the current list of players, and  gets the games played by them. 
 * By using that information, it returns the new games list, which are then published to the respective
 * ws.
 */
async function generateRoundRobinRound(tournamentId: string){
    // console.log(await db.select().from(players))
    const currentPlayers = await db.select().from(players).where(
    eq(players_to_tournaments.tournament_id, tournamentId)
    )

    const gamesPlayed = await db.select().from(games).where(
        eq(games.tournament_id, tournamentId)
    )

    console.log("current", currentPlayers);
    // console.log("played games", gamesPlayed)
    const newPairs = [];
    if (gamesPlayed.length === 0) {
      let availablePlayerPool = Array.from(currentPlayers);
      // console.log("pool:", availablePlayerPool)
      while (availablePlayerPool.length !== 0) {
        const matchedPlayer = availablePlayerPool.pop()
        const pairedPlayer = availablePlayerPool.pop();
        const newPair = {white: pairedPlayer, black: matchedPlayer};
        newPairs.push(newPair);
      }
    }
    console.log(newPairs);

}

/**
 * This function generates matrix of the previous pairs 
 */
function getPreviousGameMatrix(gamesPlayed: GameModel[]){
  const playerToPlayers = new Map();
  
}

generateRoundRobinRound(TEST_TOURNAMENT)