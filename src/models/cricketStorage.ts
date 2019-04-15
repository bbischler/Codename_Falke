import { CricketPlayer } from './cricketPlayer';
import { Stack } from 'stack-typescript';

export class CricketStorage {
    players: Array<CricketPlayer> = new Array<CricketPlayer>();
    isDouble: Boolean = false;
    isTriple: Boolean = false;
    currentHighscore: number = 0;
    throwAmount: number = 1; // Factor for double and triple multiplication

    constructor(players: Array<CricketPlayer>, isDouble: Boolean, isTriple: Boolean,
        currentHighscore: number, throwAmount: number) {
        this.players = players;
        this.isDouble = isDouble;
        this.isTriple = isTriple;
        this.currentHighscore = currentHighscore;
        this.throwAmount = throwAmount;
    }
}