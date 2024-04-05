import Phaser from "phaser";
import { stringFSM } from "../objects/stringFSM";
import { transition } from "../objects/transition";

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
    private restartButton: Phaser.GameObjects.Polygon;
    private stringButtons: Phaser.GameObjects.Text[] = [];
    private toggleButtons: boolean[] = [];
    private acceptButtons: boolean[] = [];

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
        // Title text
        this.sceneText = this.add
            .text(640, 32, "Analyze", {
                fontSize: "32px",
                color: this.BLACK,
                align: "center",
            })
            .setOrigin(0.5, 0.5);
        this.add.text(100, 100, `Level ${String(this.levelNum + 1)}`, {
            color: this.BLACK,
            fontSize: "32px",
        });

        // Create String Buttons
        const numRows: number = 5;
        const numCols: number = 4;
        const buttonPadding: number = 10;
        const buttonWidth: number = 160;
        const buttonHeight: number = 60;
        const startX: number = 300; // Starting X position for the first button
        const startY: number = 300; // Starting Y position for the first button
        console.log("Level: " + String(this.levelNum));
        let machine: stringFSM = this.getLevels()[this.levelNum];
        this.add.text(100, 140, `${machine.getLanguageDescriptionFSM()}`, {
            color: this.BLACK,
            fontSize: "30px",
        });
        let values: string[] = machine.generateStrings(numRows * numCols);
        console.log(values);
        this.acceptButtons = machine.checkStrings(values);
        let count: number = 0;
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                this.toggleButtons[count] = false;
                const x = startX + col * (buttonWidth + buttonPadding);
                const y = startY + row * (buttonHeight + buttonPadding);
                this.stringButtons[count] = this.createToggleButton(
                    x,
                    y,
                    values[count],
                    count
                );
                count++;
            }
        }
        this.createRunButton();
        this.createRestartButton();
        this.setButtonEnabled(this.restartButton, false);
    }

    public createToggleButton(
        x: number,
        y: number,
        value: string,
        index: number
    ): Phaser.GameObjects.Text {
        let button = this.add
            .text(x, y, value, {
                backgroundColor: this.WHITE,
                color: this.BLACK,
                fontSize: "24px",
            }) // Initial text and color black
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true }) // Makes the text clickable and shows a hand cursor on hover
            .on("pointerdown", () => {
                this.toggleButtons[index] = !this.toggleButtons[index];
                // Correctly toggle the color between black and yellow
                // Using type assertion to treat button.style.color as a string
                button.setStyle({
                    color: this.toggleButtons[index] ? this.YELLOW : this.BLACK,
                });
            });
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
            for (let index = 0; index < this.toggleButtons.length; index++) {
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
        this.add.text(xpos - 15, ypos - 8, "Run", {
            color: "#000",
            fontSize: "16px",
        });
    }

    private createRestartButton(): void {
        let xpos: number = 1100;
        let ypos: number = 600;
        this.restartButton = this.add
            .polygon(xpos, ypos, [50, 0, 100, 50, 50, 100, 0, 50], 0xc0c0c0, 1) // Different initial color to indicate disabled state
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.setButtonEnabled(this.restartButton, false);
                this.setButtonEnabled(this.runButton, true);
                this.setButtonsEnabled(true);
            });

        this.add.text(xpos - 32, ypos - 8, "Restart", {
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

    public getLevels(): stringFSM[] {
        // transitions
        const lvl1d0 = new transition(
            "q0",
            new Map([
                ["a", "q0"],
                ["b", "q0"],
            ])
        );
        // finite state machine
        const lvl1 = new stringFSM(
            1, // id
            "The language of all strings over the alphabet {a,b}", // language description
            ["a", "b"], // alphabet
            ["q0"], // states
            "q0", // start state
            ["q0"], // accepting states
            [lvl1d0] // delta transitions
        );

        // transitions
        const lvl2d0 = new transition(
            "q0",
            new Map([
                ["a", "q1"],
                ["b", "q0"],
            ])
        );
        const lvl2d1 = new transition(
            "q1",
            new Map([
                ["a", "q0"],
                ["b", "q1"],
            ])
        );
        // finite state machine
        const lvl2 = new stringFSM(
            2, // id
            "The language of strings with even a's over the alphabet {a,b}", // language description
            ["a", "b"], // alphabet
            ["q0", "q1"], // states
            "q0", // start state
            ["q0"], // accepting states
            [lvl2d0, lvl2d1] // delta transitions
        );
        let levels: stringFSM[] = [lvl1, lvl2];
        return levels;
    }
}
