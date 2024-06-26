import { color } from "../objects/color";
import Phaser from "phaser";
import { transitionObject } from "./transitionObject";

export class stateObject {
    private name: string;
    private posX: number;
    private posY: number;
    private radius: number;
    private stateColor: number;
    private state: Phaser.GameObjects.Arc;
    private transitions: transitionObject[] = [];
    private cardinalDots: Phaser.GameObjects.Graphics[] = [];
    private nameText: Phaser.GameObjects.Text;
    private stateHitBox: Phaser.GameObjects.Graphics;
    private scene: Phaser.Scene;
    private startTransition: transitionObject | undefined;
    private startStart: Phaser.GameObjects.Text | undefined;
    private startEnd: Phaser.GameObjects.Text | undefined;
    private acceptState: Phaser.GameObjects.Arc | undefined;
    private direction: number;

    public static readonly STATE_HIT_BOX: number = 60;

    constructor(
        name: string,
        posX: number,
        posY: number,
        radius: number,
        stateColor: number,
        transitions: transitionObject[],
        accept: boolean,
        scene: Phaser.Scene
    ) {
        this.setName(name);
        this.posX = posX;
        this.posY = posY;
        this.setRadius(radius);
        this.stateColor = stateColor;
        this.transitions = transitions;
        this.direction = Math.round(Math.random()) * 2 + 1;

        //console.log(this.name + " maybe accepts");
        if (accept) {
            this.acceptState = scene.add.circle(
                this.posX,
                this.posY,
                radius + 5,
                color.NUM_DARK_GRAY
            );
            //console.log(this.name + " is accepting");
        }
        this.state = scene.add
            .circle(this.posX, this.posY, this.radius, this.stateColor)
            .setInteractive({ cursor: "pointer" })
            .setData("isDragging", false); // Initial dragging state

        this.scene = scene;
        scene.input.setDraggable(this.state);

        this.nameText = this.scene.add
            .text(this.posX, this.posY, this.name, {
                fontSize: "32px",
                fontStyle: "bold",
                color: color.STR_BLACK,
            })
            .setOrigin(0.5, 0.5)
            .setVisible(false);

        this.state.on("pointerdown", () => {
            this.state.setData("isDragging", true);
        });

        scene.input.on(
            "pointermove",
            (pointer: Phaser.Input.Pointer) => {
                if (this.state.getData("isDragging")) {
                    this.state.x = pointer.worldX;
                    this.state.y = pointer.worldY;
                    if (this.acceptState !== undefined) {
                        this.acceptState.x = this.state.x;
                        this.acceptState.y = this.state.y;
                    }
                    this.nameText.setVisible(true);
                    this.updatePositions();
                    this.updateCardinalDots();
                    this.updateStateHitBox();
                    this.updateTransitions();
                }
            },
            this
        );

        scene.input.on(
            "pointerup",
            () => {
                if (this.state.getData("isDragging")) {
                    let cellSize: number = 80;
                    this.state.x =
                        this.state.x < cellSize + cellSize / 2
                            ? cellSize + cellSize / 2
                            : this.state.x > cellSize * 9 + cellSize / 2
                            ? cellSize * 9 + cellSize / 2
                            : this.state.x;
                    this.state.y =
                        this.state.y < cellSize * 4 + cellSize / 2
                            ? cellSize * 4 + cellSize / 2
                            : this.state.y > cellSize * 7 + cellSize / 2
                            ? cellSize * 7 + cellSize / 2
                            : this.state.y;
                    this.state.x = Math.round(this.state.x / 40) * 40;
                    this.state.y = Math.round(this.state.y / 40) * 40;
                    if (this.acceptState !== undefined) {
                        this.acceptState.x = this.state.x;
                        this.acceptState.y = this.state.y;
                    }
                    this.state.setData("isDragging", false);
                    this.updatePositions();
                    this.updateCardinalDots();
                    this.updateStateHitBox();
                    this.updateTransitions();

                    this.transitions.forEach((transition) => {
                        let start = transition.getStart();
                        let end = transition.getEnd();
                        let startDist = Math.sqrt(
                            Math.pow(start.x - this.state.x, 2) +
                                Math.pow(start.y - this.state.y, 2)
                        );
                        let endDist = Math.sqrt(
                            Math.pow(end.x - this.state.x, 2) +
                                Math.pow(end.y - this.state.y, 2)
                        );
                        console.log("start distance: " + startDist);
                        console.log("end distance: " + endDist);
                        console.log("state radius: " + this.state.radius);
                    });
                }
            },
            this
        );
        this.setTransitions();

        // creating cardinal dots
        for (let index = 0; index < 4; index++) {
            this.cardinalDots[index] = scene.add.graphics({ x: 0, y: 0 });
            //this.cardinalDots[index].fillStyle(color.NUM_DARK_GRAY);
        }

        this.stateHitBox = scene.add.graphics({
            lineStyle: { width: 2, color: color.NUM_BLACK },
        });

        this.hideStateHitBox();
        //this.selfLoop();
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public setRadius(radius: number): void {
        this.radius = Math.abs(radius);
    }

    public getRadius(): number {
        return this.radius;
    }

    public getTransitions(): transitionObject[] {
        return this.transitions;
    }

    public updateCardinalDots(): void {
        this.cardinalDots.forEach((dot) => {
            dot.clear();
        });
        this.cardinalDots.forEach((dot, index) => {
            let angle = Phaser.Math.DegToRad(index * 90);
            let posX = this.state.x + (this.radius + 2) * Math.cos(angle);
            let posY = this.state.y + (this.radius + 2) * Math.sin(angle);
            dot.fillStyle(color.NUM_DARK_GRAY);
            dot.fillCircle(posX, posY, 10);
            //console.log("cardinal dot index: " + index);
            //console.log("posX: " + posX + " posY: " + posY);
        });
    }

    public updateStateHitBox() {
        this.stateHitBox.clear();
        let sideLength = stateObject.STATE_HIT_BOX * 2;
        let centerX = this.state.x;
        let centerY = this.state.y;
        let topLeftX = centerX - stateObject.STATE_HIT_BOX;
        let topLeftY = centerY - stateObject.STATE_HIT_BOX;
        this.stateHitBox.strokeRect(topLeftX, topLeftY, sideLength, sideLength);
    }

    public invalidStateHitBoxColor() {
        this.stateHitBox.clear();
        this.stateHitBox.lineStyle(2, color.NUM_RED);
        let sideLength = stateObject.STATE_HIT_BOX * 2;
        let centerX = this.state.x;
        let centerY = this.state.y;
        let topLeftX = centerX - stateObject.STATE_HIT_BOX;
        let topLeftY = centerY - stateObject.STATE_HIT_BOX;
        this.stateHitBox.strokeRect(topLeftX, topLeftY, sideLength, sideLength);
        console.log("Turing the hit box this color: " + color.NUM_RED);
    }

    public validStateHitBoxColor() {
        this.stateHitBox.clear();
        this.stateHitBox.lineStyle(2, color.NUM_BLACK);
        let sideLength = stateObject.STATE_HIT_BOX * 2;
        let centerX = this.state.x;
        let centerY = this.state.y;
        let topLeftX = centerX - stateObject.STATE_HIT_BOX;
        let topLeftY = centerY - stateObject.STATE_HIT_BOX;
        this.stateHitBox.strokeRect(topLeftX, topLeftY, sideLength, sideLength);
        console.log("Turing the hit box this color: " + color.NUM_BLACK);
    }

    public hideStateHitBox() {
        this.stateHitBox.setVisible(false);
    }

    public showStateHitBox() {
        this.stateHitBox.setVisible(true);
    }

    public getState(): Phaser.GameObjects.Arc {
        return this.state;
    }

    public setStartTransition(scene: Phaser.Scene) {
        let startPosX = this.posX;
        let startPosY = this.posY;
        let endPosX = this.posX;
        let endPosY = this.posY;
        if (this.startTransition === undefined) {
            //console.log("--Creating start transition!");
            this.startTransition = new transitionObject(
                startPosX,
                startPosY,
                endPosX,
                endPosY,
                "",
                this.radius,
                scene
            );
            this.startTransition.setStartTransition(true);
            this.startStart = this.startTransition.getStart();
            this.startStart.setInteractive();
            this.startEnd = this.startTransition.getEnd();
            this.startEnd.disableInteractive();
            scene.input.setDraggable(this.startStart);
            //this.startStart.off("pointerup", () => {}, this);

            this.startStart.on("pointerup", () => {
                let outerOffset: number = 100;
                let innerOffset: number = 40;

                let distRight = Math.sqrt(
                    Math.pow(
                        this.state.x + outerOffset - this.startStart!.x,
                        2
                    ) + Math.pow(this.state.y - this.startStart!.y, 2)
                );
                let distLeft = Math.sqrt(
                    Math.pow(
                        this.state.x - outerOffset - this.startStart!.x,
                        2
                    ) + Math.pow(this.state.y - this.startStart!.y, 2)
                );
                let distUp = Math.sqrt(
                    Math.pow(this.state.x - this.startStart!.x, 2) +
                        Math.pow(
                            this.state.y - outerOffset - this.startStart!.y,
                            2
                        )
                );
                let distDown = Math.sqrt(
                    Math.pow(this.state.x - this.startStart!.x, 2) +
                        Math.pow(
                            this.state.y + outerOffset - this.startStart!.y,
                            2
                        )
                );
                /*
                console.log("distLeft: " + distLeft);
                console.log("distRight: " + distRight);
                console.log("distUp: " + distUp);
                console.log("distDown: " + distDown);
                */
                if (
                    Math.min(distLeft, distRight, distUp, distDown) == distLeft
                ) {
                    this.startStart!.x = this.state.x - outerOffset;
                    this.startStart!.y = this.state.y;
                    this.startEnd!.x = this.state.x - innerOffset;
                    this.startEnd!.y = this.state.y;
                }
                if (
                    Math.min(distLeft, distRight, distUp, distDown) == distRight
                ) {
                    this.startStart!.x = this.state.x + outerOffset;
                    this.startStart!.y = this.state.y;
                    this.startEnd!.x = this.state.x + innerOffset;
                    this.startEnd!.y = this.state.y;
                }
                if (Math.min(distLeft, distRight, distUp, distDown) == distUp) {
                    this.startStart!.y = this.state.y - outerOffset;
                    this.startStart!.x = this.state.x;
                    this.startEnd!.y = this.state.y - innerOffset;
                    this.startEnd!.x = this.state.x;
                }
                if (
                    Math.min(distLeft, distRight, distUp, distDown) == distDown
                ) {
                    this.startStart!.y = this.state.y + outerOffset;
                    this.startStart!.x = this.state.x;
                    this.startEnd!.y = this.state.y + innerOffset;
                    this.startEnd!.x = this.state.x;
                }
                this.startTransition!.updateLine();
                this.startStart!.setData("isDragging", false);
            });
        } else {
            switch (this.direction) {
                case 0: // right
                    startPosX = this.posX + 100;
                    startPosY = this.posY;
                    endPosX = this.posX + 40;
                    endPosY = this.posY;
                    break;
                case 1: // down
                    startPosX = this.posX;
                    startPosY = this.posY + 100;
                    endPosX = this.posX;
                    endPosY = this.posY + 40;
                    break;
                case 2: // left
                    startPosX = this.posX - 100;
                    startPosY = this.posY;
                    endPosX = this.posX - 40;
                    endPosY = this.posY;
                    break;
                case 3: // up
                    startPosX = this.posX;
                    startPosY = this.posY - 100;
                    endPosX = this.posX;
                    endPosY = this.posY - 40;
                    break;
                default:
                    this.direction = -1;
                    break;
            }
            //console.log("--Start transition exists! Updating..");
            this.startTransition.setStartPosX(startPosX);
            this.startTransition.setStartPosY(startPosY);
            this.startTransition.setEndPosX(endPosX);
            this.startTransition.setEndPosY(endPosY);
            this.startTransition.updateLine();
        }
    }

    public setTransitions(): void {
        this.transitions.forEach((transition: transitionObject) => {
            transition.getStart().disableInteractive();
        });
    }

    private updatePositions(): void {
        this.posX = this.state.x;
        this.posY = this.state.y;
        this.nameText.setPosition(this.posX, this.posY);
        this.nameText.setDepth(100);
    }
    private updateTransitions(): void {
        let count: number =
            this.transitions.length < 1 ? 1 : this.transitions.length;
        let angle: number = (Math.PI * 2) / count;
        this.transitions.forEach(
            (transition: transitionObject, index: number) => {
                transition.setStartPosX(this.posX);
                transition.setStartPosY(this.posY);
                transition.setEndPosX(this.posX + 80 * Math.cos(angle * index));
                transition.setEndPosY(this.posY + 80 * Math.sin(angle * index));
                transition.setLoop(false);
                transition.updateLine();
            }
        );
        if (this.startTransition !== undefined) {
            this.setStartTransition(this.scene);
        }
    }
}
