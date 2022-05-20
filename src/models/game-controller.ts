import {Player} from "./abstract-player";
import {Board, Color, Field} from "./board";
import {Console} from "./console";
import {asyncSleep} from "./helper";

export enum Result {
    PLAYER1_WIN = "PLAYER 1",
    PLAYER2_WIN = "PLAYER 2",
    DRAW = "DRAW",
}

export class GameController {
    players: [Player, Player]
    board: Board
    private moves: Array<Field> = Array<Field>()
    private onTurn = 0
    private exhibitionGame: boolean = false

    constructor(player1: Player, player2: Player, exhibitionGame: boolean = false) {
        this.players = [player1, player2]
        this.board = new Board()
        this.exhibitionGame = exhibitionGame
    }

    public async play(): Promise<[Result, number]> {
        this.players[0].setColor(Color.YELLOW)
        this.players[1].setColor(Color.RED)

        if (this.exhibitionGame) {
            console.log(`\n--------------------`)
            console.log(`${this.players[0].toString()} (YELLOW) VS. ${this.players[1].toString()} (RED) \n`)
            await asyncSleep(1000)
            Console.printBoard(this.board, false)
        }


        for (let i = 0; i < this.board.BOARD_FIELD_COUNT; i++) {
            const playerOnTurn = this.players[this.onTurn]
            const choice = await playerOnTurn.makeChoice(this.board)
            const played = this.board.placeStone(choice, playerOnTurn.getColor())
            this.moves.push(played)

            if (this.exhibitionGame) {
                Console.printBoard(this.board)
                await asyncSleep(500)
            }

            if (this.board.hasConnected4(played)) {
                if (this.exhibitionGame) {
                    process.stdout.moveCursor(0, -1)
                    process.stdout.clearLine(0)
                    console.log(this.players[this.onTurn].toString() + " has won!")
                    await asyncSleep(1000)
                }
                return [this.onTurn ? Result.PLAYER2_WIN : Result.PLAYER1_WIN, i]
            }

            this.toggleTurn()
        }
        return [ Result.DRAW, this.board.BOARD_FIELD_COUNT ]
    }

    private toggleTurn() {
        this.onTurn = this.onTurn === 0 ? 1 : 0
    }
}