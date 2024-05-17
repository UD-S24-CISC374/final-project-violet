import Phaser from "phaser";

export default class endScene extends Phaser.Scene {
    private sceneText?: Phaser.GameObjects.Text;

    private levelNum: number = 0;
    private livesCount: number = 5;
    private currentLevelUnlocked: number = 0;
    private levelsPassed: boolean[] = [];

    constructor() {
        super({ key: "endScene" });
    }

    preload() {}

    init(data: {
        levelNum: number;
        livesCount: number;
        currentLevelUnlocked: number;
        levelsPassed: boolean[];
    }): void {
        this.levelNum = data.levelNum;
        this.livesCount = data.livesCount;
        this.currentLevelUnlocked = data.currentLevelUnlocked;
        this.levelsPassed = data.levelsPassed;
    }

    create() {}
}
