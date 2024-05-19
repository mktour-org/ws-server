import { db } from './db';
import {
  players,
  players_to_tournaments,
  games,
  type DatabasePlayer,
  type DatabasePlayerToTournament,
} from './db/schema/tournaments';
import { eq } from 'drizzle-orm';





/**
 * This function purposefully generates the bracket round for the round robin tournament. It gets the 
 * tournamentId, checks the query for the current list of players, and  gets the games played by them. 
 * By using that information, it returns the new games list, which are then published to the respective
 * ws.
 */
async function generateRoundRobinRound(tournamentId: string){

    const currentPlayers = await db.select().from(players_to_tournaments).where(
    eq(players_to_tournaments.tournament_id, tournamentId)
    )

    const gamesPlayed = await db.select().from(games).where(
        eq(games.tournament_id, tournamentId)
    )

    
}

/**
 * This function generates matrix of the previous pairs 
 */
function getPreviousGameMatrix(){

}