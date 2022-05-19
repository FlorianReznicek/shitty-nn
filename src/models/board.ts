import {Network} from "./network";

export enum Color {
    EMPTY ,
    RED,
    YELLOW,
}



export class Board {
    public readonly BOARD_COLUMN_COUNT = 7
    public readonly BOARD_ROW_COUNT = 6
    public readonly BOARD_FIELD_COUNT = this.BOARD_COLUMN_COUNT * this.BOARD_ROW_COUNT
    private state: Array<Color>

    constructor() {
        this.state = Array<Color>(this.BOARD_FIELD_COUNT).fill(Color.EMPTY)
    }

    getState() {
        return this.state
    }

    isColumnPlayable(column: number): boolean {
        return this.state[column] === null
    }

    placeStone(column: number, color: Color) {
        this.state[this.getFreeCellInColumn(column)] = color
    }



    private getFreeCellInColumn(column: number): number {
        for (let row = this.BOARD_ROW_COUNT; row >= 0; row--) {
            if (this.getFieldState(row, column) === Color.EMPTY) return this.getField(row, column)
        }

        throw Error('Invalid move, cannot place in full column')
    }

    public getFieldState(row: number, column: number): Color {
        return this.state[this.getField(row, column)]
    }

    private getField(row: number, column: number): number {
        return row * this.BOARD_COLUMN_COUNT + column
    }
}