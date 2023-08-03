import Phaser from "phaser";

export default class MemoryGameSetting extends Phaser.Scene {
  constructor() {
    super({ key: "memory_game_setting", active: false });
  }

  create = () => {
    this.add
      .text(0, 200, "とりあえずゲームへ LEVEL 1")
      .setInteractive()
      .once(
        "pointerdown",
        () => {
          this.scene.start("memory_game", { level: 1 });
        },
        this
      );
      this.add
        .text(0, 300, "とりあえずゲームへ LEVEL 2")
        .setInteractive()
        .once(
          "pointerdown",
          () => {
            this.scene.start("memory_game", { level: 2 });
          },
          this
        );
      this.add
        .text(0, 400, "とりあえずゲームへ LEVEL 3")
        .setInteractive()
        .once(
          "pointerdown",
          () => {
            this.scene.start("memory_game", { level: 3 });
          },
          this
        );
  }
}