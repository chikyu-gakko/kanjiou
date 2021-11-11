import SettingButton from "./setting_button.js";

export default class GameSetting extends Phaser.Scene {
  constructor() {
    super({ key: "game_setting", active: false });
  }

  preload() {
    // メニュー画面に出てくる画像のロード
    this.load.path = window.location.href.replace("index.html", "");

    this.load.image("sound", "img/sound.png");
    this.load.image("mogura", "img/fun_mogura1.png");

    // bgm
    this.load.audio("top_bgm", "audio/top.mp3");
    this.load.audio("game_start_se", "audio/game_start.mp3");
  }

  init() {
    this.size = "ふつう";
    this.mode = "時間制限";
    this.schoolYear = "1年生";
    this.selectedSettingCategory = "size";
    this.categoryButtons = [];
    this.settingButtons = [];
  }

  create() {
    // 音楽・音声アイコン枠描画
    const soundCircle = this.add.graphics();
    soundCircle.fillStyle(0x333333, 1).fillCircle(70, 700, 40);

    // 音声アイコン
    let soundStatus = 1;
    const soundIcon = this.add.sprite(70, 700, "sound");
    soundIcon.setInteractive().depth = 1;

    // 音楽
    const gameBgm = this.sound.add("top_bgm");
    gameBgm.allowMultiple = false;
    gameBgm.play();

    soundIcon.on(
      "pointerdown",
      () => {
        if (soundStatus === 0) {
          gameBgm.play();
          soundStatus = 1;
        } else if (soundStatus === 1) {
          gameBgm.stop();
          soundStatus = 0;
        }
      },
      this
    );

    // --- ボタン---

    // --- ✖ボタン・イベント ---
    const crossButton = this.add.text(967, 36, "✖", {
      fontSize: "32px",
      fill: "#ffffff",
    });

    crossButton.setInteractive().on(
      "pointerdown",
      () => {
        gameBgm.stop();
        this.scene.start("game_menu");
      },
      this
    ).depth = 1;

    // タイトル
    this.add
      .text(330, 64, "羊の中に犬が一匹", {
        fontSize: 48,
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
      .lineStyle(5, 0x645246)
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
          gameBgm.stop();
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
          this.scene.start("hitsuji_game", {
            sizeY,
            sizeX,
            mode,
            schoolYear: this.schoolYear,
          });
        },
        this
      );

    this.add
      .text(417, 666, "ゲームスタート", {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      

    // mogura画像
    this.add.image(410, 680, "mogura");
    // mogura1.depth = 3;

    // 遊び方ボタン
    this.add
      .graphics()
      .lineStyle(1.5, 0xffffff)
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
          gameBgm.stop();
          this.scene.start("how_to_play");
        },
        this
      );

    this.add
      .text(830, 665, "遊び方", {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "Arial",
      })

      

    this.categoryButtons = [
      // ゲームサイズ
      this.add
        .text(210, 236, "漢字の数", {
          fontSize: 32,
          padding: 3,
          fontFamily: "Arial",
        })
        .setData("value", "size"),

      // プレイモード
      this.add
        .text(162, 350, "ゲームモード", {
          fontSize: 32,
          padding: 3,
          fontFamily: "Arial",
        })
        .setData("value", "mode"),

      // 出てくる漢字
      this.add
        .text(163, 463, "出てくる漢字", {
          fontSize: 32,
          padding: 3,
          fontFamily: "Arial",
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

    this.settingButtons = [
      new SettingButton(this, 585, 224, 134, 56, "少ない", 24).setData(
        "category",
        "size"
      ),
      new SettingButton(this, 585, 338, 134, 56, "ふつう", 24).setData(
        "category",
        "size"
      ),
      new SettingButton(this, 585, 451, 134, 56, "多い", 24).setData(
        "category",
        "size"
      ),

      new SettingButton(this, 585, 224, 160, 56, "時間制限", 24).setData(
        "category",
        "mode"
      ),
      new SettingButton(this, 551, 338, 229, 56, "タイムアタック", 24).setData(
        "category",
        "mode"
      ),
      new SettingButton(this, 573, 452, 184, 56, "サドンデス", 24).setData(
        "category",
        "mode"
      ),

      new SettingButton(this, 430, 162, 134, 56, "1年生", 24).setData(
        "category",
        "schoolYear"
      ),
      new SettingButton(this, 584, 162, 134, 56, "2年生", 24).setData(
        "category",
        "schoolYear"
      ),
      new SettingButton(this, 738, 162, 134, 56, "3年生", 24).setData(
        "category",
        "schoolYear"
      ),
      new SettingButton(this, 430, 238, 134, 56, "4年生", 24).setData(
        "category",
        "schoolYear"
      ),
      new SettingButton(this, 584, 238, 134, 56, "5年生", 24).setData(
        "category",
        "schoolYear"
      ),
      new SettingButton(this, 738, 238, 134, 56, "6年生", 24).setData(
        "category",
        "schoolYear"
      ),
      new SettingButton(this, 430, 314, 134, 56, "低学年", 24).setData(
        "category",
        "schoolYear"
      ),
      new SettingButton(this, 584, 314, 134, 56, "中学年", 24).setData(
        "category",
        "schoolYear"
      ),
      new SettingButton(this, 738, 314, 134, 56, "高学年", 24).setData(
        "category",
        "schoolYear"
      ),
      new SettingButton(this, 567, 390, 168, 56, "総合問題", 24).setData(
        "category",
        "schoolYear"
      ),
      new SettingButton(this, 430, 466, 192, 56, "中学生範囲", 24).setData(
        "category",
        "schoolYear"
      ),
      new SettingButton(this, 680, 466, 192, 56, "常用＋常外", 24).setData(
        "category",
        "schoolYear"
      ),
      new SettingButton(this, 430, 542, 192, 56, "小学＋中学", 24).setData(
        "category",
        "schoolYear"
      ),
      new SettingButton(this, 704, 542, 168, 56, "常外のみ", 24).setData(
        "category",
        "schoolYear"
      ),
    ];
    this.settingButtons.forEach((element) => {
      element.buttonGraphic.on(
        "pointerdown",
        () => {
          this[element.getData("category")] = element.getData("value");
          this.updateView();
        },
        this
      );
    });
    this.updateView();
  }

  updateView() {
    this.categoryButtons.forEach((element) => {
      if (this.selectedSettingCategory === element.getData("value"))
        element.setStyle({ color: "#00bfff" });
      else element.setStyle({ color: "#ffffff" });
    });

    this.settingButtons.forEach((element) => {
      if (this.selectedSettingCategory === element.getData("category")) {
        element.setVisible(true);
        if (this[this.selectedSettingCategory] === element.getData("value"))
          element.changeSelected();
        else element.changeUnselected();
      } else element.setVisible(false);
    });
  }
}
