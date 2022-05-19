import {Player} from "./models/player";
import {Board, Color} from "./models/board";
import { Console } from "./models/console";

async function main() {
    const player = new Player(Color.RED)
    const board = new Board()

    const miau = player.makeChoice(board)
    board.placeStone(miau, Color.RED)
    board.placeStone(3, Color.YELLOW)
    const miau2 = player.makeChoice(board)
    board.placeStone(miau2, Color.RED)
    board.placeStone(4, Color.YELLOW)
    Console.printBoard(board)
}

(async () => {
    await main()
})();
