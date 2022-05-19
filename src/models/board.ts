import {Network} from "./network";

export enum Color {
    EMPTY ,
    RED,
    YELLOW,
}

export interface Field {
    row: number
    column: number
    color: Color
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
        return this.state[column] === Color.EMPTY
    }

    placeStone(column: number, color: Color): Field {
        const field = this.getFreeCellInColumn(column)
        field.color = color
        this.setField(field)
        return field
    }

    // we can narrow search for win condition by the last played column
    public hasConnected4(lastPlay: Field): boolean {
        // check horizontally
        let count: number = 0
        for(let column = 0; column < this.BOARD_COLUMN_COUNT; column++) {
            if (this.getFieldState(lastPlay.row, column) === lastPlay.color) count++
            else count = 0
            if (count === 4) return true
        }

        // check vertically
        count = 0
        for(let row = 0; row < this.BOARD_ROW_COUNT; row++) {
            if (this.getFieldState(row, lastPlay.column) === lastPlay.color) count++
            else count = 0
            if (count === 4) return true
        }

        // check diagonally top left to bottom right
        count = 0
        let { row, column } = lastPlay
        // move cursor to top left
        while (row >= 0 && column >= 0) {
            row--
            column--
        }
        while(row < this.BOARD_ROW_COUNT && column < this.BOARD_COLUMN_COUNT) {
            if (this.getFieldState(row, column) === lastPlay.color) count++
            else count = 0
            if (count === 4) return true
            row++
            column++
        }

        // check diagonally bottom left to top right
        count = 0
        row = lastPlay.row
        column = lastPlay.column
        // move cursor to bottom left
        while (row < this.BOARD_ROW_COUNT && column >= 0) {
            row++
            column--
        }
        while(row >= 0 && column < this.BOARD_COLUMN_COUNT) {
            if (this.getFieldState(row, column) === lastPlay.color) count++
            else count = 0
            if (count === 4) return true
            row--
            column++
        }

        return false
    }

    private getFreeCellInColumn(column: number): Field {
        for (let row = this.BOARD_ROW_COUNT; row >= 0; row--) {
            if (this.getFieldState(row, column) === Color.EMPTY) return {
                row,
                column,
                color: Color.EMPTY,
            }
        }

        throw Error('Invalid move, cannot place in full column')
    }

    public getFieldState(row: number, column: number): Color {
        return this.state[this.getFieldIndex(row, column)]
    }

    private getFieldIndex(row: number, column: number): number {
        return row * this.BOARD_COLUMN_COUNT + column
    }

    private setField(field: Field) {
        this.state[this.getFieldIndex(field.row, field.column)] = field.color
    }
}