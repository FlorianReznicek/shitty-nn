import {EvolutionController} from "./models/evolution-controller";
import {Player} from "./models/abstract-player";
import {AIPlayer} from "./models/ai-player";

async function main() {
    const evolutionController = new EvolutionController()
    await evolutionController.evolve(parseInt(process.argv[2]) || 100)
    // const player1 = new AIPlayer('a')
    // const player2 = new AIPlayer('b')
    // const p3 = AIPlayer.fromSexyTime(player2, player1)
}

(async () => {
    await main()
})();
