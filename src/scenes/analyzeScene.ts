import Phaser from "phaser";
import { stringFSM } from "../objects/stringFSM";
import { transition } from "../objects/transition";

export default class analyzeScene extends Phaser.Scene {
    private sceneText?: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "analyzeScene" });
    }

    preload() {
        this.load.image("checker1", "assets/Checker_Background_1.png");
    }

    init(data: { buttonLabel: string }): void {
        this.data.set("buttonLabel", data.buttonLabel);
    }

    create() {
        // Checkerboard background
        this.add.image(640, 360, "checker1");
        // Title text
        this.sceneText = this.add
            .text(640, 32, "Analyze", {
                fontSize: "32px",
                color: "#000",
                align: "center",
            })
            .setOrigin(0.5, 0.5);
        this.add.text(
            100,
            100,
            `Button clicked: ${this.data.get("buttonLabel")}`,
            { color: "#000", fontSize: "32px" }
        );

        // Create String Buttons
        const numRows = 5;
        const numCols = 2;
        const buttonPadding = 10;
        const buttonWidth = 50;
        const buttonHeight = 50;
        const startX = 100; // Starting X position for the first button
        const startY = 100; // Starting Y position for the first button

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const x = startX + col * (buttonWidth + buttonPadding);
                const y = startY + row * (buttonHeight + buttonPadding);
                this.createButton(x, y);
            }
        }
    }

    public createButton(x: number, y: number): Phaser.GameObjects.Text {
        let button = this.add
            .text(x, y, "string", { color: "#000000" }) // Initial text and color black
            .setInteractive({ useHandCursor: true }) // Makes the text clickable and shows a hand cursor on hover
            .on("pointerdown", () => {
                // Correctly toggle the color between black and yellow
                // Using type assertion to treat button.style.color as a string
                let currentColor: string = button.style.color as string;
                button.setStyle({
                    color: currentColor === "#000000" ? "#ffff00" : "#000000",
                });
            });
        return button;
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
            1,
            "The language of all string over the alphabet {a,b}",
            ["a", "b"],
            ["q0"],
            "q0",
            ["q0"],
            [lvl1d0]
        );
        let levels: stringFSM[] = [lvl1];
        return levels;
    }
}
