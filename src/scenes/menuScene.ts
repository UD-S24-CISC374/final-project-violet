import Phaser from "phaser";

export default class menuScene extends Phaser.Scene {
    private sceneText: Phaser.GameObjects.Text;
    private playButton: Phaser.GameObjects.Text;
    private exitButton: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "menuScene" });
    }

    preload() {
        this.load.image("checker1", "assets/Checker_Background_1.png");
    }

    init() {}

    create() {
        console.log("Menu Scene");
        // Checkerboard background
        this.add.image(640, 360, "checker1");
        // First, create a rectangle with the desired dimensions
        this.add.rectangle(640, 80, 480, 160, 0xffffff);

        // Title text
        this.sceneText = this.add
            .text(640, 80, "Finite Builder", {
                fontSize: "48px",
                color: "#000",
                align: "center",
            })
            .setPadding(20)
            .setOrigin(0.5, 0.5);
        // playButton to levelScene
        this.playButton = this.add
            .text(640, 440, "Play", {
                fontSize: "30px",
                color: "#0f0",
                backgroundColor: "#fff",
            })
            .setOrigin(0.5, 0.5)
            .setPadding(10)
            .setInteractive()
            .on("pointerdown", () =>
                this.time.delayedCall(
                    1000,
                    () => {
                        this.scene.start("levelsScene");
                    },
                    [],
                    this
                )
            );

        // playButton styling
        this.playButton.on("pointerover", () =>
            this.playButton.setStyle({ fill: "#ff0" })
        );
        this.playButton.on("pointerout", () =>
            this.playButton.setStyle({ fill: "#0f0" })
        );
        this.playButton.on("pointerdown", () =>
            this.playButton
                .setStyle({ fill: "#f00" })
                .on("pointerout", () =>
                    this.playButton.setStyle({ fill: "#f00" })
                )
        );
        this.playButton.on("pointerup", () =>
            this.playButton.setStyle({ fill: "#f00" })
        );

        // exitButton to leave game
        this.exitButton = this.add
            .text(640, 520, "Exit", {
                fontSize: "30px",
                color: "#000",
                backgroundColor: "#fff",
            })
            .setOrigin(0.5, 0.5)
            .setPadding(10)
            .setInteractive()
            .on("pointerdown", () =>
                this.time.delayedCall(
                    1000,
                    () => {
                        window.close();
                    },
                    [],
                    this
                )
            );

        // playButton styling
        this.exitButton.on("pointerover", () =>
            this.exitButton.setStyle({ fill: "#ff0" })
        );
        this.exitButton.on("pointerout", () =>
            this.exitButton.setStyle({ fill: "#000" })
        );
        this.exitButton.on("pointerdown", () =>
            this.exitButton
                .setStyle({ fill: "#f00" })
                .on("pointerout", () =>
                    this.exitButton.setStyle({ fill: "#f00" })
                )
        );
        this.exitButton.on("pointerup", () =>
            this.exitButton.setStyle({ fill: "#f00" })
        );
    }
}
