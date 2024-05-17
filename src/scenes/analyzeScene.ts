import Phaser from "phaser";
import { stringFSM } from "../objects/stringFSM";
import { levelsFSM } from "../objects/levelsFSM";
import { color } from "../objects/color";
import { agapeObject } from "../objects/agapeObject";

export default class analyzeScene extends Phaser.Scene {
    private levelNum: number = 0;
    private livesCount: number = 5;
    private currentLevelUnlocked: number = 0;
    private levelsPassed: boolean[] = [];

    private passedAnalyze: boolean = false;

    private sceneTitle: Phaser.GameObjects.Text;

    private runButton: Phaser.GameObjects.Polygon;
    private runText: Phaser.GameObjects.Text;

    private restartButton: Phaser.GameObjects.Polygon;
    private restartText: Phaser.GameObjects.Text;

    private allButton: Phaser.GameObjects.Polygon;
    private allText: Phaser.GameObjects.Text;

    private noneButton: Phaser.GameObjects.Polygon;
    private noneText: Phaser.GameObjects.Text;

    private stringButtons: Phaser.GameObjects.Text[] = [];
    private buttonBackgrounds: Phaser.GameObjects.Rectangle[] = [];
    private madeStrings: string[] = [];
    private toggleButtons: boolean[] = [];
    private acceptButtons: boolean[] = [];
    private correctAnswers: boolean[] = [];
    private machineSolution: stringFSM;

    private readonly NUM_ROWS: number = 4;
    private readonly NUM_COLS: number = 4;

    private toBuildButton: Phaser.GameObjects.Polygon;
    private toBuildText: Phaser.GameObjects.Text;

    private agape: agapeObject;
    private feedback: string;

    private devSkip: boolean = false;

    constructor() {
        super({ key: "analyzeScene" });
    }

    preload() {
        this.load.image("checker1", "assets/Checker_Background_1.png");
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

        console.log("Analyze Scene Initialized");
        console.log("Level Num: " + this.levelNum);
        console.log("Lives Count: " + this.livesCount);
        console.log("Current Level Unlocked: " + this.currentLevelUnlocked);
        console.log("Levels Passed: " + this.levelsPassed);
    }

    create() {
        console.log("Analyze Scene");
        // Checkerboard background
        this.add.image(640, 360, "checker1");

        // Title text
        this.add.rectangle(640, 40, 160, 80, color.NUM_WHITE);
        this.sceneTitle = this.add.text(640, 40, "Analyze", {
            fontSize: "32px",
            color: color.STR_BLACK,
            align: "center",
        });
        this.sceneTitle.setOrigin(0.5, 0.5);

        // Get Level
        this.machineSolution = levelsFSM.getLevels()[this.levelNum];

        // Level Number
        const level = this.add
            .text(80, 80, `Level ${String(this.levelNum + 1)}`, {
                color: color.STR_BLACK,
                fontSize: "32px",
                backgroundColor: color.STR_WHITE,
            })
            .setPadding(10);
        let levelScaleFactor: number = 1;
        if (level.height > 80) {
            levelScaleFactor = 80 / level.height;
        } else if (level.width > 160 || level.width < 160) {
            levelScaleFactor = 160 / level.width;
        }
        level.setScale(levelScaleFactor);
        console.log("Level height: " + level.height);

        console.log("Level: " + String(this.levelNum + 1));

        // Alphabet of Level
        const alphabet = this.add.text(
            320,
            80,
            `Alphabet: ${this.machineSolution.getAlphabetFSM()}`,
            {
                color: color.STR_BLACK,
                fontSize: "24px",
                backgroundColor: color.STR_WHITE,
            }
        );
        alphabet.setPadding(10);

        // Language of Level
        let languageFontSize: number = 24;
        const language = this.add.text(
            80,
            160,
            `Language Description:\n${this.machineSolution.getLanguageDescriptionFSM()}`,
            {
                color: color.STR_BLACK,
                fontSize: String(languageFontSize) + "px",
                backgroundColor: color.STR_WHITE,
                wordWrap: { width: 320 },
            }
        );
        //language.setPosition(100 + language.width / 2, 160);
        let languageScaleFactor: number = 1;
        language.setPadding(10);
        language.setLineSpacing(4);

        let altSize: boolean = true;

        while (language.width > 320 || language.height > 160) {
            if (altSize) {
                altSize = false;
                languageScaleFactor = 320 / language.width;
                language.setScale(languageScaleFactor);
            } else {
                altSize = true;
                languageFontSize = languageFontSize * 0.95;
                language.setFontSize(languageFontSize);
            }
        }

        let instructionFontSize: number = 24;
        const instructions = this.add.text(
            480,
            160,
            `Instructions:\nClick the strings that belong in the language. Click "Run". If correct, click "Build". If incorrect, click "Restart"`,
            {
                color: color.STR_BLACK,
                fontSize: String(instructionFontSize) + "px",
                backgroundColor: color.STR_WHITE,
                wordWrap: { width: 320 },
            }
        );

        let instructionScaleFactor: number = 1;
        instructions.setPadding(10);
        instructions.setLineSpacing(4);

        altSize = true;

        while (instructions.width > 320 || instructions.height > 160) {
            if (altSize) {
                altSize = false;
                instructionScaleFactor = 320 / instructions.width;
                instructions.setScale(instructionScaleFactor);
            } else {
                altSize = true;
                instructionFontSize = instructionFontSize * 0.95;
                instructions.setFontSize(instructionFontSize);
            }
        }

        // String Button Variables
        const cellSide: number = 80;
        const numRows: number = this.NUM_ROWS;
        const numCols: number = this.NUM_COLS;
        const widthOffset: number = cellSide * 2;
        const heightOffset: number = cellSide;
        const startX: number = 2 * cellSide + cellSide / 2; // Starting X position for the first button (3rd column)
        const startY: number = 4 * cellSide + cellSide / 2; // Starting Y position for the first button (3rd row)

        const totalStrings: number = numRows * numCols;
        const stringLength: number = 10;
        const allSameLength: boolean = false;
        const allUnique: boolean = true;

        // Maching strings and accepts
        this.madeStrings = this.machineSolution.generateStrings(
            totalStrings,
            stringLength,
            allSameLength,
            allUnique
        ); // string[]

        console.log("Created Strings: " + this.madeStrings);

        this.acceptButtons = this.machineSolution.checkStrings(
            this.madeStrings
        ); // boolean[]
        console.log("Values: " + this.madeStrings);
        console.log("Accepting Strings: " + this.acceptButtons);

        this.stringButtons = [];
        this.toggleButtons = [];
        this.buttonBackgrounds = [];
        this.correctAnswers = [];

        this.passedAnalyze = false;
        // Create String Buttons
        let count: number = 0;
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                this.toggleButtons[count] = false;
                const xpos = startX + col * widthOffset;
                const ypos = startY + row * heightOffset;
                const strVal =
                    count < this.madeStrings.length
                        ? this.madeStrings[count] === ""
                            ? "_"
                            : this.madeStrings[count]
                        : "";
                this.stringButtons[count] = this.createToggleButton(
                    xpos,
                    ypos,
                    strVal,
                    count
                );
                if (count >= this.madeStrings.length) {
                    this.stringButtons[count].setVisible(false);
                }
                count++;
            }
        }

        // Create Interactive Buttons
        this.createAllButton();
        this.createNoneButton();
        this.createRestartButton();
        this.createRunButton();

        // Disable Restart Button
        this.setButtonEnabled(
            this.restartButton,
            this.restartText,
            false,
            color.NUM_GRAY,
            color.STR_BLACK
        );

        // Create AGAPE EYES
        const AGAPE_posX = cellSide * 13;
        const AGAPE_posY = cellSide * 2;
        const enableSpeech: boolean = true;

        this.agape = new agapeObject(
            AGAPE_posX,
            AGAPE_posY,
            cellSide,
            enableSpeech,
            this
        );

        this.agape.disableSpeech();

        this.feedback = "";

        this.toBuildButton = this.add
            .polygon(
                1040,
                440,
                [50, 0, 100, 50, 50, 100, 0, 50],
                color.NUM_YELLOW,
                1
            )
            .setInteractive({ handcursor: true });
        this.toBuildButton.on("pointerdown", () => {
            this.scene.start("buildScene", {
                levelNum: this.levelNum,
                livesCount: this.livesCount,
                currentLevelUnlocked: this.currentLevelUnlocked,
                levelsPassed: this.levelsPassed,
            });
        });
        this.toBuildText = this.add
            .text(1040, 440, "Build", {
                color: color.STR_BLACK,
                fontSize: "16px",
            })
            .setOrigin(0.5, 0.5);
        if (this.currentLevelUnlocked == -1) {
            this.devSkip = true;
        }
        this.setButtonEnabled(
            this.toBuildButton,
            this.toBuildText,
            this.devSkip ? true : this.passedAnalyze,
            color.NUM_DARK_GRAY,
            color.STR_BLACK
        );
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
                color: color.STR_BLACK,
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
                    color: this.toggleButtons[index]
                        ? color.STR_YELLOW
                        : color.STR_BLACK,
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
            color.NUM_WHITE
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

    private createAllButton(): void {
        let xpos = 1000;
        let ypos = 520;
        // Create the "All" button
        this.allButton = this.add
            .polygon(
                xpos,
                ypos,
                [50, 0, 100, 50, 50, 100, 0, 50],
                color.NUM_DARK_GRAY,
                1
            )
            .setInteractive({ handcursor: true });
        this.allButton.on("pointerdown", () => {
            console.log("Toggled on all string buttons");
            this.stringButtons.forEach(
                (button: Phaser.GameObjects.Text | undefined, index) => {
                    if (button != undefined) {
                        button.setStyle({ fill: color.STR_YELLOW });
                        this.toggleButtons[index] = true;
                    }
                }
            );
        });
        this.allText = this.add
            .text(xpos, ypos, "All", {
                color: color.STR_WHITE,
                fontSize: "16px",
            })
            .setOrigin(0.5, 0.5);
    }

    private createNoneButton(): void {
        let xpos = 1080;
        let ypos = 520;
        // Create the "All" button
        this.noneButton = this.add
            .polygon(
                xpos,
                ypos,
                [50, 0, 100, 50, 50, 100, 0, 50],
                color.NUM_DARK_GRAY,
                1
            )
            .setInteractive({ handcursor: true });
        this.noneButton.on("pointerdown", () => {
            console.log("Toggled off all string buttons");
            this.stringButtons.forEach((button, index) => {
                button.setStyle({ fill: color.STR_BLACK });
                this.toggleButtons[index] = false;
            });
        });
        this.noneText = this.add
            .text(xpos, ypos, "None", {
                color: color.STR_WHITE,
                fontSize: "16px",
            })
            .setOrigin(0.5, 0.5);
    }

    private createRunButton(): void {
        let xpos: number = 1000;
        let ypos: number = 600;
        // Diamond shape for the "Run" button
        this.runButton = this.add
            .polygon(
                xpos,
                ypos,
                [50, 0, 100, 50, 50, 100, 0, 50],
                color.NUM_YELLOW,
                1
            )
            .setInteractive({ handcursor: true });
        this.runButton.on("pointerdown", () => {
            this.setButtonsEnabled(false);
            this.correctAnswers = [];
            let incorrectStrings = [];
            let incorrectCount: number = 0;
            let stringsCorrect: boolean = true;
            for (let index = 0; index < this.madeStrings.length; index++) {
                console.log(this.toggleButtons[index]);
                if (
                    (this.toggleButtons[index] && this.acceptButtons[index]) ||
                    (!this.toggleButtons[index] && !this.acceptButtons[index])
                ) {
                    this.setButtonEnabled(
                        undefined,
                        this.stringButtons[index],
                        false,
                        color.NUM_BLACK,
                        color.STR_GREEN
                    );
                    this.correctAnswers[index] = true;
                    console.log("Made Green!");
                    console.log("Made string: " + this.madeStrings[index]);
                } else {
                    this.setButtonEnabled(
                        undefined,
                        this.stringButtons[index],
                        false,
                        color.NUM_BLACK,
                        color.STR_RED
                    );
                    this.correctAnswers[index] = false;
                    console.log("Made Red!");
                    console.log("Made string: " + this.madeStrings[index]);
                    incorrectStrings[incorrectCount] = this.madeStrings[index];
                    incorrectCount++;
                    stringsCorrect = false;
                }
            }

            if (stringsCorrect) {
                this.passedAnalyze = true;
                this.agape.setMoodNum(1);
                this.feedback = "Correct!";
            } else {
                this.agape.worsenMood();
                console.log("Incorrect Strings: " + incorrectStrings);
                for (
                    let incorrectIndex = 0;
                    incorrectIndex < incorrectStrings.length;
                    incorrectIndex++
                ) {
                    let result = incorrectStrings[incorrectIndex];
                    if (incorrectIndex < incorrectStrings.length - 1) {
                        result += ", ";
                    }
                    console.log("Adding: " + result);
                    this.feedback += result;
                }
                this.feedback = "Incorrect: " + this.feedback;
            }

            this.agape.enableSpeech();
            this.agape.addDialouge(this.feedback);
            this.feedback = "";

            this.setButtonEnabled(
                this.runButton,
                this.runText,
                false,
                color.NUM_GRAY,
                color.STR_BLACK
            );
            this.setButtonEnabled(
                this.restartButton,
                this.restartText,
                true,
                stringsCorrect ? color.NUM_LIGHT_GREEN : color.NUM_LIGHT_RED,
                color.STR_BLACK
            );
            this.setButtonEnabled(
                this.allButton,
                this.allText,
                false,
                color.NUM_DARK_GRAY,
                color.STR_BLACK
            );
            this.setButtonEnabled(
                this.noneButton,
                this.noneText,
                false,
                color.NUM_DARK_GRAY,
                color.STR_BLACK
            );
            this.setButtonEnabled(
                this.toBuildButton,
                this.toBuildText,
                this.devSkip ? true : this.passedAnalyze, //this.passedAnalyze,
                this.passedAnalyze
                    ? color.NUM_LIGHT_GREEN
                    : color.NUM_DARK_GRAY,
                color.STR_BLACK
            );
            console.log("Toggles buttons: ");
            this.restartButton.setDepth(10);
            this.restartText.setDepth(10);
            this.runButton.setDepth(1);
            this.runText.setDepth(1);
            //let countOn = this.toggleButtons.filter((state) => state).length;
            //console.log(`Toggled on: ${countOn}`);
        });

        // Add "Run" text on top of the diamond
        this.runText = this.add.text(xpos - 15, ypos - 8, "Run", {
            color: color.STR_BLACK,
            fontSize: "16px",
        });
    }

    private createRestartButton(): void {
        let xpos: number = 1080;
        let ypos: number = 600;
        this.restartButton = this.add
            .polygon(
                xpos,
                ypos,
                [50, 0, 100, 50, 50, 100, 0, 50],
                color.NUM_GRAY,
                1
            ) // Different initial color to indicate disabled state
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.setButtonsEnabled(true);
                this.setButtonEnabled(
                    this.restartButton,
                    this.restartText,
                    false,
                    color.NUM_GRAY,
                    color.STR_BLACK
                );
                this.setButtonEnabled(
                    this.runButton,
                    this.runText,
                    true,
                    color.NUM_YELLOW,
                    color.STR_BLACK
                );
                this.setButtonEnabled(
                    this.allButton,
                    this.allText,
                    true,
                    color.NUM_DARK_GRAY,
                    color.STR_WHITE
                );
                this.setButtonEnabled(
                    this.noneButton,
                    this.noneText,
                    true,
                    color.NUM_DARK_GRAY,
                    color.STR_WHITE
                );

                this.toggledOffAllButtons();
                this.randomizeButtonLabels();
                this.resizeBackgrounds();
                console.log("Values: " + this.madeStrings);
                console.log("Accepting strings: " + this.acceptButtons);
                this.runButton.setDepth(10);
                this.runText.setDepth(10);
                this.restartButton.setDepth(1);
                this.restartText.setDepth(1);

                this.agape.disableSpeech();
            });

        this.restartText = this.add.text(xpos - 32, ypos - 8, "Restart", {
            color: color.STR_BLACK,
            fontSize: "16px",
        });
    }

    private setButtonEnabled(
        button: Phaser.GameObjects.Polygon | undefined,
        text: Phaser.GameObjects.Text | undefined,
        enabled: boolean,
        colorFill: number,
        colorText: string
    ): void {
        if (button !== undefined) {
            button.input!.enabled = enabled;
            button.setFillStyle(colorFill);
        }
        if (text !== undefined) {
            text.setColor(colorText);
        }
    }

    private setButtonsEnabled(enabled: boolean): void {
        console.log("String button objects: " + this.stringButtons);
        this.stringButtons.forEach(
            (button: Phaser.GameObjects.Text | undefined) => {
                if (button !== undefined) {
                    console.log("String button text: " + button.text);
                    button!.input!.enabled = enabled;
                    button.setStyle({
                        color: enabled ? color.STR_BLACK : color.STR_GRAY,
                    });
                }
            }
        );
    }

    private randomizeButtonLabels(): void {
        const numRows: number = this.NUM_ROWS;
        const numCols: number = this.NUM_COLS;
        const totalLength: number = numRows * numCols;

        const stringCount: number = totalLength;
        const stringLength: number = 10;
        const isSameLength: boolean = false;
        const allUnique: boolean = true;

        this.madeStrings = this.machineSolution.generateStrings(
            stringCount,
            stringLength,
            isSameLength,
            allUnique
        );

        this.acceptButtons = this.machineSolution.checkStrings(
            this.madeStrings
        );

        for (let index = 0; index < totalLength; index++) {
            let button = this.stringButtons[index];
            if (index < this.madeStrings.length) {
                button.setText(
                    this.madeStrings[index] === ""
                        ? "_"
                        : this.madeStrings[index]
                );
                button.setVisible(true);
            } else {
                button.setText("");
                button.setVisible(false);
            }
        }
    }

    private toggledOffAllButtons(): void {
        for (let index = 0; index < this.toggleButtons.length; index++) {
            this.toggleButtons[index] = false;
        }
    }

    private resizeBackgrounds(): void {
        const numRows: number = this.NUM_ROWS;
        const numCols: number = this.NUM_COLS;
        const totalLength: number = numRows * numCols;
        for (let index = 0; index < totalLength; index++) {
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
}
