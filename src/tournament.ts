import {Color} from "./models/board";
import {GameController} from "./models/game-controller";
import {HumanPlayer} from "./models/human-player";
import {AIPlayer} from "./models/ai-player";
import {TournamentController} from "./models/tournament-controller";

async function main() {
    const tournament = new TournamentController(Array.from({ length: 10 }, () => new AIPlayer()))
    const results = await tournament.play()
    console.log(results)
}

(async () => {
    await main()
})();
