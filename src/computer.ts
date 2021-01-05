import { EventEmitter } from 'events';
import WebSocket from "ws";

export class Computer extends EventEmitter {

    label: string = '';

    constructor(ws: WebSocket) {
        super();
    }


}