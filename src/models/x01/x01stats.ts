import { X01Player } from './x01Player';

export class X01stats {
    id: number;
    date: Date = new Date();
    players: X01Player[] = [];
    legssets: String[] = [];
    isLegBased: boolean;
    num: number;
    constructor(id: number) { this.id = id; }
}

