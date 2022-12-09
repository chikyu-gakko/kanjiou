import SettingButton from "../components/setting_button.js";
import SoundButton from "../components/sound_button.js";

const Size = {
  S: {
    id: 1,
    name: "少ない",
    y: 3,
    x: 4,
  },
  M: {
    id: 2,
    name: "ふつう",
    y: 4,
    x: 8,
  },
  L: {
    id: 3,
    name: "多い",
    y: 6,
    x: 12,
  },
};
const Mode = {
  TimeLimit: {
    id: 1,
    name: "timeLimit",
    text: "時間制限",
  },
  TimeAttack: {
    id: 2,
    name: "timeAttack",
    text: "タイムアタック",
  },
  SuddenDeath: {
    id: 3,
    name: "suddenDeath",
    text: "サドンデス",
  },
  // TODO: 新しいモードを実装する
  Learn: {
    id: 4,
    name: "learn",
    text: "学習",
  },
};
const Category = {
  Size: "size",
  Mode: "mode",
  Country: "country",
  Challenge: "challenge",
};

const images = [
  ["sound", "assets/img/sound.png"],
  ["mute", "assets/img/mute.png"],
  ["mogura", "assets/img/fun_mogura1.png"],
];
const bgms = [
  ["top_bgm", "assets/audio/top.mp3"],
  ["game_start_se", "assets/audio/game_start.mp3"],
];
const settingButtonArgs = [
  {
    type: "button",
    x: 585,
    y: 224,
    width: 134,
    height: 56,
    text: "少ない",
    fontSize: 24,
    dataKey: "category",
    dataValue: Category.Size,
  },
  {
    type: "button",
    x: 585,
    y: 338,
    width: 134,
    height: 56,
    text: "ふつう",
    fontSize: 24,
    dataKey: "category",
    dataValue: Category.Size,
  },
  {
    type: "button",
    x: 585,
    y: 451,
    width: 134,
    height: 56,
    text: "多い",
    fontSize: 24,
    dataKey: "category",
    dataValue: Category.Size,
  },
  {
    type: "button",
    x: 585,
    y: 250,
    width: 160,
    height: 56,
    text: Mode.TimeLimit.text,
    fontSize: 24,
    dataKey: "category",
    dataValue: Category.Mode,
  },
  {
    type: "button",
    x: 551,
    y: 350,
    width: 229,
    height: 56,
    text: Mode.TimeAttack.text,
    fontSize: 24,
    dataKey: "category",
    dataValue: Category.Mode,
  },
  {
    type: "button",
    x: 551,
    y: 463,
    width: 229,
    height: 56,
    text: Mode.Learn.text,
    fontSize: 24,
    dataKey: "category",
    dataValue: Category.Mode,
  },
  // なぜかコード内だけにある？
  // {
  //   type: "button",
  //   x: 561,
  //   y: 304,
  //   width: 184,
  //   height: 56,
  //   text: Mode.SuddenDeath.name,
  //   fontSize: 24,
  //   dataKey: "category",
  //   dataValue: Category.Mode
  // },
  {
    type: "button",
    x: 435,
    y: 200,
    width: 114,
    height: 56,
    text: "タイ語",
    fontSize: 24,
    dataKey: "category",
    dataValue: Category.Country,
  },
  {
    type: "button",
    x: 565,
    y: 200,
    width: 154,
    height: 56,
    text: "ベンガル語",
    fontSize: 24,
    dataKey: "category",
    dataValue: Category.Country,
  },
  {
    type: "button",
    x: 735,
    y: 200,
    width: 134,
    height: 56,
    text: "ラオス語",
    fontSize: 24,
    dataKey: "category",
    dataValue: Category.Country,
  },
  {
    type: "button",
    x: 435,
    y: 300,
    width: 114,
    height: 56,
    text: "韓国語",
    fontSize: 24,
    dataKey: "category",
    dataValue: Category.Country,
  },
  {
    type: "text",
    x: 456,
    y: 380,
    text: "すべての漢字が登場！\nどんどん難易度が上がっていくぞ！",
    font: {
      size: 24,
      align: "center",
    },
    dataKey: "category",
    dataValue: Category.Challenge,
    lineSpacing: 12,
  },
];
const categoryButtonArgs = [
  // ゲームサイズ
  {
    x: 194,
    y: 256,
    text: "文字の数",
    font: {
      size: 32,
      padding: 3,
    },
    dataKey: "value",
    dataValue: "size",
  },
  // プレイモード
  {
    x: 162,
    y: 350,
    text: "ゲームモード",
    font: {
      size: 32,
      padding: 3,
    },
    dataKey: "value",
    dataValue: "mode",
  },
  {
    x: 162,
    y: 463,
    text: "どこの国？",
    font: {
      size: 32,
      padding: 3,
    },
    dataKey: "value",
    dataValue: "country",
  },
];

export default class SekainomojiGameSetting extends Phaser.Scene {
  constructor() {
    super({ key: "sekainomoji_game_setting", active: false });
  }

  preload() {
    // メニュー画面に出てくる画像のロード
    this.load.path = window.location.href.replace("index.html", "");
    images.forEach((image) => {
      this.load.image(...image);
    });
    bgms.forEach((bgm) => {
      this.load.audio(...bgm);
    });
  }

  init(data) {
    this.size = Size.M.name;
    this.mode = Mode.TimeLimit.text;
    this.country = "タイ語";

    if (data.sizeY) {
      switch (data.sizeY) {
        case Size.S.y:
          this.size = Size.S.name;
          break;
        case Size.L.y:
          this.size = Size.L.name;
          break;
        default:
      }
    }
    if (data.mode) {
      switch (data.mode) {
        case Mode.TimeAttack.name:
          this.mode = Mode.TimeAttack.text;
          break;
        case Mode.TimeLimit.name:
          this.mode = Mode.TimeLimit.text;
          break;
        case Mode.Learn.name:
          this.mode = Mode.Learn.text;
          break;
        default:
          this.mode = Mode.SuddenDeath.text;
      }
    }

    // 設定の選択肢の初期値
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
      .text(390, 64, "世界の文字", {
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
            case Size.S.name:
              sizeY = Size.S.y;
              sizeX = Size.S.x;
              break;
            case Size.L.name:
              sizeY = Size.L.y;
              sizeX = Size.L.x;
              break;
            default:
              sizeY = Size.M.y;
              sizeX = Size.M.x;
          }
          switch (this.mode) {
            case Mode.TimeLimit.text:
              mode = Mode.TimeLimit.name;
              break;
            case Mode.TimeAttack.text:
              mode = Mode.TimeAttack.name;
              break;
            case Mode.Learn.text:
              mode = Mode.Learn.name;
              break;
            default:
              mode = Mode.SuddenDeath.name;
          }
          switch (this.challenge) {
            case Mode.SuddenDeath.name:
              mode = "suddenDeath";
              break;
            default:
          }
          this.scene.start("sekai_game", {
            sizeY,
            sizeX,
            mode,
            isChallenge: Boolean(this.challenge),
            country: this.country,
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
          // TODO: このゲームの遊び方を追加しておく
          this.scene.start("how_to_play");
        },
        this
      );

    this.add.text(830, 665, "遊び方", {
      fontSize: "32px",
      fill: "#ffffff",
      fontFamily: this.fontFamily,
    });

    this.categoryButtons = categoryButtonArgs.map((arg) => {
      return this.add
        .text(arg.x, arg.y, arg.text, {
          fontSize: arg.font.size,
          fontFamily: this.fontFamily,
          align: arg.font.align,
        })
        .setData(arg.dataKey, arg.dataValue);
    });
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

    this.settingElements = settingButtonArgs.map((arg) => {
      switch (arg.type) {
        case "button":
          return new SettingButton(
            this,
            arg.x,
            arg.y,
            arg.width,
            arg.height,
            arg.text,
            arg.fontSize,
            this.fontFamily
          ).setData(arg.dataKey, arg.dataValue);
        case "text":
          return this.add
            .text(arg.x, arg.y, arg.text, {
              fontSize: arg.font.size,
              fontFamily: this.fontFamily,
              align: arg.font.align,
            })
            .setData(arg.dataKey, arg.dataValue)
            .setLineSpacing(arg.lineSpacing);
      }
    });
    this.settingElements.forEach((element) => {
      if (element.constructor.name === "SettingButton") {
        element.buttonGraphic.on(
          "pointerdown",
          () => {
            if (
              element.getData("category") === Category.Challenge &&
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
        if (element.getData("value") === Category.Challenge)
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
