import {Network} from "./network";
import {Board, Color} from "./board";
import {Console} from "./console";

export enum NORMALIZED_COLOR {
    OPPONENT = 0,
    EMPTY = 0.5,
    MINE = 1,
}

export abstract class Player {
    public color: Color

    constructor(color: Color) {
        this.color = color
    }

    public abstract makeChoice(board: Board): Promise<number>

    public getNormalizedBoardState(board: Board): Array<NORMALIZED_COLOR> {
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