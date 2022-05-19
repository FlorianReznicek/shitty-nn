import {Board, Color} from "./board";
import {Player} from "./abstract-player";
import * as readline from "readline";
import * as util from "util";
import {Console} from "./console";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export class HumanPlayer extends Player{
    public async makeChoice(board: Board): Promise<number> {
        Console.printBoard(board)

        const promptMove = await util.promisify(rl.question)

        let validInput = false
        while(!validInput) {
            const input = await promptMove('Your turn, enter a column 1-7')
            console.log(input)

            validInput = true
            return 4
            //const column = input - 1
            //if([1,2,3,4,5,6,7].includes)
            //const columnPlayable = board.isColumnPlayable(column)
        }
        return 3
    }
}