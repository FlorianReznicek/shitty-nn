import {Player} from "./abstract-player";
import {GameController, Result} from "./game-controller";

export class TournamentController {
    players: Array<Player>
    score: Array<number>

    constructor(players: Array<Player>) {
        this.players = players
        this.score = new Array<number>(players.length).fill(0)
    }

    public async play(): Promise<void> {
        for (const [i, player1] of this.players.entries()) {
            for (const [j, player2] of this.players.entries()) {
                if(i === j) continue // don't play against itself
                const game = new GameController(player1, player2)
                const result = await game.play()

                console.log({ result })
                console.log({ score: this.score })
                switch (result) {
                    case Result.PLAYER1_WIN:
                        this.score[i]+=1
                        break
                    case Result.PLAYER2_WIN:
                        this.score[j]+=1
                        break
                    case Result.DRAW:
                        this.score[i]+=0.5
                        this.score[j]+=0.5
                }
            }
        }
        const result = this.players.map((player, index) => ({
            player, score: this.score[index]
        })).sort((a, b) => a.score - b.score)

        console.log(result)
    }
}