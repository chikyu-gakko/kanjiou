export default class OpenLogo extends Phaser.Scene {
  constructor() {
    super({ key: "logo", active: true });
  }

  init() {
    this.fontFamily = this.registry.get("fontFamily");
  }

  preload() {
    this.load.path = window.location.href.replace("index.html", "");
    // ロゴマーク
    this.load.image("logo", "img/logo_tikyu.png");
  }

  create() {
    // 画像表示

    // logo画像
    const logoImage = this.add
      .image(this.game.canvas.width / 2, this.game.canvas.height / 2, "logo")
      .setOrigin(0.5);

    this.add
      .text(this.game.canvas.width / 2, 600, "画面をタッチしてスタート！", {
        fill: "#ffff",
        fontFamily: this.fontFamily,
        fontSize: "32px",
      })
      .setOrigin(0.5, 0);

    // fadein/out
    this.cameras.main.fadeIn(2000);
    this.cameras.main.once("camerafadeincomplete", (camera) => {
      this.add
        .graphics()
        .fillStyle(0x000000, 0.05)
        .fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)
        .setInteractive(
          new Phaser.Geom.Rectangle(
            0,
            0,
            this.game.canvas.width,
            this.game.canvas.height
          ),
          Phaser.Geom.Rectangle.Contains
        )

        .on("pointerdown", () => {
          camera.fadeOut(2000);
          this.scene.start("game_menu");
        });
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
