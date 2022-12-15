import Phaser from "phaser";

/**
 * ゲーム中の一時停止ボタン
 */
export default class TimeStopLabel extends Phaser.GameObjects.Text {
  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   * @param {number} x number
   * @param {number} y number
   * @param {string | string[]} text
   * @param {Phaser.Types.GameObjects.Text.TextStyle} style
   */
  constructor(scene, x, y, text, style) {
    super(scene, x, y, text, style);
    scene.add.existing(this);
  }
}
