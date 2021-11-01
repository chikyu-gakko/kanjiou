export default class OpenLogo extends Phaser.Scene {
  constructor() {
    super({ key: "logo", active: false });
  }

  preload() {
    // ロゴマーク
    this.load.image("logo", "../img/logo_touka.png");
  }

  create() {
    // 画像表示

    // logo画像
    const logoImage = this.add.image(500, 400, "logo");
    logoImage.depth = 1;

    // fadein/out

    this.cameras.main.fadeIn(2000);
    this.cameras.main.once("camerafadeincomplete", (camera) => {
      camera.fadeOut(2000);
    });

    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("game_menu");
    });

    this.tweens.add({
      targets: logoImage,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
      duration: 3000,
    });
  }
}
