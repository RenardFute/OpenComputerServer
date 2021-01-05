// @ts-ignore
import WebSocket from "ws";
import { EventEmitter } from 'events';
import { randomBytes } from 'crypto';

const nonces = new Set();
function getNonce(): string {
    let nonce = '';
    while (nonce === '' || nonces.has(nonce)) {
        nonce = randomBytes(4).toString('hex');
    }
    nonces.add(nonce);
    return nonce;
}

export class Computer extends EventEmitter {

    label: string = '';
    ws: WebSocket;

    constructor(ws: WebSocket) {
        super();
        this.ws = ws;
        this.askLabel().then(async label => {
            this.label = label;
            this.emit('init');
        })
    }

    toJSON(): object {
        return {
            label: this.label
        };
    }

    execLua<T>(command: string): Promise<T> {
        return new Promise(r => {
            const nonce = getNonce();
            this.ws.send(JSON.stringify({
                type: 'lua',
                function: `return ${command}`,
                nonce
            }));

            const listener = (resp: string) => {
                try {
                    const res = JSON.parse(resp);
                    if (res?.nonce === nonce) {
                        r(res.data);
                        this.ws.off('message', listener);
                    }
                } catch (e) {
                    e.printStackTrace();
                }
            };

            this.ws.on('message', listener);
        });
    }

    execBash<T>(command: string): Promise<T> {
        return new Promise(r => {
            const nonce = getNonce();
            this.ws.send(JSON.stringify({
                type: 'bash',
                function: `return ${command}`,
                nonce
            }));

            const listener = (resp: string) => {
                try {
                    const res = JSON.parse(resp);
                    if (res?.nonce === nonce) {
                        r(res.data);
                        this.ws.off('message', listener);
                    }
                } catch (e) {
                    e.printStackTrace();
                }
            };

            this.ws.on('message', listener);
        });
    }

    askLabel(): Promise<string> {
        return new Promise(r => {
            const nonce = getNonce();
            this.ws.send(JSON.stringify({
                type: "label",
                nonce
            }))

            const listener = (resp: string) => {
                try {
                    const res = JSON.parse(resp);
                    if (res?.nonce === nonce) {
                        r(res.data);
                        this.ws.off('message', listener);
                    }
                } catch (e) {
                    e.printStackTrace();
                }
            };

            this.ws.on('message', listener);
        })
    }

    async disconnect() {
        this.ws.close();
    }
}