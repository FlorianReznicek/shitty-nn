import {Board, Color} from "./board";

export enum NORMALIZED_COLOR {
    OPPONENT = 0,
    EMPTY = 0.5,
    MINE = 1,
}

export abstract class Player {
    private color?: Color

    public abstract makeChoice(board: Board): Promise<number>

    public getColor(): Color {
        if (!this.color) throw Error('no color set')
        return this.color
    }

    public setColor(color: Color) {
        this.color = color
    }

    public getNormalizedBoardState(board: Board): Array<NORMALIZED_COLOR> {
        if (!this.color) throw Error('no color')
        return board.getState().map(field => {
            switch (field) {
                case this.color:
                    return NORMALIZED_COLOR.MINE
                case Color.EMPTY:
                    return NORMALIZED_COLOR.EMPTY
                default:
                    return NORMALIZED_COLOR.OPPONENT
            }
        })
    }
}