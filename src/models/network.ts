const LAYER_SIZES = [
    42, // 6x7 grid
    20, // no idea
    7 // 7 columns output
]
const SIGMOID_RANGE = 2

type Biases = Array<Array<number>>
type Weights = Array<Array<Array<number>>>

export class Network {
    biases: Biases
    weights: Weights

    constructor(biases: Biases, weights: Weights) {
        this.biases = biases

        this.weights = weights
    }

    run(layer: Array<number>): Array<number> {
        if (layer.length !== LAYER_SIZES[0]) throw 'nope'

        for (let layerIndex = 0; layerIndex < LAYER_SIZES.length - 1; layerIndex++) {
            layer = this.weights[layerIndex].map((weightsForNeuron, neuronIndex) => {
                return sigmoid(weightsForNeuron.reduce((sum, weight, weightIndex) => sum + (layer[weightIndex]*weight), 0) - this.biases[layerIndex][neuronIndex])
            })
        }

        return layer
    }

    static fromRandom(): Network {
        const biases = LAYER_SIZES.slice(1).map((layerSize, i) => {
            return Array.from({ length: layerSize }, () => Math.random() * LAYER_SIZES[i] * 2 - LAYER_SIZES[i])
        })
        const weights = LAYER_SIZES.slice(1).map((layerSize, i) => {
            return Array.from({ length: layerSize }, () => Array.from({ length: LAYER_SIZES[i] }, () => Math.random() * 2 - 1))
        })

        return new Network(biases, weights)
    }
}

function sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-z/SIGMOID_RANGE));
}