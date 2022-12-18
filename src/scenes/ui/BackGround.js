import Phaser from "phaser";

/**
 * @typedef {{color: number, alpha?:number}} Style
 */

export default class BackGround extends Phaser.GameObjects.Graphics {
  /**
   * 背景描画
   *
   * @param {Phaser.Scene} scene Phaser.Scene
   * @param {Style}[style] {color: number, alpha?:number}
   */
  constructor(scene, style = { color: 0xebfdff, alpha: 1 }) {
    super(scene);
    scene.add.existing(this);
    this.fillStyle(style.color, style.alpha);
    this.fillRect(0, 0, 1024, 768);
  }
}
