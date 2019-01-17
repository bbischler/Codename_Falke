export class Player {
    id: number;
    name: string;
    score: number;

    constructor(id: number, name: string, score: number) {
        this.id = id;
        this.name = name;
        this.score = score;
    }
    setScore(score: number) {
        this.score += score;
    }
}


