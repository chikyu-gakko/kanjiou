import SettingButton from "./setting_button.js";
import SoundButton from "./sound_button.js";

export default class ChallengeMenu extends Phaser.Scene {
  constructor() {
    super({ key: "challenge_menu", active: false });
  }

  preload() {
    // メニュー画面に出てくる画像のロード
    this.load.path = window.location.href.replace("index.html", "");

    this.load.image("sound", "img/sound.png");
    this.load.image("mute", "img/mute.png");
    this.load.image("mogura", "img/fun_mogura1.png");

    // bgm
    this.load.audio("top_bgm", "audio/top.mp3");
    this.load.audio("game_start_se", "audio/game_start.mp3");
  }

  init() {
    this.selectedButton = "hitsuji-250";
    this.selectedSettingCategory = "hitsuji";
    this.categoryButtons = [];
    this.settingElements = [];
    this.fontFamily = this.registry.get("fontFamily");
  }

  create() {
    // 音楽
    if (this.sound.get("top_bgm") === null) {
      this.sound.add("top_bgm");
      this.sound.play("top_bgm", { loop: true });
    }

    this.soundButton = new SoundButton(this, 70, 700, 40);

    // --- ボタン---

    // --- ✖ボタン・イベント ---
    const crossButton = this.add.text(967, 36, "✖", {
      fontSize: "32px",
      fill: "#ffffff",
    });

    crossButton.setInteractive().on(
      "pointerdown",
      () => {
        this.scene.start("game_menu");
      },
      this
    );

    // タイトル
    this.add
      .text(330, 64, "チャレンジモード", {
        fontSize: 48,
        fontFamily: this.fontFamily,
        padding: 3,
      })
      .setPadding(4);

    // ゲームメニュー
    const gameMenuBox = this.add.graphics();
    gameMenuBox.fillStyle(0x333333, 1).fillRect(120, 138, 787, 478);

    const gameMenuLine = this.add.graphics();
    gameMenuLine.fillStyle(0x535353, 1).fillRect(396, 138, 2, 478);

    // ゲームスタートSE
    const gameStartSe = this.sound.add("game_start_se");

    // ゲームスタートボタン・テキスト
    this.add
      .graphics()
      .lineStyle(2, 0x645246)
      .fillStyle(0x32b65e, 1)
      .fillRoundedRect(340, 642, 368, 80, 40)
      .setInteractive(
        new Phaser.Geom.Rectangle(340, 642, 368, 80),
        Phaser.Geom.Rectangle.Contains
      )
      .strokePath()
      .on(
        "pointerdown",
        () => {
          this.sound.stopAll();
          this.sound.removeByKey("top_bgm");
          gameStartSe.play();
          const sizeY = 6;
          const sizeX = 12;
          const mode = "suddenDeath";
          this.scene.start("hitsuji_game", {
            sizeY,
            sizeX,
            mode,
            isChallenge: true,
            schoolYear: "",
          });
        },
        this
      );

    this.add.text(417, 666, "ゲームスタート", {
      fontSize: "32px",
      fill: "#ffffff",
      fontFamily: this.fontFamily,
    });

    // mogura画像
    this.add.image(410, 680, "mogura");

    // 遊び方ボタン
    this.add
      .graphics()
      .lineStyle(2, 0xffffff)
      .fillStyle(0x000000, 1)
      .fillRoundedRect(787, 645, 189, 75, 35)
      .setInteractive(
        new Phaser.Geom.Rectangle(787, 645, 189, 75),
        Phaser.Geom.Rectangle.Contains
      )
      .strokePath()
      .on(
        "pointerdown",
        () => {
          this.scene.start("how_to_play");
        },
        this
      );

    this.add.text(830, 665, "遊び方", {
      fontSize: "32px",
      fill: "#ffffff",
      fontFamily: this.fontFamily,
    });

    this.categoryButtons = [
      // ゲームサイズ
      this.add
        .text(146, 370, "羊の中に犬が一匹", {
          color: "#ffffff",
          fontSize: 28,
          fontFamily: this.fontFamily,
        })
        .setData("value", "hitsuji"),
    ];
    this.categoryButtons.forEach((element) =>
      element.setInteractive().on(
        "pointerdown",
        () => {
          this.selectedSettingCategory = element.getData("value");
          this.updateView();
        },
        this
      )
    );

    this.settingElements = [
      new SettingButton(
        this,
        506,
        287,
        246,
        62,
        "250問チャレンジ",
        22,
        this.fontFamily
      )
        .setData("category", "hitsuji")
        .setData("value", "hitsuji-250"),
      this.add
        .text(
          462,
          373,
          "できるところまで、やってみよう！\nミスしないで、250問できたら\n漢字王だ♪",
          {
            fontSize: 20,
            fontFamily: this.fontFamily,
            align: "center",
          }
        )
        .setData("category", "hitsuji")
        .setLineSpacing(12),
    ];
    this.settingElements.forEach((element) => {
      if (element.constructor.name === "SettingButton") {
        element.buttonGraphic.on(
          "pointerdown",
          () => {
            this.selectedButton = element.getData("value");
            this.updateView();
          },
          this
        );
      }
    });
    this.updateView();
  }

  updateView() {
    this.categoryButtons.forEach((element) => {
      if (this.selectedSettingCategory === element.getData("value")) {
        element.setStyle({ color: "#32B65E" });
      } else element.setStyle({ color: "#ffffff" });
    });

    this.settingElements.forEach((element) => {
      if (this.selectedSettingCategory === element.getData("category")) {
        element.setVisible(true);
        if (element.constructor.name === "SettingButton") {
          if (this.selectedButton === element.getData("value"))
            element.changeChallengeButton();
          else element.changeUnselected();
        }
      } else element.setVisible(false);
    });
  }
}
