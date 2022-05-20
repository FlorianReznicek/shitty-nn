import {Board, Color} from "./board";
import {Player} from "./abstract-player";
import * as readline from "readline";
import {Console} from "./console";
import fs from "fs";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export class HumanPlayer extends Player{
    public async makeChoice(board: Board): Promise<number> {
        Console.printBoard(board)

        let validInput = false
        while(!validInput) {
            process.stdout.moveCursor(0,-2)
            const input: number = await new Promise((resolve, _reject) => {
                rl.question('Your turn, enter a column 1-7 \n', str => resolve(parseInt(str)))
            })
            if(![1,2,3,4,5,6,7].includes(input) || !board.isColumnPlayable(input - 1)) {
                console.log('Not a valid input, try again you stupid ass mf')
                continue
            }

            validInput = true
            return input - 1
        }
        throw Error('no choice made')
    }

    public async saveToFile(): Promise<string> {
        throw Error('not implemented')
    }
}