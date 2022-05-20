import {AIPlayer} from "./ai-player";

type Biases = Array<Array<number>>
type Weights = Array<Array<Array<number>>>

const DEFAULT_LAYER_SIZES = [
    42, // 6x7 grid
    20, // no idea
    //40, // no idea
    7 // 7 columns output
]

// const DEFAULT_LAYER_SIZES = [
//     3, // 6x7 grid
//     5, // no idea
//     //40, // no idea
//     2 // 7 columns output
// ]

const DEFAULT_SIGMOID_RANGE = 2
const DEFAULT_BIAS_RANGE = 0.1
const MUTATION_RATE = 0.05

export class Network {
    private readonly layerSizes: Array<number>
    biases: Biases
    weights: Weights
    sigmoidRange: number
    biasRange: number
    logEnabled: boolean

    constructor(biases: Biases, weights: Weights, layerSizes: Array<number> = DEFAULT_LAYER_SIZES, sigmoidRange: number = DEFAULT_SIGMOID_RANGE, biasRange: number = DEFAULT_BIAS_RANGE, logEnabled: boolean = false) {
        this.biases = biases
        this.weights = weights
        this.layerSizes = layerSizes
        this.sigmoidRange = sigmoidRange
        this.biasRange = biasRange
        this.logEnabled = logEnabled
    }

    run(layer: Array<number>): Array<number> {
        if (layer.length !== this.layerSizes[0]) throw 'nope'

        for (let layerIndex = 0; layerIndex < this.layerSizes.length - 1; layerIndex++) {
            layer = this.weights[layerIndex].map((weightsForNeuron, neuronIndex) => {
                if (this.logEnabled) {
                    console.log({
                        layerIndex, neuronIndex, sum: weightsForNeuron.reduce((sum, weight, weightIndex) => {
                            // console.log({ input: layer[weightIndex], weight, sum })
                            return sum + (layer[weightIndex] * weight)
                        }, 0),
                        bias: this.biases[layerIndex][neuronIndex],
                        sigi: this.sigmoid(weightsForNeuron.reduce((sum, weight, weightIndex) => {
                            // console.log({ input: layer[weightIndex], weight, sum })
                            return sum + (layer[weightIndex] * weight)
                        }, 0) + this.biases[layerIndex][neuronIndex])
                    })
                }
                return this.sigmoid(weightsForNeuron.reduce((sum, weight, weightIndex) => {
                    // console.log({ input: layer[weightIndex], weight, sum })
                    return sum + (layer[weightIndex] * weight)
                }, 0) + this.biases[layerIndex][neuronIndex])
            })
        }

        return layer
    }

    private sigmoid(z: number): number {
        return 1 / (1 + Math.exp(-z / this.sigmoidRange));
    }

    static fromRandom(): Network {
        const LAYER_SIZES = DEFAULT_LAYER_SIZES

        const biases = LAYER_SIZES.slice(1).map((layerSize, i) => {
            return Array.from({length: layerSize}, () => {
                // console.log({
                //     layerSize: LAYER_SIZES[i],
                //     range: BIAS_RANGE,
                // })
                const factor = LAYER_SIZES[i] * DEFAULT_BIAS_RANGE
                // console.log(factor)
                // console.log((0 * factor) - (factor * 0.5))
                // console.log((1 * factor) - (factor * 0.5))
                return (Math.random() * factor) - (factor * 0.5)
            })
            // return Array.from({ length: layerSize }, () => Math.random() * LAYER_SIZES[i] * BIAS_RANGE - LAYER_SIZES[i])
        })
        const weights = LAYER_SIZES.slice(1).map((layerSize, i) => {
            return Array.from({length: layerSize}, () => Array.from({length: LAYER_SIZES[i]}, () => Math.random() * 2 - 1))
        })

        return new Network(biases, weights, LAYER_SIZES)
    }

    public toJSON(): string {
        return JSON.stringify({
            layerSizes: this.layerSizes,
            biases: this.biases,
            weights: this.weights,
            sigmoidRange: this.sigmoidRange,
            biasRange: this.biasRange,
        })
    }


    static fromJSON(json: string): Network {
        const {
            layerSizes,
            biases,
            weights,
            sigmoidRange,
            biasRange,
        } = JSON.parse(json)
        return new Network(biases, weights, layerSizes, sigmoidRange, biasRange)
    }

    static fromRecombination(networks: [Network, Network]): Network {
        const LAYER_SIZES = networks[0].layerSizes

        const biases = LAYER_SIZES.slice(1).map((layerSize, i) => {
            return Array.from({length: layerSize}, (a, index) => {
                return Math.random() > MUTATION_RATE ? networks[Math.random() >= 0.5  ? 0 : 1].biases[i][index] : Network.randomBias(LAYER_SIZES[i])
            })
        })

        // const weights = LAYER_SIZES.slice(1).map((layerSize, i) => {
        //     return Array.from({length: layerSize}, () => {
        //         Array.from({length: LAYER_SIZES[i]}, () => {
        //             return Math.random() * 2 - 1
        //         })
        //     })
        // })

        const weights = LAYER_SIZES.slice(1).map((layerSize, i) => {
            return Array.from({length: layerSize}, (a, j) => {
                return Array.from({length: LAYER_SIZES[i]}, (b, k) => {
                    return Math.random() > MUTATION_RATE ? networks[Math.random() >= 0.5  ? 0 : 1].weights[i][j][k] : Math.random() * 2 - 1
                })
            })
        })

        return new Network(biases, weights, LAYER_SIZES)
        // console.log(miau.weights)
        // return miau
    }

    static randomBias(layerSize: number): number {
        const factor = layerSize * DEFAULT_BIAS_RANGE
        return (Math.random() * factor) - (factor * 0.5)
    }

}

