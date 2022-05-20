import {Player} from "./abstract-player";
import { Console } from "./console";
import {GameController, Result} from "./game-controller";
import {asyncSleep, waitInput} from "./helper";
import {AIPlayer} from "./ai-player";
import {TournamentController} from "./tournament-controller";
import fs from "fs";

export class EvolutionController {
    generation: number
    populationSize: number = 50
    topNmoveOn: number = 5
    players: Array<Player>
    ID: string

    private performance: Array<number> = new Array<number>()

    constructor() {
        this.generation = 0
        this.players = Array.from({ length: this.populationSize }, () => new AIPlayer(`Gen${this.generation}`))
        const now = new Date()
        this.ID = `${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`
    }

    public async evolve(cycles: number): Promise<void> {
        // console.log('Generation ')
        for (this.generation; this.generation < cycles; this.generation++) {
            const exhibitionRound = this.generation%100 === 0

            if ( this.generation%10 === 0) {
                process.stdout.moveCursor(0,-1)
                process.stdout.clearLine(0)
                console.log('Generation ' + (this.generation))
            }

            // const tournament = new TournamentController(this.players, exhibitionRound)
            const tournament = new TournamentController(this.players, exhibitionRound)
            const results = await tournament.play()

            // take the top n players to next round and fill the rest with new randos
            // if (this.generation%10 == 0) {
            //     console.log(results.slice(0, this.topNmoveOn))
            //     asyncSleep(1000)
            // }

            const winners = results.slice(0, this.topNmoveOn).map(({ player }) => player) as Array<AIPlayer>
            if (exhibitionRound) {
                // console.log(results.slice(0, this.topNmoveOn))
                await this.measurePerformance(this.players[0])
            }

            if (this.generation === cycles - 1 || this.generation > 0 && this.generation % 1000 === 0) {
                console.log(this.performance)
                await this.saveGeneration(this.players)
            }

            this.players = this.generateNextGen(winners)
        }
    }

    private generateNextGen(players: Array<AIPlayer>): Array<Player> {
        const nextGen: Array<Player> = []

        for(let i = 0; i < this.populationSize - players.length; i++) {

            const daddy = players[Math.floor(Math.random()*players.length)]
            const mommy = players[Math.floor(Math.random()*players.length)]

            const baby = AIPlayer.fromSexyTime(mommy, daddy, this.generation)
            nextGen.push(baby)
        }

        return nextGen.concat(players)
    }

    private async measurePerformance(champ: Player) {
        console.log('Generation ' + (this.generation))
        const randos: Array<Player> = Array.from({ length: 20 }, () => new AIPlayer(`Rando`))
        const tournament = new TournamentController(randos.concat([champ]))
        const result = await tournament.play()

        await champ.saveToFile()

        const champResult = result.find(res => res.player.ID === champ.ID)!

        this.performance.push(champResult.score)

        console.log(`Generation ${this.generation} performing ${Math.round((champResult.score * 100)/19 - 100)}% better than random.`)
        await new Promise((resolve, reject) => {
            fs.writeFile('performace.json', JSON.stringify(this.performance), 'utf8', (error) => {
                if (!error) return resolve(true)
                reject(error)
            })
        })
    }

    private async saveGeneration(players: Array<Player>) {
        const dirName = `gen-${this.ID}-${this.generation}`
        fs.mkdirSync(`gen-${this.ID}-${this.generation}`)
        for (const player of this.players) {
            await player.saveToFile(dirName)
        }
        // await waitInput()
    }

    public async continueFromJSON(folder: string): Promise<void> {

    }
}