import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export async function asyncSleep(ms: number): Promise<void> {
    // return
    await new Promise(resolve => setTimeout(resolve, ms))
}

export async function waitInput(): Promise<void> {
    await new Promise((resolve) => {
        rl.question('Press any key to continue \n', str => resolve(parseInt(str)))
    })
}