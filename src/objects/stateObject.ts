//import { color } from "../objects/color";
import Phaser from "phaser";
import { transitionObject } from "./transitionObject";

export class stateObject {
    private name: string;
    private posX: number;
    private posY: number;
    private radius: number;
    private color: number;
    private state: Phaser.GameObjects.Arc;
    private transitions: transitionObject[] = [];
    private startTransition: transitionObject | undefined;

    public static readonly STATE_ANTI_HIT_BOX: number = 80;
    public static readonly TRANSITION_HIT_BOX: number = 40;

    constructor(
        name: string,
        posX: number,
        posY: number,
        radius: number,
        color: number,
        transitions: transitionObject[],
        scene: Phaser.Scene
    ) {
        this.name = name;
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.color = color;
        this.transitions = transitions;
        this.state = scene.add
            .circle(this.posX, this.posY, radius, this.color)
            .setInteractive({ cursor: "pointer" })
            .setData("isDragging", false); // Initial dragging state

        scene.input.setDraggable(this.state);

        this.state.on("pointerdown", () => {
            this.state.setData("isDragging", true);
        });

        scene.input.on(
            "pointermove",
            (pointer: Phaser.Input.Pointer) => {
                if (this.state.getData("isDragging")) {
                    this.state.x = pointer.worldX;
                    this.state.y = pointer.worldY;
                    this.updatePositions();
                    this.updateTransitions();
                }
            },
            this
        );

        scene.input.on(
            "pointerup",
            () => {
                if (this.state.getData("isDragging")) {
                    this.state.x = Math.round(this.state.x / 40) * 40;
                    this.state.y = Math.round(this.state.y / 40) * 40;
                    this.state.setData("isDragging", false);
                    this.updatePositions();
                    this.updateTransitions();
                }
            },
            this
        );
    }

    public getState(): Phaser.GameObjects.Arc {
        return this.state;
    }

    public setStartTransition(scene: Phaser.Scene) {
        let randomDirection: number = Math.floor(Math.random() * 8);
        let startPosX = this.posX;
        let startPosY = this.posY;
        let endPosX = this.posX;
        let endPosY = this.posY;
        switch (randomDirection) {
            case 0: // right
                startPosX = this.posX + 80;
                startPosY = this.posY;
                endPosX = this.posX + 40;
                endPosY = this.posY;
                break;
            case 1: // right down
                startPosX = this.posX + 80;
                startPosY = this.posY + 80;
                endPosX = this.posX + 40;
                endPosY = this.posY + 40;
                break;
            case 2: // down
                startPosX = this.posX;
                startPosY = this.posY + 80;
                endPosX = this.posX;
                endPosY = this.posY + 40;
                break;
            case 3: // left down
                startPosX = this.posX - 80;
                startPosY = this.posY + 80;
                endPosX = this.posX - 40;
                endPosY = this.posY + 40;
                break;
            case 4: // left
                startPosX = this.posX - 80;
                startPosY = this.posY;
                endPosX = this.posX - 40;
                endPosY = this.posY;
                break;
            case 5: // left up
                startPosX = this.posX - 80;
                startPosY = this.posY - 80;
                endPosX = this.posX - 40;
                endPosY = this.posY - 40;
                break;
            case 6: // up
                startPosX = this.posX;
                startPosY = this.posY - 80;
                endPosX = this.posX;
                endPosY = this.posY - 40;
                break;
            case 7: // right up
                startPosX = this.posX + 80;
                startPosY = this.posY - 80;
                endPosX = this.posX + 40;
                endPosY = this.posY - 40;
                break;
            default:
                break;
        }
        this.startTransition = new transitionObject(
            startPosX,
            startPosY,
            endPosX,
            endPosY,
            "",
            scene
        );
        this.startTransition.getStart().setInteractive();
        scene.input.setDraggable(this.startTransition.getStart());
    }

    private updatePositions() {
        this.posX = this.state.x;
        this.posY = this.state.y;
    }
    private updateTransitions() {
        let count: number =
            this.transitions.length < 1 ? 1 : this.transitions.length;
        let angle: number = (Math.PI * 2) / count;
        this.transitions.forEach(
            (transition: transitionObject, index: number) => {
                transition.setStartPosX(this.posX);
                transition.setStartPosY(this.posY);
                transition.setEndPosX(this.posX + 80 * Math.cos(angle * index));
                transition.setEndPosY(this.posY + 80 * Math.sin(angle * index));
                transition.updateLine();
            }
        );
    }
}
