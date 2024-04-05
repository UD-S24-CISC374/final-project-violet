import Phaser from "phaser";

export default class levelScene extends Phaser.Scene {
    private sceneText?: Phaser.GameObjects.Text;
    private buttons: Phaser.GameObjects.Text[] = [];
    private levelNum: number = 0;
    private dataToPass = {
        level: this.levelNum,
    };
    constructor() {
        super({ key: "levelsScene" });
    }

    preload() {
        this.load.image("checker2", "assets/Checker_Background_2.png");
    }

    init() {}

    create() {
        console.log("Levels Scene");
        // Checkerboard background
        this.add.image(640, 360, "checker2");
        // Title text
        this.sceneText = this.add
            .text(640, 32, "Levels", {
                fontSize: "32px",
                color: "#000",
                align: "center",
            })
            .setOrigin(0.5, 0.5);

        const numRows = 5;
        const numCols = 2;
        const buttonWidth = 200;
        const buttonHeight = 40;
        const startX = 100; // Starting X position for the first button
        const startY = 100; // Starting Y position for the first button
        const padding = 40; // Padding between buttons

        let count: number = 0;
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                this.levelNum = row * numCols + col + 1;
                this.dataToPass.level = this.levelNum;
                const buttonLabel = "Level " + this.levelNum;
                const buttonX = startX + col * (buttonWidth + padding);
                const buttonY = startY + row * (buttonHeight + padding);
                console.log("Level: " + String(this.levelNum));
                this.buttons[count] = this.add
                    .text(buttonX, buttonY, buttonLabel, {
                        backgroundColor: "#fff",
                        color: "#000",
                        fontSize: "20px",
                    })
                    .setPadding(10)
                    .setInteractive();
                this.buttons[count].on("pointerdown", () =>
                    this.scene.start("analyzeScene", {
                        level: 1, //this.levelNum,
                        lives: 5,
                    })
                );
                count++;
            }
        }
    }
}
