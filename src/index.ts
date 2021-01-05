import { Server } from 'ws';
import { Computer } from './computer';
import { App, launch } from 'carlo';
import { resolve } from 'path';
import Queue from 'p-queue';

const wss = new Server({ port: 5757 });

let computers: { [label: string]: Computer } = {};

let app: App;

const queue = new Queue({ concurrency: 1 });
const computerAddQueue = new Queue({ concurrency: 1 });
computerAddQueue.pause();

(async () => {
    app = await launch();
    app.on('exit', () => process.exit());
    app.serveFolder(resolve(process.cwd(), "frontend/out"));

    await app.load('http://localhost:3000');

    computerAddQueue.start();
})

wss.on('connection', async function connection(ws) {
    await computerAddQueue.add(() => {
        let computer = new Computer(ws);
        computer.on('init', async () => {
            computers[computer.label] = computer;
            computer.on('update', () => app.evaluate(`if (window.setTurtles) window.setTurtles(${serializeTurtles()})`));
            await app.evaluate(`if (window.setTurtles) window.setTurtles(${serializeTurtles()})`)
            await app.evaluate(`if (window.setWorld) window.setWorld(${JSON.stringify(world.getAllBlocks())})`);
            ws.on('close', async () => {
                delete computer[computer.label];
                await app.evaluate(`if (window.setTurtles) window.setTurtles(${serializeTurtles()})`)
            });
        });
    });
});