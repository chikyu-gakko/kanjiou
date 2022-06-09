import SettingButton from "../components/setting_button.js";
import SoundButton from "../components/sound_button.js";

export default class GameSetting extends Phaser.Scene {
  constructor() {
    super({ key: "game_setting", active: false });
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

  init(data) {
    this.size = "ふつう";
    this.mode = "時間制限";
    this.schoolYear = "1年生";

    if (data.sizeY) {
      switch (data.sizeY) {
        case 3:
          this.size = "少ない";
          break;
        case 6:
          this.size = "多い";
          break;
        default:
      }
    }
    if (data.mode) {
      switch (data.mode) {
        case "timeAttack":
          this.mode = "タイムアタック";
          break;
        default:
      }
    }
    if (data.schoolYear) this.schoolYear = data.schoolYear;

    this.selectedSettingCategory = "size";
    this.challenge = false;
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
      .text(330, 64, "羊の中に犬が一匹", {
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
          let mode = "";
          let sizeY = 0;
          let sizeX = 0;
          switch (this.size) {
            case "少ない":
              sizeY = 3;
              sizeX = 6;
              break;
            case "多い":
              sizeY = 6;
              sizeX = 12;
              break;
            default:
              sizeY = 4;
              sizeX = 8;
          }
          switch (this.mode) {
            case "時間制限":
              mode = "timeLimit";
              break;
            case "タイムアタック":
              mode = "timeAttack";
              break;
            default:
              mode = "suddenDeath";
          }
          switch (this.challenge) {
            case "サドンデス":
              mode = "suddenDeath";
              break;
            default:
          }
          this.scene.start("hitsuji_game", {
            sizeY,
            sizeX,
            mode,
            isChallenge: Boolean(this.challenge),
            schoolYear: this.schoolYear,
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
        .text(194, 236, "漢字の数", {
          fontSize: 32,
          padding: 3,
          fontFamily: this.fontFamily,
        })
        .setData("value", "size"),

      // プレイモード
      this.add
        .text(162, 350, "ゲームモード", {
          fontSize: 32,
          padding: 3,
          fontFamily: this.fontFamily,
        })
        .setData("value", "mode"),

      // 出てくる漢字
      this.add
        .text(163, 463, "出てくる漢字", {
          fontSize: 32,
          padding: 3,
          fontFamily: this.fontFamily,
        })
        .setData("value", "schoolYear"),
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
        585,
        224,
        134,
        56,
        "少ない",
        24,
        this.fontFamily
      ).setData("category", "size"),
      new SettingButton(
        this,
        585,
        338,
        134,
        56,
        "ふつう",
        24,
        this.fontFamily
      ).setData("category", "size"),
      new SettingButton(
        this,
        585,
        451,
        134,
        56,
        "多い",
        24,
        this.fontFamily
      ).setData("category", "size"),

      new SettingButton(
        this,
        585,
        280,
        160,
        56,
        "時間制限",
        24,
        this.fontFamily
      ).setData("category", "mode"),
      new SettingButton(
        this,
        551,
        424,
        229,
        56,
        "タイムアタック",
        24,
        this.fontFamily
      ).setData("category", "mode"),
      new SettingButton(
        this,
        430,
        162,
        134,
        56,
        "1年生",
        24,
        this.fontFamily
      ).setData("category", "schoolYear"),
      new SettingButton(
        this,
        584,
        162,
        134,
        56,
        "2年生",
        24,
        this.fontFamily
      ).setData("category", "schoolYear"),
      new SettingButton(
        this,
        738,
        162,
        134,
        56,
        "3年生",
        24,
        this.fontFamily
      ).setData("category", "schoolYear"),
      new SettingButton(
        this,
        430,
        238,
        134,
        56,
        "4年生",
        24,
        this.fontFamily
      ).setData("category", "schoolYear"),
      new SettingButton(
        this,
        584,
        238,
        134,
        56,
        "5年生",
        24,
        this.fontFamily
      ).setData("category", "schoolYear"),
      new SettingButton(
        this,
        738,
        238,
        134,
        56,
        "6年生",
        24,
        this.fontFamily
      ).setData("category", "schoolYear"),
      new SettingButton(
        this,
        430,
        314,
        134,
        56,
        "低学年",
        24,
        this.fontFamily
      ).setData("category", "schoolYear"),
      new SettingButton(
        this,
        584,
        314,
        134,
        56,
        "中学年",
        24,
        this.fontFamily
      ).setData("category", "schoolYear"),
      new SettingButton(
        this,
        738,
        314,
        134,
        56,
        "高学年",
        24,
        this.fontFamily
      ).setData("category", "schoolYear"),
      new SettingButton(
        this,
        567,
        390,
        168,
        56,
        "総合問題",
        24,
        this.fontFamily
      ).setData("category", "schoolYear"),
      new SettingButton(
        this,
        430,
        466,
        192,
        56,
        "中学生範囲",
        24,
        this.fontFamily
      ).setData("category", "schoolYear"),
      new SettingButton(
        this,
        680,
        466,
        192,
        56,
        "高校生以上",
        24,
        this.fontFamily
      ).setData("category", "schoolYear"),
      new SettingButton(
        this,
        430,
        542,
        192,
        56,
        "小学＋中学",
        24,
        this.fontFamily
      ).setData("category", "schoolYear"),
      new SettingButton(
        this,
        680,
        542,
        192,
        56,
        "常用外漢字",
        24,
        this.fontFamily
      ).setData("category", "schoolYear"),
      new SettingButton(
        this,
        561,
        304,
        184,
        56,
        "サドンデス",
        24,
        this.fontFamily
      ).setData("category", "challenge"),
      this.add
        .text(
          456,
          380,
          "すべての漢字が登場！\nどんどん難易度が上がっていくぞ！",
          {
            fontSize: 24,
            fontFamily: this.fontFamily,
            align: "center",
          }
        )
        .setData("category", "challenge")
        .setLineSpacing(12),
    ];
    this.settingElements.forEach((element) => {
      if (element.constructor.name === "SettingButton") {
        element.buttonGraphic.on(
          "pointerdown",
          () => {
            if (
              element.getData("category") === "challenge" &&
              this.challenge === element.getData("value")
            )
              this.challenge = false;
            else this[element.getData("category")] = element.getData("value");
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
        if (element.getData("value") === "challenge")
          element.setStyle({ color: "#B63237" });
        else element.setStyle({ color: "#00bfff" });
      } else element.setStyle({ color: "#ffffff" });
    });

    this.settingElements.forEach((element) => {
      if (this.selectedSettingCategory === element.getData("category")) {
        element.setVisible(true);
        if (element.constructor.name === "SettingButton") {
          if (this[this.selectedSettingCategory] === element.getData("value")) {
            if (element.getData("category") === "challenge")
              element.changeChallengeButton();
            else element.changeSelected();
          } else element.changeUnselected();
        }
      } else element.setVisible(false);
    });
  }
}
