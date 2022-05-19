import {Network} from "./network";
import {Board, Color} from "./board";

export enum NORMALIZED_COLOR {
    OPPONENT = 0,
    EMPTY = 0.5,
    MINE = 1,
}

export class Player {
    private network: Network
    private color: Color

    constructor(color: Color) {
        this.network = Network.fromRandom()
        this.color = color
    }

    public makeChoice(board: Board): number {
        const preferences = this.network.run(this.getNormalizedBoardState(board))

        const choice = preferences.reduce((highestActivation, activation, column) => {
            const columnPlayable = board.isColumnPlayable(column)
            if (activation > highestActivation.activation) return { column, activation }
            return highestActivation
        }, { column: -1, activation: 0 })

        return choice.column
    }

    getNormalizedBoardState(board: Board): Array<NORMALIZED_COLOR> {
        return board.getState().map(field => {
            switch (field) {
                case this.color:
                    return NORMALIZED_COLOR.MINE
                case null:
                    return NORMALIZED_COLOR.EMPTY
                default:
                    return NORMALIZED_COLOR.OPPONENT
            }
        })
    }
}