import Phaser from "phaser";

export default class BackGround extends Phaser.GameObjects.Graphics {
  /**
   * 背景描画
   *
   * @param {Phaser.Scene} scene Phaser.Scene
   */
  constructor(scene) {
    super(scene);
    scene.add.existing(this);
    this.fillStyle(0xebfdff, 1);
    this.fillRect(0, 0, 1024, 768);
  }
}
