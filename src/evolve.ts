import {EvolutionController} from "./models/evolution-controller";

async function main() {
    const evolutionController = new EvolutionController()
    await evolutionController.evolve(10)
}

(async () => {
    await main()
})();
