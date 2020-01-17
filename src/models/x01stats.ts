import { X01Player } from './x01player';

export class X01stats {
    id: number;
    date: Date = new Date();
    // legs: any[] = [];
    players: X01Player[] = [];
    constructor(id: number) { this.id = id; }
}

