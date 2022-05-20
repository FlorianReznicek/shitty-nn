import {Network} from "./network";
import {Board} from "./board";
import {Player} from "./abstract-player";
import * as fs from "fs";

export class AIPlayer extends Player{
    private network: Network
    private name?: string

    constructor(name: string = 'unnamed', network?: Network) {
        super()
        const now = new Date()
        this.name = `${name}-${this.ID}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.${now.getMilliseconds()}`
        this.network = network || Network.fromRandom()
    }

    toString() {
        return `AI ${this.name || ''}(ID: ${this.ID})`
    }

    public async saveToFile(): Promise<string> {
        const filePath = `save/${this.name}_${this.ID}.json`
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

        const choice = preferences.reduce((highestActivation, activation, column) => {
            const columnPlayable = board.isColumnPlayable(column)
            if (activation > highestActivation.activation && columnPlayable) return { column, activation }
            return highestActivation
        }, { column: -1, activation: 0 })

        if (choice.column < 0) throw Error('Cannot find valid column, board full?')
        return choice.column
    }

    static async fromFile(path: string): Promise<Player> {
        const file = `save/${path}`
        const json: string = await new Promise((resolve) => {
            fs.readFile(file, (err, data) => {
                if (err) throw err;
                resolve(data.toString())
            });
        })

        const network = Network.fromJSON(json)
        return new AIPlayer(path, network)
    }
}