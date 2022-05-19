import {Board, Color} from "./board";

const BLUE_BG = '\x1b[44m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const BLACK = '\x1b[30m'
const RESET = "\x1b[0m"

export class Console {
    static printBoard(board: Board) {
        let string = ``
        // HEADER
        for (let c = 1; c <= board.BOARD_COLUMN_COUNT; c++) {
            string += ` ${c} `
        }
        string += `\n`

        for (let r = 0; r < board.BOARD_ROW_COUNT; r++) {
            string += BLUE_BG // start blue background
            for (let c = 0; c < board.BOARD_COLUMN_COUNT; c++) {
                const color = board.getFieldState(r, c)
                string += this.mapColor(color)
                string += ` ⬤ `
            }
            string += RESET
            string += `\n`
        }

        string += RESET
        console.log(string)
    }

    private static mapColor(color: Color): string {
        switch (color) {
            case Color.EMPTY:
                return BLACK
            case Color.RED:
                return RED
            case Color.YELLOW:
                return YELLOW

        }
    }
}