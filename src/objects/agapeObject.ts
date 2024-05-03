import { color } from "../objects/color";
import Phaser from "phaser";

export class agapeObject {
    private scene: Phaser.Scene;
    private cellSide: number;
    private posX: number;
    private posY: number;
    private eyeColor: number;
    private moodColor: number;

    constructor(posX: number, posY: number) {
        // Create AGAPE EYES
        this.cellSide = 80;
        this.posX = posX; //this.cellSide * 13;
        this.posY = posY; //this.cellSide * 2;
        this.eyeColor = color.NUM_DARK_GRAY; // dark gray
        this.moodColor = color.NUM_LIGHT_GREEN; // light green

        let crossLength: number = 80;
        let offset: number = crossLength;
        let radius: number = crossLength * 0.5;

        console.log("Offset: " + offset);
        // Create two diamonds
        this.createDiamond(
            this.posX - offset,
            this.posY,
            this.moodColor,
            crossLength
        ); // Left Eye
        this.createDiamond(
            this.posX + offset,
            this.posY,
            this.moodColor,
            crossLength
        ); // Right Eye

        // Create two circles, positioned to match diamonds
        this.createCircle(this.posX - offset, this.posY, this.eyeColor, radius); // Left Pupil
        this.createCircle(this.posX + offset, this.posY, this.eyeColor, radius); // Right Pupil
    }
    private createDiamond(
        xpos: number,
        ypos: number,
        color: number,
        crossRadius: number
    ): void {
        console.log("Xpos: " + xpos + " Ypos: " + ypos);
        const diamond = this.scene.add.graphics({
            fillStyle: { color: color },
        });
        const path = new Phaser.Curves.Path(xpos - crossRadius, ypos);
        path.lineTo(xpos, ypos - crossRadius);
        path.lineTo(xpos + crossRadius, ypos);
        path.lineTo(xpos, ypos + crossRadius);
        path.lineTo(xpos - crossRadius, ypos);
        diamond.fillPoints(path.getPoints(), true);
    }

    private createCircle(
        xpos: number,
        ypos: number,
        color: number,
        radius: number
    ): void {
        const circle = this.scene.add.graphics({ fillStyle: { color: color } });
        circle.fillCircle(xpos, ypos, radius);
    }
}
