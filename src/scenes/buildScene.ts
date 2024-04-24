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

    private hitBoxButton: Phaser.GameObjects.Polygon;
    private hitBoxText: Phaser.GameObjects.Text;
    private toggleHitBoxes: boolean = false;

    private runButton: Phaser.GameObjects.Polygon;
    private runText: Phaser.GameObjects.Text;

    private states: stateObject[] = [];
    //private stateDepths: number[] = [];
    private statesOutOfHitBoxes: number[] = [];
    private statesPlaced: boolean[] = [];

    private transitions: transitionObject[] = [];
    private transitionInState: boolean[] = [];
    private transitionToState: number[] = [];

    private builtMachine: stringFSM;

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

        // Create multiple draggable circles
        let startPosX: number = 120;
        let startPosY: number = 600;
        let radius: number = 40;
        let stateDepth: number = 0;
        let transitionDepth: number = this.machine.getStartFSM().length;
        let totalTransitionIndex: number = 0;

        this.machine.getStatesFSM().forEach((name, stateIndex) => {
            const theseTransitions: transitionObject[] = [];
            this.machine.getAlphabetFSM().forEach((input, transitionIndex) => {
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

                console.log("CREATING TRANSITION - state index: " + stateIndex);
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
                this.machine.stateIsAccepting(name),
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
                    let stateRadius = circle.radius;
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
                        this.transitionInState[transitionIndex] = true;
                        this.transitionToState[transitionIndex] = stateIndex;
                        skip = true;
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

        // Button to show/hide state hit box
        this.hitBoxButton = this.add
            .polygon(
                1040,
                400,
                [50, 0, 100, 50, 50, 100, 0, 50],
                color.NUM_YELLOW,
                1
            )
            .setInteractive({ handcursor: true });
        this.hitBoxButton.on("pointerdown", () => {
            if (this.toggleHitBoxes) {
                this.states.forEach((state) => {
                    state.hideStateHitBox();
                });
                this.toggleHitBoxes = false;
            } else {
                this.states.forEach((state) => {
                    state.showStateHitBox();
                });
                this.toggleHitBoxes = true;
            }
        });
        this.hitBoxText = this.add.text(1040, 400, "Boxes", {
            color: color.STR_BLACK,
            fontSize: "16px",
        });
        this.hitBoxText.setOrigin(0.5, 0.5);

        // Run Button
        this.runButton = this.add
            .polygon(
                1040,
                560,
                [50, 0, 100, 50, 50, 100, 0, 50],
                color.NUM_YELLOW,
                1
            )
            .setInteractive({ handcursor: true });
        this.runButton.on("pointerdown", () => {
            console.log("States Hit Boxes Valid: " + this.checkStateHitBixes());
            console.log(this.statesPlaced);
            console.log(this.statesOutOfHitBoxes);
            console.log("Transitions Valid: " + this.checkTransitions());
            console.log(this.transitionInState);
            console.log(this.transitionToState);

            this.showTransitionFromTo();
        });
        this.runText = this.add.text(1040, 560, "Run", {
            color: color.STR_BLACK,
            fontSize: "16px",
        });
        this.runText.setOrigin(0.5, 0.5);
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

    public checkStateHitBixes(): boolean {
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
                    //console.log("state 1: " + index1);
                    //console.log("state 2: " + index2);
                    if (isMinimumDist) {
                        //console.log("outside of hit box");
                        this.statesOutOfHitBoxes[index1]++;
                        this.statesOutOfHitBoxes[index2]++;
                        //console.log("MIN: " + index1 + " " + index2);
                    } else {
                        //console.log("inside of hit box");
                        this.statesOutOfHitBoxes[index1]--;
                        this.statesOutOfHitBoxes[index2]--;
                        //console.log("NOT MIN: " + index1 + " " + index2);
                    }
                } else if (this.states.length == 1) {
                    //console.log("only 1 state");
                    this.statesOutOfHitBoxes[index1] = 0;
                }
            }
        }
        this.statesOutOfHitBoxes.forEach((count) => {
            if (stateCondition !== count) {
                allOutOfHitBoxes = false;
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
                let stateRadius = circle.radius;
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
        this.transitionToState.forEach((index) => {
            if (index === -1) {
                transitionsValid = false;
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
}
