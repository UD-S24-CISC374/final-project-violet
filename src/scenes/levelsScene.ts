import Phaser from "phaser";
import { color } from "../objects/color";
import { levelsFSM } from "../objects/levelsFSM";

export default class levelScene extends Phaser.Scene {
    private sceneTitle: Phaser.GameObjects.Text;
    private buttons: Phaser.GameObjects.Text[] = [];

    private levelNum: number = 0;
    private livesCount: number = 5;
    private currentLevelUnlocked: number = 0;
    private levelsPassed: boolean[] = [];

    constructor() {
        super({ key: "levelsScene" });
    }

    preload() {
        this.load.image("checker2", "assets/Checker_Background_2.png");
    }

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

        console.log("Level Scene Initialized");
        console.log("Level Num: " + this.levelNum);
        console.log("Lives Count: " + this.livesCount);
        console.log("Current Level Unlocked: " + this.currentLevelUnlocked);
        console.log("Levels Passed: " + this.levelsPassed);
    }

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

        // Get Level
        const levelsCount = levelsFSM.getLevels().length;
        console.log("Total levels count: " + levelsCount);

        // max counts
        const maxNumRows = 7;
        const maxNumCols = 5;

        // Level Button Variables
        /*
        const numRows =
            levelsCount > maxNumRows ? maxNumRows : Math.max(levelsCount, 0);
        const numCols = Math.round(levelsCount / maxNumRows);
        console.log("Number of rows: " + numRows);
        console.log("Number of cols: " + numCols);
        */
        const buttonWidth = 240;
        const buttonHeight = 80;
        const startX = 160; // Starting X position for the first button
        const startY = 120; // Starting Y position for the first button
        const padding = 0; //40; // Padding between buttons

        // Create Level Buttons
        let count: number = 0;
        for (let col = 0; col < maxNumCols; col++) {
            for (let row = 0; row < maxNumRows && count < levelsCount; row++) {
                const buttonX = startX + col * (buttonWidth + padding);
                const buttonY = startY + row * (buttonHeight + padding);
                this.createButton(buttonX, buttonY, count);
                count++;
            }
        }

        this.updateLevelButtons();
    }

    private createButton(xpos: number, ypos: number, levelNum: number): void {
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
        console.log("Creating Level Button: " + levelNum);
        console.log("Current Level Unlocked: " + this.currentLevelUnlocked);

        /*
        if (levelNum > this.currentLevelUnlocked) {
            this.setButtonEnabled(
                undefined,
                button,
                false,
                color.NUM_BLACK,
                color.STR_GRAY
            );
        } else {
            this.setButtonEnabled(
                undefined,
                button,
                true,
                color.NUM_BLACK,
                color.STR_YELLOW
            );
        }
        */

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
                livesCount: this.livesCount,
                currentLevelUnlocked: this.currentLevelUnlocked,
                levelsPassed: this.levelsPassed,
            });
        });

        this.buttons[levelNum] = button; // Store the button if needed for later reference
    }

    private setButtonEnabled(
        button: Phaser.GameObjects.Polygon | undefined,
        text: Phaser.GameObjects.Text | undefined,
        enabled: boolean,
        colorFill: number,
        colorText: string
    ): void {
        console.log("Text: " + text!.text);
        if (button !== undefined) {
            button.input!.enabled = enabled;
            button.setFillStyle(colorFill);
        }
        if (text !== undefined) {
            text.input!.enabled = enabled;
            text.setColor(colorText);
        }
    }

    public updateLevelButtons(): void {
        this.buttons.forEach(
            (button: Phaser.GameObjects.Text | undefined, index) => {
                if (button !== undefined) {
                    this.setButtonEnabled(
                        undefined,
                        button,
                        this.currentLevelUnlocked == index
                            ? true
                            : this.levelsPassed[index],
                        color.NUM_BLACK,
                        this.currentLevelUnlocked == index
                            ? color.STR_YELLOW
                            : this.levelsPassed[index]
                            ? color.STR_GREEN
                            : color.STR_GRAY
                    );
                }
            }
        );
    }
}
