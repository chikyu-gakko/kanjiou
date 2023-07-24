import Phaser from "phaser";

export default class MemoryGame extends Phaser.Scene {
  constructor() {
    super({ key: "memory_game", active: false });
  }

  create = () => {
    this.add
      .text(0, 200, "とりあえずとリザルトへ")
      .setInteractive()
      .once(
        "pointerdown",
        () => {
          this.scene.start("memory_result", { level: 1, CorrectAnswer:15 ,QuestionNum:15});
        },
        this
      );
  }
}