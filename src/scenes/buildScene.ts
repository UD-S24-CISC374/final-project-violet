import Phaser from "phaser";

export default class buildScene extends Phaser.Scene {
    private sceneText?: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "buildScene" });
    }

    preload() {
        this.load.image("checker2", "assets/Checker_Background_2.png");
    }

    init() {}

    create() {
        console.log("Build Scene");
        // Checkerboard background
        this.add.image(640, 360, "checker2");

        this.add.rectangle(640, 40, 160, 80, 0xffffff);

        // Title text
        this.sceneText = this.add
            .text(640, 40, "Levels", {
                fontSize: "40px",
                color: "#000",
                align: "center",
            })
            .setPadding(20)
            .setOrigin(0.5, 0.5);
    }
}
