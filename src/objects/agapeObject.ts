import { color } from "../objects/color";
import Phaser from "phaser";

export class agapeObject {
    private scene: Phaser.Scene;
    private cellSide: number;
    private posX: number;
    private posY: number;
    private eyeColor: number;
    private moodColor: number;
    private moodNum: number;

    private leftSide: Phaser.GameObjects.Graphics;
    private rightSide: Phaser.GameObjects.Graphics;
    private leftEye: Phaser.GameObjects.Graphics;
    private rightEye: Phaser.GameObjects.Graphics;

    private speechBubble: Phaser.GameObjects.Graphics;
    private speechOutline: Phaser.GameObjects.Graphics;
    private dialouge: Phaser.GameObjects.Text;
    private dialougeFontSize: number = 18;

    constructor(
        posX: number,
        posY: number,
        cellside: number,
        enableSpeech: boolean,
        scene: Phaser.Scene
    ) {
        // Create AGAPE EYES
        this.cellSide = cellside;
        this.posX = posX; //this.cellSide * 13;
        this.posY = posY; //this.cellSide * 2;
        this.eyeColor = color.NUM_DARK_GRAY; // dark gray
        this.moodColor = color.NUM_LIGHT_GREEN; // light green
        this.moodNum = 1;
        this.scene = scene;

        let crossLength: number = this.cellSide;
        let offset: number = crossLength;
        let radius: number = crossLength * 0.5;

        console.log("Offset: " + offset);
        // Create two diamonds
        this.leftSide = this.createDiamond(
            this.posX - offset,
            this.posY,
            this.moodColor,
            crossLength
        ); // Left Eye
        this.rightSide = this.createDiamond(
            this.posX + offset,
            this.posY,
            this.moodColor,
            crossLength
        ); // Right Eye

        // Create two circles, positioned to match diamonds
        this.leftEye = this.createCircle(
            this.posX - offset,
            this.posY,
            this.eyeColor,
            radius
        ); // Left Pupil
        this.rightEye = this.createCircle(
            this.posX + offset,
            this.posY,
            this.eyeColor,
            radius
        ); // Right Pupil

        this.createSpeechBubble(this.posX, this.posY + this.cellSide * 2);

        if (enableSpeech) {
            this.enableSpeech();
        } else {
            this.disableSpeech();
        }
    }
    private createDiamond(
        xpos: number,
        ypos: number,
        color: number,
        crossLength: number
    ): Phaser.GameObjects.Graphics {
        console.log("Xpos: " + xpos + " Ypos: " + ypos);
        let diamond = this.scene.add.graphics({
            fillStyle: { color: color },
        });
        let path = new Phaser.Curves.Path(xpos - crossLength, ypos);
        path.lineTo(xpos, ypos - crossLength);
        path.lineTo(xpos + crossLength, ypos);
        path.lineTo(xpos, ypos + crossLength);
        path.lineTo(xpos - crossLength, ypos);
        diamond.fillPoints(path.getPoints(), true);
        return diamond;
    }

    private createCircle(
        xpos: number,
        ypos: number,
        color: number,
        radius: number
    ): Phaser.GameObjects.Graphics {
        let circle = this.scene.add.graphics({ fillStyle: { color: color } });
        circle.fillCircle(xpos, ypos, radius);
        return circle;
    }

    private createSpeechBubble(xpos: number, ypos: number): void {
        console.log("Xpos: " + xpos + " Ypos: " + ypos);
        this.speechOutline = this.scene.add.graphics({
            fillStyle: { color: color.NUM_DARK_GRAY },
        });
        this.speechBubble = this.scene.add.graphics({
            fillStyle: { color: color.NUM_WHITE },
        });
        const path1 = new Phaser.Curves.Path(
            xpos,
            ypos - 100 - 4 * Math.sqrt(2)
        );
        path1.lineTo(
            xpos - 50 - 4 * Math.cos(3 * (Math.PI / 8)),
            ypos - 50 - 4 * Math.sin(3 * (Math.PI / 8))
        );
        path1.lineTo(xpos - 80 - 50 - 4, ypos - 50 - 4);
        path1.lineTo(xpos - 80 - 50 - 4, ypos + 50 + 4);
        path1.lineTo(xpos + 80 + 50 + 4, ypos + 50 + 4);
        path1.lineTo(xpos + 80 + 50 + 4, ypos - 50 - 4);
        path1.lineTo(
            xpos + 50 + 4 * Math.cos(3 * (Math.PI / 8)),
            ypos - 50 - 4 * Math.sin(3 * (Math.PI / 8))
        );
        path1.lineTo(xpos, ypos - 100 - 4 * Math.sqrt(2));
        this.speechOutline.fillPoints(path1.getPoints(), true);

        const path2 = new Phaser.Curves.Path(xpos, ypos - 100);
        path2.lineTo(xpos - 50, ypos - 50);
        path2.lineTo(xpos - 80 - 50, ypos - 50);
        path2.lineTo(xpos - 80 - 50, ypos + 50);
        path2.lineTo(xpos + 80 + 50, ypos + 50);
        path2.lineTo(xpos + 80 + 50, ypos - 50);
        path2.lineTo(xpos + 50, ypos - 50);
        path2.lineTo(xpos, ypos - 100);
        this.speechBubble.fillPoints(path2.getPoints(), true);

        let text: string = "";
        this.dialouge = this.scene.add.text(
            this.posX,
            this.posY + 160,
            `${text}`,
            {
                color: color.STR_BLACK,
                fontSize: "24px",
                backgroundColor: color.STR_WHITE,
                wordWrap: { width: 260 },
            }
        );
        this.dialouge.setPadding(10).setOrigin(0.5, 0.5);
    }

    public enableSpeech(): void {
        this.speechBubble.setVisible(true);
        this.speechOutline.setVisible(true);
        this.dialouge.setVisible(true);
    }

    public disableSpeech(): void {
        this.speechBubble.setVisible(false);
        this.speechOutline.setVisible(false);
        this.dialouge.setVisible(false);
    }

    public addDialouge(input: string): void {
        this.dialouge.setText(input);
        let altSize: boolean = true;
        let dialougeScaleFactor: number = 1;
        while (this.dialouge.width > 260 || this.dialouge.height > 100 - 2) {
            if (altSize) {
                altSize = false;
                dialougeScaleFactor = 260 / this.dialouge.width;
                this.dialouge.setScale(dialougeScaleFactor);
            } else {
                altSize = true;
                this.dialougeFontSize = this.dialougeFontSize * 0.95;
                this.dialouge.setFontSize(this.dialougeFontSize);
            }
        }
    }

    public betterMood(): void {
        this.moodNum = this.moodNum > 1 ? 1 : this.moodNum + 1;
        this.setMood();
    }

    public worsenMood(): void {
        this.moodNum = this.moodNum < -1 ? -1 : this.moodNum - 1;
        this.setMood();
    }

    public setMoodNum(moodNum: number): void {
        this.moodNum = moodNum < -1 ? -1 : moodNum > 1 ? 1 : moodNum;
        this.setMood();
    }

    public setMood(): void {
        this.leftSide.clear();
        this.rightSide.clear();
        this.leftEye.clear();
        this.rightEye.clear();
        let numColor: number = color.NUM_LIGHT_GREEN;
        switch (this.moodNum) {
            case 1:
                numColor = color.NUM_LIGHT_GREEN;
                break;
            case 0:
                numColor = color.NUM_LIGHT_YELLOW;
                break;
            case -1:
                numColor = color.NUM_LIGHT_RED;
                break;
            default:
                break;
        }
        this.leftSide = this.createDiamond(
            this.posX - this.cellSide,
            this.posY,
            numColor,
            this.cellSide
        );
        this.rightSide = this.createDiamond(
            this.posX + this.cellSide,
            this.posY,
            numColor,
            this.cellSide
        );
        this.leftEye = this.createCircle(
            this.posX - this.cellSide,
            this.posY,
            this.eyeColor,
            this.cellSide * 0.5
        );
        this.rightEye = this.createCircle(
            this.posX + this.cellSide,
            this.posY,
            this.eyeColor,
            this.cellSide * 0.5
        );
    }
}
