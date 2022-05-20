import {Player} from "./abstract-player";
import { Console } from "./console";
import {GameController, Result} from "./game-controller";
import {asyncSleep, waitInput} from "./helper";
import {AIPlayer} from "./ai-player";
import {TournamentController} from "./tournament-controller";

export class EvolutionController {
    generation: number
    populationSize: number = 50
    topNmoveOn: number = 20
    players: Array<Player>

    private performance: Array<number> = new Array<number>()

    constructor() {
        this.generation = 0
        this.players = Array.from({ length: this.populationSize }, () => new AIPlayer(`Gen${this.generation}`))
    }

    public async evolve(cycles: number): Promise<void> {
        for (this.generation; this.generation < cycles; this.generation++) {
            const exhibitionRound =false // this.generation%100 === 0

            console.log('Generation ' + (this.generation))
            const tournament = new TournamentController(this.players, exhibitionRound)
            const results = await tournament.play()

            // take the top n players to next round and fill the rest with new randos
            // if (this.generation%10 == 0) {
            //     console.log(results.slice(0, this.topNmoveOn))
            //     asyncSleep(1000)
            // }
            // this.players = results.slice(0, this.topNmoveOn).map(({ player }) => player)
            if (exhibitionRound) {
                // console.log(results.slice(0, this.topNmoveOn))
                // await this.measurePerformance(this.players[0])
            }

            this.players.push(...Array.from({ length: this.populationSize - this.topNmoveOn }, () => new AIPlayer(`Gen${this.generation}`)))


        }
    }

    private async measurePerformance(champ: Player) {
        console.log(`measuring performance`)
        const randos: Array<Player> = Array.from({ length: 20 }, () => new AIPlayer(`Rando`))
        const tournament = new TournamentController(randos.concat([champ]))
        const result = await tournament.play()

        await champ.saveToFile()

        const champResult = result.find(res => res.player.ID === champ.ID)!

        this.performance.push(champResult.score)

        console.log(this.performance)
        await waitInput()
    }

    public async continueFromJSON(folder: string): Promise<void> {

    }
}