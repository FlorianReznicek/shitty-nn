import {Player} from "./abstract-player";
import { Console } from "./console";
import {GameController, Result} from "./game-controller";
import {asyncSleep} from "./helper";

type TournamentResult = Array<{
    player: Player
    score: number
    wins: number
    draws: number
    losses: number
}>

export class TournamentController {
    readonly players: Array<Player>
    private score: Array<number>
    private wins: Array<number>
    private draws: Array<number>
    private losses: Array<number>

    private exhibitionGames

    constructor(players: Array<Player>, exhibitionGames: boolean = false) {
        this.players = players
        this.score = new Array<number>(players.length).fill(0)
        this.wins = new Array<number>(players.length).fill(0)
        this.draws = new Array<number>(players.length).fill(0)
        this.losses = new Array<number>(players.length).fill(0)

        this.exhibitionGames = exhibitionGames
    }

    public async play(): Promise<TournamentResult> {
        for (const [i, player1] of this.players.entries()) {
            for (const [j, player2] of this.players.entries()) {
                if (i === j) continue // don't play against itself

                const game = new GameController(player1, player2)

                const result = await game.play()

                switch (result) {
                    case Result.PLAYER1_WIN:
                        this.score[i] += 1
                        this.wins[i] += 1
                        this.losses[j] += 1
                        break
                    case Result.PLAYER2_WIN:
                        this.score[j] += 1
                        this.wins[j] += 1
                        this.losses[i] += 1
                        break
                    case Result.DRAW:
                        this.score[i] += 0.5
                        this.score[j] += 0.5
                        this.draws[i] += 1
                        this.draws[j] += 1
                }
            }
        }
        const result = this.players.map((player, index) => ({
            player,
            score: this.score[index],
            wins: this.wins[index],
            losses: this.losses[index],
            draws: this.draws[index],
        })).sort((a, b) => b.score - a.score)

        if (this.exhibitionGames) {
            console.log("EXHIBITION GAME between the two best players of this round:")
            const game = new GameController(result[0].player, result[1].player, true)
            await game.play()
        }

        return result
    }
}