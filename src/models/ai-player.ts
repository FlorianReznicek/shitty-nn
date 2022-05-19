import {Network} from "./network";
import {Board, Color} from "./board";
import {Console} from "./console";
import {Player} from "./abstract-player";

export class AIPlayer extends Player{
    private network: Network

    constructor() {
        super()
        this.network = Network.fromRandom()
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
}