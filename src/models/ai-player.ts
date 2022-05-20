import {Network} from "./network";
import {Board} from "./board";
import {Player} from "./abstract-player";
import * as fs from "fs";

export class AIPlayer extends Player{
    network: Network
    private name?: string
    private logEnabled: boolean = false

    constructor(name: string = 'unnamed', network?: Network, logEnabled: boolean = false) {
        super()
        const now = new Date()
        this.name = `${name}-${this.ID}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.${now.getMilliseconds()}`
        this.network = network || Network.fromRandom()
        this.network.logEnabled = logEnabled
        this.logEnabled = logEnabled
    }

    toString() {
        return `AI ${this.name || ''}(ID: ${this.ID})`
    }

    public async saveToFile(dirname?: string): Promise<string> {
        const filePath = `${dirname || 'save'}/${this.name}_${this.ID}.json`
        await new Promise((resolve, reject) => {
            fs.writeFile(filePath, this.network.toJSON(), 'utf8', (error) => {
                if (!error) return resolve(true)
                reject(error)
            })
        })
        console.log(`saved to file ${filePath}`)
        return filePath
    }

    public async makeChoice(board: Board): Promise<number> {
        const preferences = this.network.run(this.getNormalizedBoardState(board))
        if (this.logEnabled) console.log({ preferences })
        const choice = preferences.reduce((highestActivation, activation, column) => {
            const columnPlayable = board.isColumnPlayable(column)
            if (activation > highestActivation.activation && columnPlayable) return { column, activation }
            return highestActivation
        }, { column: -1, activation: 0 })

        if (choice.column < 0) throw Error('Cannot find valid column, board full?')
        return choice.column
    }

    static async fromFile(path: string, logEnabled: boolean = false): Promise<Player> {
        const json: string = await new Promise((resolve) => {
            fs.readFile(path, (err, data) => {
                if (err) throw err;
                resolve(data.toString())
            });
        })

        const network = Network.fromJSON(json)
        network.logEnabled = true
        return new AIPlayer(path, network, logEnabled)
    }

    static fromSexyTime(mommy: AIPlayer, daddy: AIPlayer, generationName?: number): Player {
        return new AIPlayer(`Child-${generationName}-ID`, Network.fromRecombination([mommy.network, daddy.network]))
    }
}