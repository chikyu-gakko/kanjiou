import CameraFadeIn from "./ui/CameraFadeIn";

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
    this.load.image("logo", "assets/img/logo_tikyu.png");
  }

  create() {
    // 画像表示

    // logo画像
    const logoImage = this.add
      .image(this.game.canvas.width / 2, this.game.canvas.height / 2, "logo")
      .setOrigin(0.5);

    this.add
      .text(this.game.canvas.width / 2, 150, "画面をタッチしてスタート！", {
        fill: "#ffff",
        fontFamily: this.fontFamily,
        fontSize: "48px",
      })
      .setOrigin(0.5, 0);

    this.add
      .text(
        this.game.canvas.width / 2,
        600,
        `
      ●漢字王決定戦は認定NPO法人地球学校の登録商標です（5793032）
      ●当ゲームに含まれるグラフィック、イラスト、音楽、文章を含むすべてのコンテンツの
        権利は認定NPO法人地球学校が有しています。無断で転載することはできません。
        `,
        {
          fill: "#ffff",
          fontFamily: this.fontFamily,
          fontSize: "16px",
        }
      )
      .setOrigin(0.5, 0);

    // fadein/out

    this.startCameraFadeIn();

    this.tweens.add({
      targets: logoImage,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
      duration: 3000,
    });
  }

  startCameraFadeIn = () => {
    /**
     * @param {Phaser.Scene} scene
     */
    const callback = (scene) => {
      scene.cameras.main.once("camerafadeincomplete", (camera) => {
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
    };
    new CameraFadeIn(this, callback);
  };
}
