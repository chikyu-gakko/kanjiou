export default class NakamaPauseMenu extends Phaser.Scene {
  constructor() {
    super("nakama_pause_menu");
  }

  create() {
    const halfOfSceneWidth = this.sys.canvas.width / 2;

    const background = this.add.graphics();
    background.fillStyle(0x000000, 1).fillRect(0, 0, 1024, 768);

    const textStyle = {
      color: "#ffffff",
      fontFamily: this.registry.get("fontFamily"),
      fontSize: "32px",
    };

    this.add
      .text(halfOfSceneWidth, 200, "再開する", textStyle)
      .setOrigin(0.5, 0)
      .setInteractive()
      .once(
        "pointerdown",
        () => {
          this.scene.resume("nakama_game", { status: "continue" });
          this.scene.stop();
        },
        this
      );

    this.add
      .text(halfOfSceneWidth, 312, "やり直す", textStyle)
      .setOrigin(0.5, 0)
      .setInteractive()
      .once(
        "pointerdown",
        () => {
          this.scene.resume("nakama_game", {
            status: "restart",
          });
          this.scene.stop();
        },
        this
      );

    this.add
      .text(halfOfSceneWidth, 424, "設定画面へ戻る", textStyle)
      .setOrigin(0.5, 0)
      .setInteractive()
      .once(
        "pointerdown",
        () => {
          this.scene.resume("nakama_game", { status: "return-to-setting" });
          this.scene.stop();
        },
        this
      );

    this.add
      .text(halfOfSceneWidth, 536, "トップへ戻る", textStyle)
      .setOrigin(0.5, 0)
      .setInteractive()
      .once(
        "pointerdown",
        () => {
          this.scene.resume("nakama_game", { status: "return-to-top" });
          this.scene.stop();
        },
        this
      );
  }
}
