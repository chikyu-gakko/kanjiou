import Phaser from "phaser";

/**
 * @callback afterFadeInCallback
 * @param {Phaser.Scene} scene
 */

export default class CameraFadeIn extends Phaser.Cameras.Scene2D.CameraManager {
  /**
   * カメラ制御 フェードイン
   *
   * @param {Phaser.Scene} scene Phaser.Scene
   * @param {afterFadeInCallback} callback
   */
  constructor(scene, callback) {
    super(scene);
    this.addExisting(scene.cameras.main);
    scene.cameras.main.fadeIn(1000);
    callback(scene);
  }
}
