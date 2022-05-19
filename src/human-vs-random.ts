import {Color} from "./models/board";
import {GameController} from "./models/game-controller";
import {HumanPlayer} from "./models/human-player";
import {AIPlayer} from "./models/ai-player";

async function main() {
    const gc = new GameController(new HumanPlayer(), new AIPlayer())
    const result = await gc.play()
    console.log(result)
}

(async () => {
    await main()
})();
