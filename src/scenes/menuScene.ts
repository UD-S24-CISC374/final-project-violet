import Phaser from "phaser";
import { color } from "../objects/color";
import { levelsFSM } from "../objects/levelsFSM";
import { agapeObject } from "../objects/agapeObject";

export default class menuScene extends Phaser.Scene {
    private sceneText: Phaser.GameObjects.Text;
    private playButton: Phaser.GameObjects.Text;
    private exitButton: Phaser.GameObjects.Text;

    private levelNum: number = 0;
    private livesCount: number = 5;
    private currentLevelUnlocked: number = 0;
    private levelsPassed: boolean[] = [];

    private devSkip: Phaser.GameObjects.Polygon;
    private toggleDevSkip: boolean;

    private agape: agapeObject;

    constructor() {
        super({ key: "menuScene" });
    }

    preload() {
        this.load.image("checker1", "assets/Checker_Background_1.png");
    }

    init() {}

    create() {
        console.log("Menu Scene");
        // Checkerboard background
        this.add.image(640, 360, "checker1");

        // Title text
        this.add.rectangle(640, 80, 480, 160, color.NUM_WHITE);
        this.sceneText = this.add
            .text(640, 80, "Finite Builder", {
                fontSize: "48px",
                color: color.STR_BLACK,
                align: "center",
            })
            .setPadding(20)
            .setOrigin(0.5, 0.5);

        const cellSide: number = 80;
        const AGAPE_posX = cellSide * 8;
        const AGAPE_posY = cellSide * 3 + cellSide / 2;
        const enableSpeech: boolean = false;

        this.agape = new agapeObject(
            AGAPE_posX,
            AGAPE_posY,
            cellSide,
            enableSpeech,
            this
        );

        this.agape.disableSpeech();

        for (let index = 0; index < levelsFSM.getLevels().length; index++) {
            this.levelsPassed[index] = this.toggleDevSkip;
        }

        const cellSize: number = 80;
        this.toggleDevSkip = false;
        this.devSkip = this.add
            .polygon(
                cellSize * 15 + cellSize / 2,
                cellSize * 8 + cellSize / 2,
                [0, 0, 80, 0, 80, 80, 0, 80], //[50, 0, 100, 50, 50, 100, 0, 50],
                color.NUM_WHITE,
                1
            )
            .setInteractive({ handcursor: true });
        this.devSkip.on("pointerdown", () => {
            if (this.toggleDevSkip) {
                this.toggleDevSkip = false;
                this.devSkip.setFillStyle(color.NUM_WHITE);
            } else {
                this.toggleDevSkip = true;
                this.devSkip.setFillStyle(color.NUM_LIGHT_GRAY);
            }
            for (let index = 0; index < levelsFSM.getLevels().length; index++) {
                this.levelsPassed[index] = this.toggleDevSkip;
            }
        });

        // playButton to levelScene
        this.playButton = this.add
            .text(640, 440, "Play", {
                fontSize: "30px",
                color: color.STR_GREEN,
                backgroundColor: color.STR_WHITE,
            })
            .setOrigin(0.5, 0.5)
            .setPadding(10)
            .setInteractive()
            .on("pointerdown", () =>
                this.time.delayedCall(
                    1000,
                    () => {
                        this.scene.start("levelsScene", {
                            levelNum: this.levelNum,
                            livesCount: this.livesCount,
                            currentLevelUnlocked: this.toggleDevSkip
                                ? -1
                                : this.currentLevelUnlocked,
                            levelsPassed: this.levelsPassed,
                        });
                    },
                    [],
                    this
                )
            );

        // playButton styling
        this.playButton.on("pointerover", () => {
            this.playButton.setStyle({ fill: color.STR_YELLOW });
            this.agape.setMoodNum(0);
        });
        this.playButton.on("pointerout", () => {
            this.playButton.setStyle({ fill: color.STR_GREEN });
            this.agape.setMoodNum(1);
        });
        this.playButton.on("pointerdown", () => {
            this.playButton
                .setStyle({ fill: color.STR_RED })
                .on("pointerout", () => {
                    this.playButton.setStyle({ fill: color.STR_RED });
                    this.agape.setMoodNum(-1);
                });
            this.agape.setMoodNum(-1);
        });
        this.playButton.on("pointerup", () => {
            this.playButton.setStyle({ fill: color.STR_RED });
            this.agape.setMoodNum(-1);
        });

        // exitButton to leave game
        this.exitButton = this.add
            .text(640, 520, "Exit", {
                fontSize: "30px",
                color: color.STR_BLACK,
                backgroundColor: color.STR_WHITE,
            })
            .setOrigin(0.5, 0.5)
            .setPadding(10)
            .setInteractive()
            .on("pointerdown", () =>
                this.time.delayedCall(
                    1000,
                    () => {
                        window.close();
                    },
                    [],
                    this
                )
            );

        // exitButton styling
        this.exitButton.on("pointerover", () => {
            this.exitButton.setStyle({ fill: color.STR_YELLOW });
            this.agape.setMoodNum(0);
        });
        this.exitButton.on("pointerout", () => {
            this.exitButton.setStyle({ fill: color.STR_BLACK });
            this.agape.setMoodNum(1);
        });
        this.exitButton.on("pointerdown", () => {
            this.exitButton
                .setStyle({ fill: color.STR_RED })
                .on("pointerout", () => {
                    this.exitButton.setStyle({ fill: color.STR_RED });
                    this.agape.setMoodNum(-1);
                });
            this.agape.setMoodNum(-1);
        });
        this.exitButton.on("pointerup", () => {
            this.exitButton.setStyle({ fill: color.STR_RED });
            this.agape.setMoodNum(-1);
        });
    }
}
