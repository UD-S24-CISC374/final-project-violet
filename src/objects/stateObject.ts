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
