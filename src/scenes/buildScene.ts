import Phaser from "phaser";
import { color } from "../objects/color";
import { stringFSM } from "../objects/stringFSM";
import { levelsFSM } from "../objects/levelsFSM";
import { transitionObject } from "../objects/transitionObject";
import { stateObject } from "../objects/stateObject";

export default class buildScene extends Phaser.Scene {
    private sceneTitle: Phaser.GameObjects.Text;
    private levelNum: number = 0;
    private livesCount: number = 5;
    private machine: stringFSM;

    private plusSign: Phaser.GameObjects.Text;
    private lessThanSign: Phaser.GameObjects.Text;
    private lineText: Phaser.GameObjects.Text;
    private lineGraphics: Phaser.GameObjects.Graphics;

    private states: stateObject[] = [];
    private stateDepths: number[] = [];

    constructor() {
        super({ key: "buildScene" });
    }

    preload() {
        this.load.image("checker2", "assets/Checker_Background_2.png");
    }

    init(data: { levelNum: number; livesCount: number }): void {
        //this.data.set("levelNum", data.level);
        this.levelNum = data.levelNum;
        this.livesCount = data.livesCount;
    }

    create() {
        console.log("Build Scene");
        // Checkerboard background
        this.add.image(640, 360, "checker2");

        this.add.rectangle(640, 40, 160, 80, color.NUM_WHITE);

        // Title text
        this.sceneTitle = this.add
            .text(640, 40, "Build", {
                fontSize: "40px",
                color: color.STR_BLACK,
                align: "center",
            })
            .setPadding(20)
            .setOrigin(0.5, 0.5);

        // Get Level
        this.machine = levelsFSM.getLevels()[this.levelNum];

        // Level Number
        const level = this.add
            .text(160, 120, `Level ${String(this.levelNum + 1)}`, {
                color: color.STR_BLACK,
                fontSize: "32px",
                backgroundColor: color.STR_WHITE,
            })
            .setOrigin(0.5, 0.5)
            .setPadding(5);
        console.log("Level height: " + level.height);

        console.log("Level: " + String(this.levelNum + 1));

        // Language of Level
        const language = this.add
            .text(
                100,
                140,
                `The language of strings: ${this.machine.getLanguageDescriptionFSM()}`,
                {
                    color: color.STR_BLACK,
                    fontSize: "24px",
                    backgroundColor: color.STR_WHITE,
                }
            )
            .setOrigin(0.5, 0.5);
        language.setPosition(100 + language.width / 2, 160);

        // Alphabet of Level
        this.add.text(
            100,
            180,
            `Over the alphabet: ${this.machine.getAlphabetFSM()}`,
            {
                color: color.STR_BLACK,
                fontSize: "24px",
                backgroundColor: color.STR_WHITE,
            }
        );

        // Create a Graphics object
        const graphics1 = this.add.graphics();

        // Set line style for the border: width and color
        graphics1.lineStyle(4, color.NUM_GRAY); // White border, 4 pixels thick

        // Set fill style for the circle
        graphics1.fillStyle(0xff0000, 1); // Red fill

        // Draw a circle with fill and line style
        // Parameters: x, y, radius
        graphics1.fillCircle(360, 360, 40);
        graphics1.strokeCircle(360, 360, 40); // This creates the border

        // Create multiple draggable circles
        let startPosX: number = 120;
        let startPosY: number = 600;
        let radius: number = 40;
        let stateDepth: number = 0;
        let transitionDepth: number = this.machine.getStartFSM().length;

        this.machine.getStatesFSM().forEach((name, stateIndex) => {
            const transitions: transitionObject[] = [];
            this.machine.getAlphabetFSM().forEach((input, transitionIndex) => {
                transitions[transitionIndex] = new transitionObject(
                    startPosX,
                    startPosY,
                    startPosX,
                    startPosY,
                    input,
                    this
                );
                transitions[transitionIndex]
                    .getStart()
                    .setDepth(transitionDepth);
                transitions[transitionIndex].getEnd().setDepth(transitionDepth);
                transitionDepth++;
            });
            this.states[stateIndex] = new stateObject(
                name,
                startPosX,
                startPosY,
                radius,
                color.NUM_YELLOW,
                transitions,
                this
            );
            this.states[stateIndex].getState().setDepth(stateDepth);
            stateDepth++;
        });
        this.states[0].setStartTransition(this);

        const graphics = this.add.graphics({
            lineStyle: { width: 2, color: 0x000000 },
        });
        const centerX = 360;
        const centerY = 360 - 40 * Math.sqrt(2);
        const radiusArc = 40;
        const startAngle = Phaser.Math.DegToRad(135); // Convert degrees to radians
        const endAngle = Phaser.Math.DegToRad(405);

        // Draw the arc
        graphics.beginPath();
        graphics.arc(centerX, centerY, radiusArc, startAngle, endAngle);
        graphics.strokePath();

        // Calculate the positions for the markers
        const startX = centerX + radiusArc * Math.cos(startAngle);
        const startY = centerY + radiusArc * Math.sin(startAngle);
        const endX = centerX + radiusArc * Math.cos(endAngle);
        const endY = centerY + radiusArc * Math.sin(endAngle);

        // Draw the plus sign at the start
        this.add
            .text(startX, startY, "+", { font: "32px Arial", color: "#000000" })
            .setOrigin(0.5, 0.5)
            .setRotation(startAngle);
        this.add
            .text(endX, endY, ">", { font: "32px Arial", color: "#000000" })
            .setOrigin(0.5, 0.5)
            .setRotation(endAngle + Math.PI / 2);
    }
}
