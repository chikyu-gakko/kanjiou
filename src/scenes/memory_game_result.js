import Phaser from "phaser";

export default class MemoryGameResult extends Phaser.Scene {
  constructor() {
    super({ key: "memory_game_result", active: false });

    this.isWon = false;
  }

  /**
   * @typedef {Object} InitResultSceneData
   * @property {boolean} isWon
   * 
   * @param {InitResultSceneData} data 
   */
  init = (data) => {
    this.isWon = data.isWon;
  }

  create = () => {
    this.add
      .text(0, 300, "とりえあず" + this.isWon ? '勝ち' : '負け')
      .setOrigin(0, 0);
  }
}