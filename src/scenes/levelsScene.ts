import Phaser from "phaser";
import { color } from "../objects/color";

export default class levelScene extends Phaser.Scene {
    private sceneTitle: Phaser.GameObjects.Text;
    private buttons: Phaser.GameObjects.Text[] = [];
    private levelNum: number = 0;
    private livesCount: number = 5;
    private levelsPassed: boolean[] = [];
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

        this.add.rectangle(640, 40, 160, 80, color.NUM_WHITE);

        // Title text
        this.sceneTitle = this.add.text(640, 40, "Levels", {
            fontSize: "40px",
            color: color.STR_BLACK,
            align: "center",
        });
        this.sceneTitle.setPadding(20).setOrigin(0.5, 0.5);

        // Level Button Variables
        const numRows = 5;
        const numCols = 2;
        const buttonWidth = 240;
        const buttonHeight = 80;
        const startX = 160; // Starting X position for the first button
        const startY = 120; // Starting Y position for the first button
        const padding = 0; //40; // Padding between buttons

        // Create Level Buttons
        let count: number = 0;
        let lives: number = 5;
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const buttonX = startX + col * (buttonWidth + padding);
                const buttonY = startY + row * (buttonHeight + padding);
                this.createButton(buttonX, buttonY, count, lives);
                this.levelsPassed[count] = false;
                count++;
            }
        }
        this.levelNum = 0;
    }

    private createButton(
        xpos: number,
        ypos: number,
        levelNum: number,
        livesCount: number
    ): void {
        const buttonLabel = `Level ${levelNum + 1}`; // Adjusted for human-readable level numbering
        const button = this.add
            .text(xpos, ypos, buttonLabel, {
                backgroundColor: color.STR_WHITE,
                color: color.STR_BLACK,
                fontSize: "20px",
            })
            .setOrigin(0.5, 0.5)
            .setPadding(10)
            .setInteractive()
            .setSize(100, 40);

        console.log(
            `Level ${levelNum} Button - width: ` +
                button.width +
                " height: " +
                button.height
        );

        button.on("pointerdown", () => {
            //console.log(`Clicked Level ${levelNum + 1}`);
            this.scene.start("analyzeScene", {
                levelNum: levelNum,
                livesCount: livesCount,
            });
        });

        this.buttons[levelNum] = button; // Store the button if needed for later reference
    }
}
