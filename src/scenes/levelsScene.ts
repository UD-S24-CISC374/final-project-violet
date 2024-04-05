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
                const buttonX = startX + col * (buttonWidth + padding);
                const buttonY = startY + row * (buttonHeight + padding);
                this.createButton(buttonX, buttonY, count);
                count++;
            }
        }
    }

    private createButton(x: number, y: number, levelNum: number): void {
        const buttonLabel = `Level ${levelNum + 1}`; // Adjusted for human-readable level numbering
        const button = this.add
            .text(x, y, buttonLabel, {
                backgroundColor: "#fff",
                color: "#000",
                fontSize: "20px",
            })
            .setPadding(10)
            .setInteractive();

        button.on("pointerdown", () => {
            //console.log(`Clicked Level ${levelNum + 1}`);

            this.scene.start("analyzeScene", {
                level: levelNum,
                lives: 5,
            });
        });

        this.buttons[levelNum] = button; // Store the button if needed for later reference
    }

    private handleButtonClick(level: number): void {
        console.log(`Level ${level} clicked!`);
        // Display the button value or handle the click as needed
        // For instance, you could display the value on the screen or perform some action based on the button clicked.
        /*this.add.text(300, 200, `Button ${buttonValue} was clicked!`, {
            fontSize: "32px",
            color: "#FF0000",
        });
        */
    }
}
