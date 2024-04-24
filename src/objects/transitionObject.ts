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

    private startIndex: number;
    private endIndex: number;

    private startTransition: boolean;
    private isDragging: boolean;
    private loop: boolean;
    private loopCondLen: number;

    constructor(
        startPosX: number,
        startPosY: number,
        endPosX: number,
        endPosY: number,
        input: string,
        loopCondLen: number,
        scene: Phaser.Scene
    ) {
        this.startPosX = startPosX;
        this.startPosY = startPosY;
        this.endPosX = endPosX;
        this.endPosY = endPosY;
        this.startTransition = false;
        this.isDragging = false;
        this.loopCondLen = loopCondLen;
        this.loop = false;

        // Create line graphics
        this.line = scene.add.graphics({
            lineStyle: { width: 4, color: color.NUM_BLACK },
        });

        // Create text on the line
        this.input = scene.add.text(
            this.lerp(this.startPosX, this.endPosX, 0.75),
            this.lerp(this.startPosY, this.endPosY, 0.75),
            input,
            {
                fontSize: "32px",
                fontStyle: "bold",
                color: color.STR_BLACK,
            }
        );

        // Create plus sign
        this.start = scene.add
            .text(this.startPosX, this.startPosY, "+", {
                fontSize: "32px",
                fontStyle: "bold",
                color: color.STR_BLACK,
            })
            .setInteractive()
            .setOrigin(0.5, 0.5)
            .on("pointerup", () => {
                // Snap start position and mark it as not being dragged
                if (!this.loop) {
                    this.start.x = Math.round(this.start.x / 40) * 40;
                    this.start.y = Math.round(this.start.y / 40) * 40;
                }
                this.startPosX = this.start.x;
                this.startPosY = this.start.y;
                this.isDragging = false;
                this.updateLine();
                this.start.setData("isDragging", false);
            });
        scene.input.setDraggable(this.start);

        // Create greater than sign
        this.end = scene.add
            .text(this.endPosX, this.endPosY, "<", {
                fontSize: "32px",
                fontStyle: "bold",
                color: color.STR_BLACK,
            })
            .setInteractive()
            .setOrigin(0.5, 0.5)
            .on("pointerup", () => {
                // Snap end position and mark it as not being dragged
                if (!this.loop) {
                    this.end.x = Math.round(this.end.x / 40) * 40;
                    this.end.y = Math.round(this.end.y / 40) * 40;
                }
                this.endPosX = this.end.x;
                this.endPosY = this.end.y;
                this.updateLine();
                this.end.setData("isDragging", false);
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
                if (
                    gameObject instanceof Phaser.GameObjects.Text &&
                    (this.start === gameObject || this.end === gameObject)
                ) {
                    gameObject.x = dragX;
                    gameObject.y = dragY;
                    this.loop = false;
                    this.isDragging = true;
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

    public setText(text: Phaser.GameObjects.Text) {
        this.input = text;
    }

    public setInput(input: string) {
        this.input.setText(input);
    }

    public getInput(): string {
        return this.input.text;
    }

    public setLine(line: Phaser.GameObjects.Graphics) {
        this.line = line;
    }

    public getLine(): Phaser.GameObjects.Graphics {
        return this.line;
    }

    public setStart(start: Phaser.GameObjects.Text): void {
        this.start = start;
    }

    public getStart(): Phaser.GameObjects.Text {
        return this.start;
    }

    public setEnd(end: Phaser.GameObjects.Text): void {
        this.end = end;
    }

    public getEnd(): Phaser.GameObjects.Text {
        return this.end;
    }

    public setStartIndex(startIndex: number): void {
        this.startIndex = startIndex;
    }

    public getStartIndex(): number {
        return this.startIndex;
    }

    public setEndIndex(endIndex: number): void {
        this.endIndex = endIndex;
    }

    public getEndIndex(): number {
        return this.endIndex;
    }

    public setLoop(loop: boolean): void {
        this.loop = loop;
    }

    public getLoop(): boolean {
        return this.loop;
    }

    public setStartTransition(startTransition: boolean): void {
        this.startTransition = startTransition;
        //console.log("transition made start: " + this.startTransition);
    }

    public getStartTranstition(): boolean {
        return this.startTransition;
    }

    public lerp(lower: number, higher: number, weight: number): number {
        return lower + (higher - lower) * weight;
    }

    public showDistance(state: Phaser.GameObjects.Arc) {
        let startDist = Math.sqrt(
            Math.pow(this.start.x - state.x, 2) +
                Math.pow(this.start.y - state.y, 2)
        );
        let endDist = Math.sqrt(
            Math.pow(this.end.x - state.x, 2) +
                Math.pow(this.end.y - state.y, 2)
        );
        console.log("start distance: " + startDist);
        console.log("end distance: " + endDist);
        console.log("state radius: " + state.radius);
    }

    public updateLine(): void {
        //console.log("-Updating Line!");
        //console.log("Is start transition: " + this.startTransition);
        let distance: number = Math.sqrt(
            Math.pow(this.end.x - this.start.x, 2) +
                Math.pow(this.end.y - this.start.y, 2)
        );
        //console.log("Line Distance: " + distance);
        //console.log("Loop Condition Length: " + this.loopCondLen);
        if (distance === this.loopCondLen && !this.startTransition) {
            //console.log("Transiton: Self Loop");
            this.loop = true;
            let radiusArc = this.loopCondLen; //40;
            let centerX = this.start.x;
            let centerY = this.start.y;
            let startAngle = 0;
            let endAngle = 0;
            let onCardinal = false;

            /*let distRight = Math.sqrt(
                Math.pow(this.state.x + outerOffset - this.startStart!.x, 2) +
                    Math.pow(this.state.y - this.startStart!.y, 2)
            );*/

            if (
                this.end.x == this.start.x + this.loopCondLen &&
                this.end.y == this.start.y
            ) {
                //console.log("Self Loop Direction: Right");
                centerX += radiusArc * Math.sqrt(2);
                startAngle = Phaser.Math.DegToRad(225);
                endAngle = Phaser.Math.DegToRad(135);
                onCardinal = true;
            } else if (
                this.end.x == this.start.x - this.loopCondLen &&
                this.end.y == this.start.y
            ) {
                //console.log("Self Loop Direction: Left");
                centerX -= radiusArc * Math.sqrt(2);
                startAngle = Phaser.Math.DegToRad(45);
                endAngle = Phaser.Math.DegToRad(315);
                onCardinal = true;
            } else if (
                this.end.x == this.start.x &&
                this.end.y == this.start.y - this.loopCondLen
            ) {
                //console.log("Self Loop Direction: Up");
                centerY -= radiusArc * Math.sqrt(2);
                startAngle = Phaser.Math.DegToRad(135);
                endAngle = Phaser.Math.DegToRad(45);
                onCardinal = true;
            } else if (
                this.end.x == this.start.x &&
                this.end.y == this.start.y + this.loopCondLen
            ) {
                //console.log("Self Loop Direction: Down");
                centerY += radiusArc * Math.sqrt(2);
                startAngle = Phaser.Math.DegToRad(315);
                endAngle = Phaser.Math.DegToRad(225);
                onCardinal = true;
            }

            if (onCardinal) {
                this.line.clear();
                this.line.beginPath();
                this.line.arc(
                    centerX,
                    centerY,
                    radiusArc,
                    startAngle,
                    endAngle
                );
                this.line.strokePath();
                // Calculate the positions for the markers
                let startX = centerX + radiusArc * Math.cos(startAngle);
                let startY = centerY + radiusArc * Math.sin(startAngle);
                let endX = centerX + radiusArc * Math.cos(endAngle);
                let endY = centerY + radiusArc * Math.sin(endAngle);

                this.input.setPosition(centerX, centerY).setOrigin(0.5, 0.5);

                this.start.setPosition(startX, startY);
                this.start.setRotation(startAngle);
                this.end.setPosition(endX, endY);
                this.end.setRotation(endAngle - Math.PI / 2);
            }
        } else {
            //console.log("Transition: Line");
            if (!this.loop) {
                if (this.isDragging && !this.startTransition) {
                    this.start.setPosition(this.startPosX, this.startPosY);
                } else {
                    this.start.setPosition(this.start.x, this.start.y);
                }
                this.end.setPosition(this.end.x, this.end.y);
                this.line.clear();
                this.line.lineBetween(
                    this.start.x,
                    this.start.y,
                    this.end.x,
                    this.end.y
                );
            }
        }

        if (!this.loop) {
            // Update line text position to the middle of the line
            this.input.x = this.lerp(this.start.x, this.end.x, 0.75); //- this.input.width / 2;
            this.input.y = this.lerp(this.start.y, this.end.y, 0.75);
            this.input.setOrigin(0, 0);

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
            this.start.setRotation(startAngle);
            this.end.setRotation(endAngle);
            /*
            console.log(
                "Plus Sign Angle: " + Math.round(startAngle * (180 / Math.PI))
            );
            console.log(
                "Greater Than Angle: " + Math.round(endAngle * (180 / Math.PI))
            );
            */
        }
    }
}
