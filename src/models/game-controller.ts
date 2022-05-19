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

    constructor(player1: Player, player2: Player) {
        this.players = [player1, player2]
        this.board = new Board()
    }

    public async play(): Promise<Result> {
        this.players[0].setColor(Color.YELLOW)
        this.players[1].setColor(Color.RED)

        for (let i = 0; i < this.board.BOARD_FIELD_COUNT; i++) {
            const playerOnTurn = this.players[this.onTurn]
            const choice = await playerOnTurn.makeChoice(this.board)
            const played = this.board.placeStone(choice, playerOnTurn.getColor())

            Console.printBoard(this.board)
            await asyncSleep(500)

            this.moves.push(played)
            if (this.board.hasConnected4(played)) {
                Console.printBoard(this.board)
                console.log(`${this.onTurn ? 'Player 2' : 'Player 1'} has won!`)
                return this.onTurn ? Result.PLAYER2_WIN : Result.PLAYER1_WIN
            }
            this.toggleTurn()
        }
        return Result.DRAW
    }

    private toggleTurn() {
        this.onTurn = this.onTurn === 0 ? 1 : 0
    }
}