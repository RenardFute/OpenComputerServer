import { Server } from 'ws';
import { Computer } from './computer';
import { App, launch } from 'carlo';
import { resolve } from 'path';
import Queue from 'p-queue';

const wss = new Server({ port: 5757 });

const computers: { [label: string]: Computer } = {};

let app: App;

const queue = new Queue({ concurrency: 1 });
const computerAddQueue = new Queue({ concurrency: 1 });
computerAddQueue.pause();

(async () => {
    app = await launch();
    app.on('exit', () => process.exit());
    app.serveFolder(resolve(process.cwd(), "frontend/out"));

    await app.exposeFunction('execLua', async (index: number, func: string, ...args: any[]) => {
        if (typeof index === 'string') {
            [index, func, ...args] = JSON.parse(index).args;
        }
        return queue.add(() => ((computers[index] as any)[func])(...args));
    });
    await app.exposeFunction('execBash', async (index: number, func: string, ...args: any[]) => {
        if (typeof index === 'string') {
            [index, func, ...args] = JSON.parse(index).args;
        }
        return queue.add(() => ((computers[index] as any)[func])(...args));
    });


    await app.load('http://localhost:3000');

    computerAddQueue.start();
})()

wss.on('connection', async function connection(ws) {
    await computerAddQueue.add(() => {
        const computer = new Computer(ws);
        computer.on('init', async () => {
            computers[computer.label] = computer;
            ws.on('close', async () => {
                delete computers[computer.label];
            });
        });
    });
});