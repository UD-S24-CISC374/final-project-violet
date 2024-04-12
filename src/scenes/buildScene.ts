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

        const arrow1 = new transitionObject(440, 440, 600, 440, "a", this);
        const arrow2 = new transitionObject(440, 440, 600, 440, "b", this);
        const transitions = [arrow1, arrow2];
        console.log("transition input: " + arrow1.getInput());

        // Create multiple draggable circles
        let startPosX: number = 120;
        let startPosY: number = 600;
        let radius: number = 40;

        this.machine.getStatesFSM().forEach((name, index) => {
            this.states[index] = new stateObject(
                name,
                startPosX,
                startPosY,
                radius,
                color.NUM_YELLOW,
                transitions,
                this
            );
        });
    }
}
