import { color } from "../objects/color";
import Phaser from "phaser";

export class agapeObject {
    private scene: Phaser.Scene;
    private cellSide: number;
    private posX: number;
    private posY: number;
    private eyeColor: number;
    private moodColor: number;

    constructor(
        posX: number,
        posY: number,
        cellside: number,
        scene: Phaser.Scene
    ) {
        // Create AGAPE EYES
        this.cellSide = cellside;
        this.posX = posX; //this.cellSide * 13;
        this.posY = posY; //this.cellSide * 2;
        this.eyeColor = color.NUM_DARK_GRAY; // dark gray
        this.moodColor = color.NUM_LIGHT_GREEN; // light green
        this.scene = scene;

        let crossLength: number = this.cellSide;
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
        crossLength: number
    ): void {
        console.log("Xpos: " + xpos + " Ypos: " + ypos);
        const diamond = this.scene.add.graphics({
            fillStyle: { color: color },
        });
        const path = new Phaser.Curves.Path(xpos - crossLength, ypos);
        path.lineTo(xpos, ypos - crossLength);
        path.lineTo(xpos + crossLength, ypos);
        path.lineTo(xpos, ypos + crossLength);
        path.lineTo(xpos - crossLength, ypos);
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
