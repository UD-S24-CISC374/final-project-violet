import Phaser from "phaser";
import { stringFSM } from "../objects/stringFSM";
import { levelsFSM } from "../objects/levelsFSM";

export default class analyzeScene extends Phaser.Scene {
    private sceneText?: Phaser.GameObjects.Text;
    private levelNum: number = 0;
    private readonly BLACK: string = "#000";
    private readonly GRAY: string = "#";
    private readonly WHITE: string = "#fff";
    private readonly GREEN: string = "#0f0";
    private readonly YELLOW: string = "#FFD700";
    private readonly RED: string = "#f00";
    private runButton: Phaser.GameObjects.Polygon;
    private runText: Phaser.GameObjects.Text;
    private restartButton: Phaser.GameObjects.Polygon;
    private restartText: Phaser.GameObjects.Text;
    private stringButtons: Phaser.GameObjects.Text[] = [];
    private buttonBackgrounds: Phaser.GameObjects.Rectangle[] = [];
    private madeStrings: string[] = [];
    private toggleButtons: boolean[] = [];
    private acceptButtons: boolean[] = [];
    private machine: stringFSM;

    constructor() {
        super({ key: "analyzeScene" });
    }

    preload() {
        this.load.image("checker1", "assets/Checker_Background_1.png");
    }

    init(data: { level: number }): void {
        //this.data.set("levelNum", data.level);
        this.levelNum = data.level;
        console.log(data.level);
    }

    create() {
        console.log("Analyze Scene");
        // Checkerboard background
        this.add.image(640, 360, "checker1");
        this.add.rectangle(640, 40, 160, 80, 0xffffff);

        // Title text
        this.sceneText = this.add
            .text(640, 40, "Analyze", {
                fontSize: "32px",
                color: this.BLACK,
                align: "center",
            })
            .setOrigin(0.5, 0.5);

        const level = this.add
            .text(160, 120, `Level ${String(this.levelNum + 1)}`, {
                color: this.BLACK,
                fontSize: "32px",
                backgroundColor: "#fff",
            })
            .setOrigin(0.5, 0.5)
            .setPadding(5);
        console.log("Level height: " + level.height);

        // Create String Buttons
        const numRows: number = 5;
        const numCols: number = 4;
        const buttonPadding: number = 0;
        const widthOffset: number = 160;
        const heightOffset: number = 80;
        const startX: number = 3 * 80 + 40; // Starting X position for the first button
        const startY: number = 3 * 80 + 40; // Starting Y position for the first button
        console.log("Level: " + String(this.levelNum + 1));
        this.machine = levelsFSM.getLevels()[this.levelNum];
        const language = this.add
            .text(
                100,
                140,
                `The language of strings: ${this.machine.getLanguageDescriptionFSM()}`,
                {
                    color: this.BLACK,
                    fontSize: "24px",
                    backgroundColor: "#fff",
                }
            )
            .setOrigin(0.5, 0.5);
        language.setPosition(100 + language.width / 2, 160);
        this.add.text(
            100,
            180,
            `Over the alphabet: ${this.machine.getAlphabetFSM()}`,
            {
                color: this.BLACK,
                fontSize: "24px",
                backgroundColor: "#fff",
            }
        );
        this.madeStrings = this.machine.generateStrings(numRows * numCols);
        console.log("Values: " + this.madeStrings);
        this.acceptButtons = this.machine.checkStrings(this.madeStrings);
        console.log("Accepting Strings: " + this.acceptButtons);
        let count: number = 0;
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                this.toggleButtons[count] = false;
                const x = startX + col * (widthOffset + buttonPadding);
                const y = startY + row * (heightOffset + buttonPadding);
                this.stringButtons[count] = this.createToggleButton(
                    x,
                    y,
                    this.madeStrings[count],
                    count
                );
                count++;
            }
        }
        this.createRestartButton();
        this.createRunButton();
        this.setButtonEnabled(this.restartButton, false);

        const diamondColor = 0x90ee90; // light green
        const circleColor = 0x696969; // dark gray

        let crossLength: number = 40;
        let offset: number = crossLength - 80 / 2;
        let radius: number = crossLength * 0.65;
        // Create two diamonds
        this.createDiamond(960 - offset, 160, diamondColor, crossLength);
        this.createDiamond(1040 + offset, 160, diamondColor, crossLength);

        // Create two circles, positioned to match diamonds
        this.createCircle(960 - offset, 160, circleColor, radius);
        this.createCircle(1040 + offset, 160, circleColor, radius);
    }

    public createToggleButton(
        x: number,
        y: number,
        value: string,
        index: number
    ): Phaser.GameObjects.Text {
        let button = this.add
            .text(x, y, value, {
                //backgroundColor: this.WHITE,
                color: this.BLACK,
                fontSize: "24px",
            }) // Initial text and color black
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true }) // Makes the text clickable and shows a hand cursor on hover
            .setPadding(10)
            .on("pointerdown", () => {
                this.toggleButtons[index] = !this.toggleButtons[index];
                // Correctly toggle the color between black and yellow
                // Using type assertion to treat button.style.color as a string
                button.setStyle({
                    color: this.toggleButtons[index] ? this.YELLOW : this.BLACK,
                });
            });

        let width =
            button.width < 40
                ? 40
                : button.width < 80
                ? 80
                : button.width < 120
                ? 120
                : 160;

        this.buttonBackgrounds[index] = this.add.rectangle(
            button.x,
            button.y,
            width,
            button.height,
            0xffffff
        );

        button.setDepth(1);

        console.log(
            value +
                " xpos: " +
                button.x +
                " ypos: " +
                button.y +
                " width: " +
                button.width +
                " height: " +
                button.height
        );

        return button;
    }

    createRunButton(): void {
        let xpos: number = 1000;
        let ypos: number = 600;
        // Diamond shape for the "Run" button
        this.runButton = this.add
            .polygon(xpos, ypos, [50, 0, 100, 50, 50, 100, 0, 50], 0xffd700, 1)
            .setInteractive(
                new Phaser.Geom.Polygon([50, 0, 100, 50, 50, 100, 0, 50]),
                Phaser.Geom.Polygon.Contains
            );
        this.runButton.on("pointerdown", () => {
            this.setButtonEnabled(this.runButton, false);
            this.setButtonEnabled(this.restartButton, true);
            this.setButtonsEnabled(false);
            console.log("Toggles buttons: ");
            this.restartButton.setDepth(10);
            this.restartText.setDepth(10);
            this.runButton.setDepth(1);
            this.runText.setDepth(1);
            for (let index = 0; index < this.toggleButtons.length; index++) {
                console.log(this.toggleButtons[index]);
                if (
                    (this.toggleButtons[index] && this.acceptButtons[index]) ||
                    (!this.toggleButtons[index] && !this.acceptButtons[index])
                ) {
                    this.stringButtons[index].setStyle({ fill: this.GREEN });
                } else {
                    this.stringButtons[index].setStyle({ fill: this.RED });
                }
            }
            //let countOn = this.toggleButtons.filter((state) => state).length;
            //console.log(`Toggled on: ${countOn}`);
        });

        // Add "Run" text on top of the diamond
        this.runText = this.add.text(xpos - 15, ypos - 8, "Run", {
            color: "#000",
            fontSize: "16px",
        });
    }

    private createRestartButton(): void {
        let xpos: number = 1080;
        let ypos: number = 600;
        this.restartButton = this.add
            .polygon(xpos, ypos, [50, 0, 100, 50, 50, 100, 0, 50], 0xc0c0c0, 1) // Different initial color to indicate disabled state
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.setButtonEnabled(this.restartButton, false);
                this.setButtonEnabled(this.runButton, true);
                this.setButtonsEnabled(true);
                this.resetToggledButtons();
                this.randomizeButtonLabels();
                this.resizeBackgrounds();
                console.log("Values: " + this.madeStrings);
                console.log("Accepting strings: " + this.acceptButtons);
                this.runButton.setDepth(10);
                this.runText.setDepth(10);
                this.restartButton.setDepth(1);
                this.restartText.setDepth(1);
            });

        this.restartText = this.add.text(xpos - 32, ypos - 8, "Restart", {
            color: "#000",
            fontSize: "16px",
        });
    }

    private setButtonEnabled(
        button: Phaser.GameObjects.Polygon,
        enabled: boolean
    ): void {
        button.input!.enabled = enabled;
        button.setFillStyle(enabled ? 0xffd700 : 0xc0c0c0); // Gold for enabled, gray for disabled
        // Adjust text color or visibility if necessary
    }

    private setButtonsEnabled(enabled: boolean): void {
        this.stringButtons.forEach((button) => {
            button.input!.enabled = enabled;
            // Optionally, change the visual style to indicate disabled/enabled state
            button.setStyle({ color: enabled ? "#000000" : "#757575" }); // Change text color as an example
        });
    }

    private randomizeButtonLabels(): void {
        this.stringButtons.forEach((button, index) => {
            let result: string = this.machine.generateString();
            this.acceptButtons[index] = this.machine.checkString(result);
            this.madeStrings[index] = result;
            button.setText(result);
        });
    }

    private resetToggledButtons(): void {
        for (let index = 0; index < this.toggleButtons.length; index++) {
            this.toggleButtons[index] = false;
        }
    }

    private resizeBackgrounds(): void {
        for (let index = 0; index < this.stringButtons.length; index++) {
            let button = this.stringButtons[index];
            let width =
                button.width < 40
                    ? 40
                    : button.width < 80
                    ? 80
                    : button.width < 120
                    ? 120
                    : 160;
            let height = 40;

            this.buttonBackgrounds[index].setPosition(button.x, button.y);
            this.buttonBackgrounds[index].setSize(width, height);
        }
    }

    private createDiamond(
        x: number,
        y: number,
        color: number,
        crossRadius: number
    ): void {
        const diamond = this.add.graphics({ fillStyle: { color: color } });
        const path = new Phaser.Curves.Path(x - crossRadius, y);
        path.lineTo(x, y - crossRadius);
        path.lineTo(x + crossRadius, y);
        path.lineTo(x, y + crossRadius);
        path.lineTo(x - crossRadius, y);
        diamond.fillPoints(path.getPoints(), true);
    }

    private createCircle(
        x: number,
        y: number,
        color: number,
        radius: number
    ): void {
        const circle = this.add.graphics({ fillStyle: { color: color } });
        circle.fillCircle(x, y, radius); // Adjust the radius as needed
    }
}
