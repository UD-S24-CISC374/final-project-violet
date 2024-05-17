import Phaser from "phaser";
import { color } from "../objects/color";
import { stringFSM } from "../objects/stringFSM";
import { levelsFSM } from "../objects/levelsFSM";
import { transitionObject } from "../objects/transitionObject";
import { stateObject } from "../objects/stateObject";
import { agapeObject } from "../objects/agapeObject";

export default class buildScene extends Phaser.Scene {
    private sceneTitle: Phaser.GameObjects.Text;

    private levelNum: number = 0;
    private livesCount: number = 5;
    private currentLevelUnlocked: number = 0;
    private levelsPassed: boolean[] = [];

    private passedBuild: boolean = false;

    private devSkip: boolean = false;

    private hitBoxButton: Phaser.GameObjects.Polygon;
    private hitBoxText: Phaser.GameObjects.Text;
    private toggleHitBoxes: boolean = false;

    private runButton: Phaser.GameObjects.Polygon;
    private runText: Phaser.GameObjects.Text;

    private toLevelsButton: Phaser.GameObjects.Polygon;
    private toLevelsText: Phaser.GameObjects.Text;

    private states: stateObject[] = [];
    private statesOutOfHitBoxes: number[] = [];
    private statesPlaced: boolean[] = [];
    private statesBoundary: Phaser.GameObjects.Graphics;

    private transitions: transitionObject[] = [];
    private transitionInState: boolean[] = [];
    private transitionToState: number[] = [];

    private machineSolution: stringFSM;
    private machineSolutionAccepts: boolean[] = [];

    private machineBuilt: stringFSM;
    private machineBuiltAccepts: boolean[] = [];

    private agape: agapeObject;
    private feedback: string;

    constructor() {
        super({ key: "buildScene" });
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

        console.log("Build Scene Initialized");
        console.log("Level Num: " + this.levelNum);
        console.log("Lives Count: " + this.livesCount);
        console.log("Current Level Unlocked: " + this.currentLevelUnlocked);
        console.log("Levels Passed: " + this.levelsPassed);
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
                wordWrap: { width: 720 },
            }
        );
        //language.setPosition(100 + language.width / 2, 160);
        let languageScaleFactor: number = 1;
        language.setPadding(10);
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

        // Instructions
        let instructionFontSize: number = 24;
        const instructions = this.add.text(
            480,
            160,
            `Instructions: Drag all cirlces to the screen until q0. Drag all the arrows to other circles or itself. Click "Run". If right click "Next Level".`,
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

        const cellSize: number = 80;
        let topLeftX = cellSize * 1;
        let topLeftY = cellSize * 4;
        let sideLengthX = cellSize * 9;
        let sideLengthY = cellSize * 4;

        this.statesBoundary = this.add.graphics({
            lineStyle: { width: 4, color: color.NUM_BLACK },
        });
        this.statesBoundary.strokeRect(
            topLeftX,
            topLeftY,
            sideLengthX,
            sideLengthY
        );

        this.passedBuild = false;

        this.states = [];
        this.statesOutOfHitBoxes = [];
        this.statesPlaced = [];

        this.transitions = [];
        this.transitionInState = [];
        this.transitionToState = [];

        // Create multiple draggable circles
        let startPosX: number = 120;
        let startPosY: number = 600;
        let radius: number = 40;
        let stateDepth: number = 0;
        let transitionDepth: number = this.machineSolution.getStartFSM().length;
        let totalTransitionIndex: number = 0;

        this.machineSolution.getStatesFSM().forEach((name, stateIndex) => {
            const theseTransitions: transitionObject[] = [];
            this.machineSolution
                .getAlphabetFSM()
                .forEach((input, transitionIndex) => {
                    theseTransitions[transitionIndex] = new transitionObject(
                        startPosX,
                        startPosY,
                        startPosX,
                        startPosY,
                        input,
                        radius,
                        this
                    );
                    theseTransitions[transitionIndex]
                        .getStart()
                        .setDepth(transitionDepth);
                    theseTransitions[transitionIndex]
                        .getEnd()
                        .setDepth(transitionDepth);
                    transitionDepth++;

                    console.log(
                        "CREATING TRANSITION - state index: " + stateIndex
                    );
                    theseTransitions[transitionIndex].setStartIndex(stateIndex);
                    theseTransitions[transitionIndex].setEndIndex(-1);

                    this.transitions[totalTransitionIndex] =
                        theseTransitions[transitionIndex];

                    this.transitionInState[totalTransitionIndex] = false;
                    this.transitionToState[totalTransitionIndex] = -1;
                    console.log("transition index: " + totalTransitionIndex);
                    // arrow.on("pointerup",()=>{})
                    totalTransitionIndex++;
                });

            this.states[stateIndex] = new stateObject(
                name,
                startPosX,
                startPosY,
                radius,
                color.NUM_YELLOW,
                theseTransitions,
                this.machineSolution.stateIsAccepting(name),
                this
            );
            this.statesOutOfHitBoxes[stateIndex] = 0;
            this.statesPlaced[stateIndex] = false;
            let circle = this.states[stateIndex].getState();
            circle.setDepth(stateDepth);

            circle.on("pointerup", () => {
                this.statesPlaced[stateIndex] = true;
                this.clearStateHitBoxAudit();
                circle.x = Math.round(circle.x / 40) * 40;
                circle.y = Math.round(circle.y / 40) * 40;
                for (let index1 = 0; index1 < this.states.length; index1++) {
                    for (
                        let index2 = index1;
                        index2 < this.states.length;
                        index2++
                    ) {
                        console.log(index1 + " " + index2);
                        let circle = this.states[index1].getState();
                        let otherCircle = this.states[index2].getState();
                        if (circle !== otherCircle) {
                            let isMinimumDist = this.checkMinimumDistance(
                                circle,
                                otherCircle
                            );
                            console.log("state 1: " + index1);
                            console.log("state 2: " + index2);
                            if (isMinimumDist) {
                                console.log("outside of hit box");
                                this.statesOutOfHitBoxes[index1]++;
                                this.statesOutOfHitBoxes[index2]++;
                                console.log("MIN: " + index1 + " " + index2);
                            } else {
                                console.log("inside of hit box");
                                this.statesOutOfHitBoxes[index1]--;
                                this.statesOutOfHitBoxes[index2]--;
                                console.log(
                                    "NOT MIN: " + index1 + " " + index2
                                );
                            }
                        } else if (this.states.length == 1) {
                            console.log("only 1 state");
                            this.statesOutOfHitBoxes[index1] = 1;
                        }
                    }
                }
                console.log(this.statesOutOfHitBoxes);
                console.log(this.statesPlaced);
            });

            stateDepth++;
        });

        this.states[0].setStartTransition(this);

        this.transitions.forEach((transition, transitionIndex) => {
            let arrow = transition.getEnd();
            arrow.on("pointerup", () => {
                console.log("arrow index: " + transitionIndex);
                let skip: boolean = false;
                this.states.forEach((state, stateIndex) => {
                    let circle = state.getState();
                    let stateRadius = state.getRadius();
                    let arrowDistance = Math.sqrt(
                        Math.pow(arrow.x - circle.x, 2) +
                            Math.pow(arrow.y - circle.y, 2)
                    );
                    console.log("state radius: " + stateRadius);
                    if (arrowDistance <= stateRadius) {
                        console.log(
                            "transition " +
                                transitionIndex +
                                " in state: " +
                                stateIndex
                        );
                        //arrow.setDepth(100);
                        this.transitionInState[transitionIndex] = true;
                        this.transitionToState[transitionIndex] = stateIndex;
                        skip = true;

                        let startStateIndex = transition.getStartIndex();
                        let startStateX =
                            this.states[startStateIndex].getState().x;
                        let startStateY =
                            this.states[startStateIndex].getState().y;
                        if (startStateIndex != stateIndex) {
                            let distRight = Math.sqrt(
                                Math.pow(
                                    circle.x + stateRadius - startStateX,
                                    2
                                ) + Math.pow(circle.y - startStateY, 2)
                            );
                            let distLeft = Math.sqrt(
                                Math.pow(
                                    circle.x - stateRadius - startStateX,
                                    2
                                ) + Math.pow(circle.y - startStateY, 2)
                            );
                            let distUp = Math.sqrt(
                                Math.pow(circle.x - startStateX, 2) +
                                    Math.pow(
                                        circle.y - stateRadius - startStateY,
                                        2
                                    )
                            );
                            let distDown = Math.sqrt(
                                Math.pow(circle.x - startStateX, 2) +
                                    Math.pow(
                                        circle.y + stateRadius - startStateY,
                                        2
                                    )
                            );

                            console.log("TRANSITION IN STATE");
                            console.log("distLeft: " + distLeft);
                            console.log("distRight: " + distRight);
                            console.log("distUp: " + distUp);
                            console.log("distDown: " + distDown);

                            if (
                                Math.min(
                                    distLeft,
                                    distRight,
                                    distUp,
                                    distDown
                                ) == distLeft
                            ) {
                                arrow!.x = circle.x - stateRadius;
                                arrow!.y = circle.y;
                            } else if (
                                Math.min(
                                    distLeft,
                                    distRight,
                                    distUp,
                                    distDown
                                ) == distRight
                            ) {
                                arrow!.x = circle.x + stateRadius;
                                arrow!.y = circle.y;
                            } else if (
                                Math.min(
                                    distLeft,
                                    distRight,
                                    distUp,
                                    distDown
                                ) == distUp
                            ) {
                                arrow!.x = circle.x;
                                arrow!.y = circle.y - stateRadius;
                            } else if (
                                Math.min(
                                    distLeft,
                                    distRight,
                                    distUp,
                                    distDown
                                ) == distDown
                            ) {
                                arrow!.x = circle.x;
                                arrow!.y = circle.y + stateRadius;
                            }
                            transition.updateLine();
                        }
                    } else {
                        console.log(
                            "transition " +
                                transitionIndex +
                                " not in state: " +
                                stateIndex
                        );
                        if (!skip) {
                            this.transitionInState[transitionIndex] = false;
                            this.transitionToState[transitionIndex] = -1;
                            transition.setEndIndex(-1);
                        }
                    }
                });
                console.log("total transition index: " + transitionIndex);
                console.log(this.transitionInState);
                console.log(this.transitionToState);
                console.log("length: " + this.transitionInState.length);
                console.log(this.states);
            });
        });

        // Create AGAPE EYES
        const cellSide: number = 80;
        const AGAPE_posX: number = cellSide * 13;
        const AGAPE_posY: number = cellSide * 2;
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

        // Button to show/hide state hit box
        this.hitBoxButton = this.add
            .polygon(
                1080,
                600,
                [50, 0, 100, 50, 50, 100, 0, 50],
                color.NUM_DARK_GRAY,
                1
            )
            .setInteractive({ handcursor: true });
        this.hitBoxButton.on("pointerdown", () => {
            if (this.toggleHitBoxes) {
                this.showStatesHitBoxes();
            } else {
                this.hideStatesHitBoxes();
            }
        });
        this.hitBoxText = this.add.text(1080, 600, "Boxes", {
            color: color.STR_WHITE,
            fontSize: "16px",
        });
        this.hitBoxText.setOrigin(0.5, 0.5);

        // Run Button
        this.runButton = this.add
            .polygon(
                1000,
                600,
                [50, 0, 100, 50, 50, 100, 0, 50],
                color.NUM_YELLOW,
                1
            )
            .setInteractive({ handcursor: true });
        this.runButton.on("pointerdown", () => {
            let statesValid = this.checkStates();
            let transitionsValid = this.checkTransitions();
            let allStatesPlaced = this.allStatesPlaced();
            console.log("States Hit Boxes Valid: " + statesValid);
            console.log(this.statesPlaced);
            console.log(this.statesOutOfHitBoxes);
            console.log("Transitions Valid: " + transitionsValid);
            console.log(this.transitionInState);
            console.log(this.transitionToState);

            this.showTransitionFromTo();

            let errorMessages = [];

            if (!statesValid) {
                console.log("States invalid");
                errorMessages.push("States invalid.");
                this.showStatesHitBoxes();
            } else {
                this.hideStatesHitBoxes();
            }

            if (!transitionsValid) {
                console.log("Transitions invalid");
                errorMessages.push("Transitions invalid.");
            }

            if (!allStatesPlaced) {
                console.log("States not all placed");
                console.log(this.statesPlaced);
                errorMessages.push("States not all placed.");
            }

            let errors = "";

            for (
                let errorIndex = 0;
                errorIndex < errorMessages.length;
                errorIndex++
            ) {
                errors += errorMessages[errorIndex];
                if (errorIndex < errorMessages.length - 1) {
                    errors += " ";
                }
            }

            this.feedback = errors;
            this.agape.enableSpeech();
            this.agape.addDialouge(this.feedback);

            if (statesValid && transitionsValid && allStatesPlaced) {
                this.parseMachine();
                this.compareMachines();
            }
        });
        this.runText = this.add.text(1000, 600, "Run", {
            color: color.STR_BLACK,
            fontSize: "16px",
        });
        this.runText.setOrigin(0.5, 0.5);

        this.toLevelsButton = this.add
            .polygon(
                1040,
                520,
                [50, 0, 100, 50, 50, 100, 0, 50],
                color.NUM_YELLOW,
                1
            )
            .setInteractive({ handcursor: true });
        this.toLevelsButton.on("pointerdown", () => {
            this.scene.start("levelsScene", {
                levelNum: this.levelNum,
                livesCount: this.livesCount,
                currentLevelUnlocked:
                    this.passedBuild &&
                    this.currentLevelUnlocked == this.levelNum //this.levelsPassed[this.levelNum]
                        ? this.currentLevelUnlocked + 1
                        : this.currentLevelUnlocked,
                levelsPassed: this.levelsPassed,
            });
        });
        this.toLevelsText = this.add
            .text(1040, 520, "Next Level", {
                color: color.STR_BLACK,
                fontSize: "16px",
                wordWrap: { width: 80 },
                align: "center",
            })
            .setOrigin(0.5, 0.5);
        if (this.currentLevelUnlocked == -1) {
            this.devSkip = true;
        }
        this.setButtonEnabled(
            this.toLevelsButton,
            this.toLevelsText,
            this.devSkip ? true : this.passedBuild,
            color.NUM_DARK_GRAY,
            color.STR_BLACK
        );
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

    public checkMinimumDistance(
        circle1: Phaser.GameObjects.Arc,
        circle2: Phaser.GameObjects.Arc
    ): boolean {
        let minDistance = stateObject.STATE_HIT_BOX * 2;
        let xDistance = Math.abs(circle1.x - circle2.x);
        let yDistance = Math.abs(circle1.y - circle2.y);
        return minDistance <= xDistance || minDistance <= yDistance;
    }

    public clearStateHitBoxAudit() {
        for (let index = 0; index < this.statesOutOfHitBoxes.length; index++) {
            this.statesOutOfHitBoxes[index] = 0;
        }
    }

    public checkStates(): boolean {
        console.log("--CHECK STATES--");
        this.clearStateHitBoxAudit();
        let allOutOfHitBoxes: boolean = true;
        let stateCondition: number = this.states.length - 1;
        for (let index1 = 0; index1 < this.states.length; index1++) {
            let circle = this.states[index1].getState();
            for (let index2 = index1; index2 < this.states.length; index2++) {
                let otherCircle = this.states[index2].getState();
                if (circle !== otherCircle) {
                    let isMinimumDist = this.checkMinimumDistance(
                        circle,
                        otherCircle
                    );
                    console.log("state 1: " + index1);
                    console.log("state 2: " + index2);
                    if (isMinimumDist) {
                        console.log("outside of hit box");
                        this.statesOutOfHitBoxes[index1]++;
                        this.statesOutOfHitBoxes[index2]++;
                        console.log("MIN: " + index1 + " " + index2);
                    } else {
                        console.log("inside of hit box");
                        this.statesOutOfHitBoxes[index1]--;
                        this.statesOutOfHitBoxes[index2]--;
                        console.log("NOT MIN: " + index1 + " " + index2);
                    }
                } else if (this.states.length == 1) {
                    console.log("only 1 state");
                    this.statesOutOfHitBoxes[index1] = 0;
                }
            }
        }
        this.statesOutOfHitBoxes.forEach((count, index) => {
            if (stateCondition !== count) {
                allOutOfHitBoxes = false;
                this.states[index].invalidStateHitBoxColor();
                console.log("state " + index + " hit box made red");
            } else {
                this.states[index].validStateHitBoxColor();
                console.log("state " + index + " hit box made black");
            }
        });
        return allOutOfHitBoxes;
    }

    public allStatesPlaced(): boolean {
        let allPlaced: boolean = true;
        this.statesPlaced.forEach((isPlaced) => {
            if (!isPlaced) {
                allPlaced = false;
            }
        });
        return allPlaced;
    }

    public checkTransitions(): boolean {
        console.log("--CHECK TRANSITIONS--");
        let transitionsValid: boolean = true;
        this.transitions.forEach((transition, transitionIndex) => {
            let arrow = transition.getEnd();
            //console.log("arrow index: " + transitionIndex);
            let skip: boolean = false;
            this.states.forEach((state, stateIndex) => {
                let circle = state.getState();
                let stateRadius = state.getRadius();
                let arrowDistance = Math.sqrt(
                    Math.pow(arrow.x - circle.x, 2) +
                        Math.pow(arrow.y - circle.y, 2)
                );
                //console.log("state radius: " + stateRadius);
                if (arrowDistance <= stateRadius) {
                    /*console.log(
                        "transition " +
                            transitionIndex +
                            " in state: " +
                            stateIndex
                    );*/
                    this.transitionInState[transitionIndex] = true;
                    this.transitionToState[transitionIndex] = stateIndex;
                    transition.setEndIndex(stateIndex);
                    skip = true;

                    // Place snapArrowToCircle() function
                } else {
                    /*console.log(
                        "transition " +
                            transitionIndex +
                            " not in state: " +
                            stateIndex
                    );*/
                    if (!skip) {
                        this.transitionInState[transitionIndex] = false;
                        this.transitionToState[transitionIndex] = -1;
                        transition.setEndIndex(-1);
                    }
                }
            });
            /*
            console.log("total transition index: " + transitionIndex);
            console.log(this.transitionInState);
            console.log(this.transitionToState);
            console.log("length: " + this.transitionInState.length);
            console.log(this.states);
            */
        });
        this.transitionToState.forEach((toIndex, fromIndex) => {
            if (toIndex === -1) {
                transitionsValid = false;
                this.transitions[fromIndex].setIsValid(false);
                this.transitions[fromIndex].invalidTransition();
            } else {
                this.transitions[fromIndex].setIsValid(true);
                this.transitions[fromIndex].validTransition();
            }
        });
        return transitionsValid;
    }

    public showTransitionFromTo() {
        this.transitions.forEach((transition) => {
            let start = transition.getStartIndex();
            let end = transition.getEndIndex();
            let input = transition.getInput();
            console.log(start + " " + input + " " + end);
        });
    }

    public showStatesHitBoxes() {
        this.states.forEach((state) => {
            state.showStateHitBox();
        });
        this.toggleHitBoxes = false;
    }

    public hideStatesHitBoxes() {
        this.states.forEach((state) => {
            state.hideStateHitBox();
        });
        this.toggleHitBoxes = true;
    }

    public parseMachine() {
        let machineId: number = 0;
        let machineDesc: string = "Player Machine";
        let machineAlphabet: string[] = this.machineSolution.getAlphabetFSM();
        let machineStates: string[] = this.machineSolution.getStatesFSM();
        let machineStart: string = this.machineSolution.getStartFSM();
        let machineAccept: string[] = this.machineSolution.getAcceptFSM();
        let machineType: string = this.machineSolution.getType();
        let transitionTable: string[][] = [];
        this.states.forEach((state) => {
            let statesTransition: string[] = [];
            statesTransition.push(state.getName());
            state.getTransitions().forEach((transition) => {
                statesTransition.push(transition.getInput());
                statesTransition.push(
                    this.states[transition.getEndIndex()].getName()
                );
            });
            console.log(statesTransition);
            transitionTable.push(statesTransition);
        });
        this.machineBuilt = new stringFSM(
            machineId,
            machineDesc,
            machineAlphabet,
            machineStates,
            machineStart,
            machineAccept,
            transitionTable,
            machineType
        );
    }

    public compareMachines() {
        const stringCount: number = 1000;
        const stringLength: number = 10;
        const allSameLength: boolean = false;
        const allUnique: boolean = true;
        let madeStrings: string[] = this.machineSolution.generateStrings(
            stringCount,
            stringLength,
            allSameLength,
            allUnique
        );
        this.machineSolutionAccepts =
            this.machineSolution.checkStrings(madeStrings);
        this.machineBuiltAccepts = this.machineBuilt.checkStrings(madeStrings);
        console.log("Machine Solution: " + this.machineSolutionAccepts);
        console.log("Machine Built: " + this.machineBuiltAccepts);

        let machineBuiltCorrect: boolean = false;

        for (let index = 0; index < stringCount; index++) {
            if (
                (this.machineBuiltAccepts[index] &&
                    this.machineSolutionAccepts[index]) ||
                (!this.machineBuiltAccepts[index] &&
                    !this.machineSolutionAccepts[index])
            ) {
                machineBuiltCorrect = true;
            } else {
                console.log(
                    "Incorrect simulated string: " + madeStrings[index]
                );
                console.log(
                    "Solution Accepts: " + this.machineSolutionAccepts[index]
                );
                console.log(
                    "Builts Accepts: " + this.machineBuiltAccepts[index]
                );
                machineBuiltCorrect = false;
                this.feedback =
                    "Incorrect simulated string: " + madeStrings[index];
                this.agape.worsenMood();
                break;
            }
        }
        if (machineBuiltCorrect) {
            this.feedback = "Machine is built correctly!";
            this.agape.setMoodNum(1);
        }
        this.agape.addDialouge(this.feedback);
        console.log("Machine is built correctly: " + machineBuiltCorrect);

        if (machineBuiltCorrect || this.passedBuild) {
            this.passedBuild = true;
            this.levelsPassed[this.levelNum] = true;
            this.setButtonEnabled(
                this.toLevelsButton,
                this.toLevelsText,
                this.passedBuild,
                color.NUM_LIGHT_GREEN,
                color.STR_BLACK
            );
        } else {
            this.setButtonEnabled(
                this.toLevelsButton,
                this.toLevelsText,
                this.passedBuild,
                color.NUM_LIGHT_RED,
                color.STR_BLACK
            );
            this.levelsPassed[this.levelNum] = false;
        }
        console.log("Levels passed: " + this.levelsPassed);
    }
}
