export class Player {
    id: number;
    name: string;
    score: number;
    throwCount: number = 0;
    totalScore: number = 0;
    avg: number = 0;
    lastThreeScores: number[] = [];

    constructor(id: number, name: string, score: number) {
        this.id = id;
        this.name = name;
        this.score = score;
    }
    setScore(score: number) {
        this.score += score;
    }

    setLastScore(points) {
        this.lastThreeScores.push(points);
    }
    removeLastThreePoints() {
        this.lastThreeScores = [];
    }
    reducePoints(points) {
        this.score = (this.score - points);
    }
    setThrowCount() {
        this.throwCount++;
    }
    setTotalScore(points) {
        this.totalScore += points;
        this.avg = Math.floor(this.totalScore / this.throwCount);
    }
}

