import {Player} from "./abstract-player";
import {Board, Color} from "./board";

enum Result {
    PLAYER1_WIN,
    PLAYER2_WIN,
    DRAW,
}

export class GameController {
    players: [Player, Player]
    board: Board
    private moves: Array<number> = Array<number>()
    private onTurn = 0

    constructor(player1: Player, player2: Player) {
        this.players = [player1, player2]
        this.board = new Board()
    }

    public async getResult(row: number, column: number) {
        let winner = undefined
        while (!winner) {
            const playerOnTurn = this.players[this.onTurn]
            const choice = await playerOnTurn.makeChoice(this.board)
            const played = this.board.placeStone(choice, playerOnTurn.color)
            if (this.board.hasConnected4(played)) winner = playerOnTurn
            this.toggleTurn()
        }
        console.log(winner, ' won')
    }

    private toggleTurn() {
        this.onTurn = this.onTurn === 0 ? 1 : 0
    }
    // private isMoveWinning(lastMove: number): boolean {
    // }
}