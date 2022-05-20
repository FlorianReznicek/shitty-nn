import {Color} from "./models/board";
import {GameController} from "./models/game-controller";
import {HumanPlayer} from "./models/human-player";
import {AIPlayer} from "./models/ai-player";

async function main() {
    const gc = new GameController(new HumanPlayer(), await AIPlayer.fromFile(process.argv[2], true), true)
    const result = await gc.play()
    console.log(result)
}

(async () => {
    await main()
})();
