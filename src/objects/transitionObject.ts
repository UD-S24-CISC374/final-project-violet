//import { transition } from "../objects/transition";
import { color } from "../objects/color";
import Phaser from "phaser";

export class transitionObject {
    private startPosX: number;
    private startPosY: number;
    private endPosX: number;
    private endPosY: number;

    private start: Phaser.GameObjects.Text;
    private end: Phaser.GameObjects.Text;
    private line: Phaser.GameObjects.Graphics;
    private input: Phaser.GameObjects.Text;

    constructor(
        startPosX: number,
        startPosY: number,
        endPosX: number,
        endPosY: number,
        input: string,
        scene: Phaser.Scene
    ) {
        this.startPosX = startPosX;
        this.startPosY = startPosY;
        this.endPosX = endPosX;
        this.endPosY = endPosY;

        // Create line graphics
        this.line = scene.add.graphics({
            lineStyle: { width: 2, color: color.NUM_DARK_GRAY },
        });

        // Create text on the line
        this.input = scene.add.text(
            (this.startPosX + this.endPosX) / 2,
            (this.startPosY + this.endPosY) / 2,
            input,
            {
                fontSize: "20px",
                color: color.STR_BLACK,
            }
        );

        // Create plus sign
        this.start = scene.add
            .text(this.startPosX, this.startPosY, "+", {
                fontSize: "32px",
                color: color.STR_BLACK,
            })
            .setInteractive()
            .setOrigin(0.5, 0.5)
            .on("pointerup", () => {
                // Snap circle's position and mark it as not being dragged
                this.start.x = Math.round(this.start.x / 40) * 40;
                this.start.y = Math.round(this.start.y / 40) * 40;
                this.start.setData("isDragging", false);
                this.updateLine();
            });
        scene.input.setDraggable(this.start);

        // Create greater than sign
        this.end = scene.add
            .text(this.endPosX, this.endPosY, "<", {
                fontSize: "32px",
                color: color.STR_BLACK,
            })
            .setInteractive()
            .setOrigin(0.5, 0.5)
            .on("pointerup", () => {
                // Snap circle's position and mark it as not being dragged
                this.end.x = Math.round(this.end.x / 40) * 40;
                this.end.y = Math.round(this.end.y / 40) * 40;
                this.end.setData("isDragging", false);
                this.updateLine();
            });
        scene.input.setDraggable(this.end);

        this.updateLine();

        // Drag events
        scene.input.on(
            "drag",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.GameObject, // Use a more specific type if known, e.g., Phaser.GameObjects.Text
                dragX: number,
                dragY: number
            ) => {
                // Since gameObject is of type GameObject, we need to assert the specific type
                // if we know it's going to be a Text object or another specific type
                // to access properties like x and y safely.
                if (gameObject instanceof Phaser.GameObjects.Text) {
                    gameObject.x = dragX;
                    gameObject.y = dragY;
                }
                this.updateLine();
            }
        );
    }

    public setStartPosX(value: number): void {
        this.startPosX = value;
        this.start.setPosition(this.startPosX, this.startPosY);
    }
    public getStartPosX(): number {
        return this.startPosX;
    }
    public setStartPosY(value: number): void {
        this.startPosY = value;
        this.start.setPosition(this.startPosX, this.startPosY);
    }
    public getStartPosY(): number {
        return this.startPosY;
    }
    public setEndPosX(value: number): void {
        this.endPosX = value;
        this.end.setPosition(this.endPosX, this.endPosY);
    }
    public getEndPosX(): number {
        return this.endPosX;
    }
    public setEndPosY(value: number): void {
        this.endPosY = value;
        this.end.setPosition(this.endPosX, this.endPosY);
    }
    public getEndPosY(): number {
        return this.endPosY;
    }

    public setInput(input: string) {
        this.input.setText(input);
    }

    public getInput(): string {
        return this.input.text;
    }

    public updateLine(): void {
        this.line.clear();
        this.line.lineBetween(
            this.start.x,
            this.start.y,
            this.end.x,
            this.end.y
        );
        // Update line text position to the middle of the line
        this.input.x = (this.start.x + this.end.x) / 2 - this.input.width / 2;
        this.input.y = (this.start.y + this.end.y) / 2;

        let startAngle: number = 0;
        let endAngle: number = 0;

        let deltaStartX: number = this.end.x - this.start.x;
        let deltaStartY: number = this.end.y - this.start.y;
        let deltaEndX: number = this.start.x - this.end.x;
        let deltaEndY: number = this.start.y - this.end.y;

        startAngle = Math.atan(deltaStartY / deltaStartX);
        endAngle = Math.atan(deltaEndY / deltaEndX);

        if (this.start.x < this.end.x) {
            endAngle += Math.PI;
        }

        console.log(
            "Plus Sign Angle: " + Math.round(startAngle * (180 / Math.PI))
        );
        console.log(
            "Greater Than Angle: " + Math.round(endAngle * (180 / Math.PI))
        );
        this.start.setRotation(startAngle);
        this.end.setRotation(endAngle);
    }
}
