export default class NakamaPauseMenu extends Phaser.Scene {
  constructor() {
    super("nakama_pause_menu");
    this.prevSceneData = undefined;
  }

  init(data) {
    this.prevSceneData = {
      sceneName: data.sceneName || 'nakama_game'
    };
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
      .text(halfOfSceneWidth, 200, "つづける", textStyle)
      .setOrigin(0.5, 0)
      .setInteractive()
      .once(
        "pointerdown",
        () => {
          this.scene.resume(this.prevSceneData.sceneName, { status: "continue" });
          this.scene.stop();
        },
        this
      );

    this.add
      .text(halfOfSceneWidth, 312, "1問目に もどる", textStyle)
      .setOrigin(0.5, 0)
      .setInteractive()
      .once(
        "pointerdown",
        () => {
          this.scene.resume(this.prevSceneData.sceneName, {
            status: "restart",
          });
          this.scene.stop();
        },
        this
      );

    this.add
      .text(halfOfSceneWidth, 424, "設定に もどる", textStyle)
      .setOrigin(0.5, 0)
      .setInteractive()
      .once(
        "pointerdown",
        () => {
          this.scene.resume(this.prevSceneData.sceneName, { status: "return-to-setting" });
          this.scene.stop();
        },
        this
      );

    this.add
      .text(halfOfSceneWidth, 536, "トップに もどる", textStyle)
      .setOrigin(0.5, 0)
      .setInteractive()
      .once(
        "pointerdown",
        () => {
          this.scene.resume(this.prevSceneData.sceneName, { status: "return-to-top" });
          this.scene.stop();
        },
        this
      );
  }
}
