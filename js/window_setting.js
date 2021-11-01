export default class WindowSetting extends Phaser.Scene {
  constructor() {
    super({ key: "window", active: true });
  }

  create() {
    setTimeout(() => {
      // --- Window設定 ---
      const graphics = this.add.graphics();

      graphics
        .fillStyle(0xffffff, 1)
        .fillRoundedRect(352, 302, 320, 160, 5, 5).depth = 0;

      // --- テキスト---
      const screenText = this.add.text(
        388,
        328,
        "フルスクリーン表示しますか？",
        {
          fontSize: "18px",
          fontFamily: "nomal",
          fill: "#3c3c3c",
        }
      );

      screenText
        .setInteractive()
        .on("pointerdown", () => {
          this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          this.scale.pageAlignHorisontally = true;
          this.scale.pageAlignVertically = true;
        })
        .setPadding(4).depth = 1;

      const alertText = this.add.text(
        388,
        421,
        "※フルスクリーン表示にしないとゲームが開始されません",
        {
          fontSize: "10px",
          fill: "#3c3c3c",
        }
      );

      alertText.setPadding(4).depth = 1;

      // --- ボタン---

      // --- ✖ボタン・イベント ---
      const crossButton = this.add.text(652, 310, "✖", {
        fontSize: "16px",
        fill: "#707070",
      });

      crossButton.setInteractive().on(
        "pointerdown",
        () => {
          this.scene.start("window");
        },
        this
      );
      crossButton.depth = 1;

      // ---「いいえ」ボタン/テキスト---
      const cancelGraphics = this.add.graphics();

      cancelGraphics
        .fillStyle(0x707070, 1)
        .fillRoundedRect(373, 363, 137, 40, 5).depth = 1;

      const cancelText = this.add.text(422, 375, "いいえ", {
        fontSize: "16px",
        fill: "#ffffff",
      });

      cancelText.depth = 2;
      cancelText.setInteractive().on(
        "pointerdown",
        () => {
          this.cameras.main.fadeOut(500);
          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("window");
          });
        },
        this
      );

      // 「はい」ボタン/テキスト
      const dicisionGraphics = this.add.graphics();

      dicisionGraphics
        .fillStyle(0x32b65e, 1)
        .fillRoundedRect(515, 363, 137, 40, 5).depth = 1;

      const dicisionText = this.add.text(571, 375, "はい", {
        fontSize: "16px",
        fill: "#ffffff",
      });

      dicisionText.depth = 2;
      dicisionText.setInteractive().on(
        "pointerdown",
        () => {
          dicisionText.removeInteractive();
          this.cameras.main.fadeOut(500);
          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("logo");
          });
        },
        this
      );
    }, 3000);
  }
}
