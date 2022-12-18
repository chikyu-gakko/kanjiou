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
   * @param {afterFadeInCallback | null} callback afterFadeInCallback | null
   */
  constructor(scene, callback = null) {
    super(scene);
    this.addExisting(scene.cameras.main);
    scene.cameras.main.fadeIn(1000);
    if (callback !== null) callback(scene);
  }
}
