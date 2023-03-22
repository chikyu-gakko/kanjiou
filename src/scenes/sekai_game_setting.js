import SettingButton from "../components/setting_button.js";
import SoundButton from "../components/sound_button.js";
import CharContainer from "./ui/CharContainer.js";

const images = [
  ["sound", "assets/img/sound.png"],
  ["mute", "assets/img/mute.png"],
  ["mogura", "assets/img/fun_mogura1.png"],
];
const bgms = [
  ["top_bgm", "assets/audio/top.mp3"],
  ["game_start_se", "assets/audio/game_start.mp3"],
];
const Size = CharContainer.Size;
const Mode = CharContainer.Mode;
const Country = CharContainer.Country;
const Category = CharContainer.Category;

export default class SekaiGameSetting extends Phaser.Scene {
  constructor() {
    super({ key: "sekai_game_setting", active: false });
    this.prevSceneData = undefined;
    this.categoryButtons = undefined;
    this.settingElements = undefined;
    this.selectedCategory = undefined;
    this.selectedSize = undefined;
    this.selectedMode = undefined;
    this.selectedCountry = undefined;
  }

  preload() {
    // メニュー画面に出てくる画像のロード
    this.load.path = window.location.href.replace("index.html", "");
    images.forEach((image) => {
      this.load.image(image[0], image[1]);
    });
    bgms.forEach((bgm) => {
      this.load.audio(bgm[0], bgm[1]);
    });
  }

  init(data) {
    this.prevSceneData = {
      size: data.size,
      mode: data.mode,
      country: data.country,
    };
    this.selectedSize = this.prevSceneData.size || Size.M.name;
    this.selectedMode = this.prevSceneData.mode || Mode.TimeAttack.name;
    this.selectedCountry = this.prevSceneData.country || Country.Thai.name;

    // 設定の選択肢の初期値
    this.selectedSettingCategory = Category.data.Size.name;
    this.challenge = false;
    this.fontFamily = this.registry.get("fontFamily");
  }

  create() {
    this.startMusic();
    this.createSoundButton();
    this.createCrossButton();
    this.createTitle();
    this.createGameMenu();
    this.createGameStartButton();
    this.createHowToPlayButton();
    this.categoryButtons = this.createCategoryButtons();
    this.settingElements = this.createSettingButtons();
    this.updateView();
  }

  updateView() {
    this.categoryButtons.forEach((element) => {
      switch (element.getData(Category.value)) {
        case this.selectedSettingCategory:
          element.setStyle({ color: "#00bfff" });
          break;
        case Category.Challenge:
          element.setStyle({ color: "#B63237" });
          break;
        default:
          element.setStyle({ color: "#ffffff" });
      }
    });

    this.settingElements.forEach((element) => {
      switch (element.getData(Category.key)) {
        case this.selectedSettingCategory:
          element.setVisible(true);
          switch (element.getData(Category.value)) {
            case this.selectedSize:
              element.changeSelected();
              break;
            case this.selectedMode:
              element.changeSelected();
              break;
            case this.selectedCountry:
              element.changeSelected();
              break;
            default:
              element.changeUnselected();
          }
          break;
        default:
          element.setVisible(false);
      }
    });
  }

  startMusic = () => {
    if (this.sound.get("top_bgm") === null) {
      this.sound.add("top_bgm");
      this.sound.play("top_bgm", { loop: true });
    }
  };

  createSoundButton = () => {
    new SoundButton(this, 70, 700, 40);
  };

  createCrossButton = () => {
    const crossButton = this.add.text(967, 36, "✖", {
      fontSize: "32px",
      color: "#ffffff",
    });

    crossButton.setInteractive().on(
      "pointerdown",
      () => {
        this.scene.start("game_menu");
      },
      this
    );
  };

  createTitle = () => {
    this.add
      .text(390, 64, "世界の文字", {
        fontSize: "48px",
        fontFamily: this.fontFamily,
      })
      .setPadding(4);
  };

  createGameMenu = () => {
    const gameMenuBox = this.add.graphics();
    gameMenuBox.fillStyle(0x333333, 1).fillRect(120, 138, 787, 478);

    const gameMenuLine = this.add.graphics();
    gameMenuLine.fillStyle(0x535353, 1).fillRect(396, 138, 2, 478);
  };

  createGameStartButton = () => {
    const gameStartSe = this.sound.add("game_start_se");

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
          this.scene.start("sekai_game", {
            size: this.selectedSize,
            mode: this.selectedMode,
            country: this.selectedCountry,
            isChallenge: Boolean(this.challenge),
          });
        },
        this
      );

    this.add.text(417, 666, "ゲームスタート", {
      fontSize: "32px",
      color: "#ffffff",
      fontFamily: this.fontFamily,
    });

    // mogura画像
    this.add.image(410, 680, "mogura");
  };

  createHowToPlayButton = () => {
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
      color: "#ffffff",
      fontFamily: this.fontFamily,
    });
  };

  createCategoryButtons = () => {
    const categoryButtonArgs = [
      // ゲームサイズ
      {
        x: 194,
        y: 256,
        text: Category.data.Size.text,
        font: {
          size: 32,
          padding: 3,
        },
        dataKey: Category.value,
        dataValue: Category.data.Size.name,
      },
      // プレイモード
      {
        x: 162,
        y: 350,
        text: Category.data.Mode.text,
        font: {
          size: 32,
          padding: 3,
        },
        dataKey: Category.value,
        dataValue: Category.data.Mode.name,
      },
      {
        x: 184,
        y: 463,
        text: Category.data.Country.text,
        font: {
          size: 32,
          padding: 3,
        },
        dataKey: Category.value,
        dataValue: Category.data.Country.name,
      },
    ];
    return categoryButtonArgs.map((arg) => {
      return this.add
        .text(arg.x, arg.y, arg.text, {
          fontSize: arg.font.size + "px",
          fontFamily: this.fontFamily,
          align: arg.font.align,
        })
        .setData(arg.dataKey, arg.dataValue)
        .setInteractive()
        .on(
          "pointerdown",
          () => {
            this.selectedSettingCategory = arg.dataValue;
            this.updateView();
          },
          this
        );
    });
  };

  createSettingButtons = () => {
    const settingButtonArgs = [
      {
        type: "button",
        x: 585,
        y: 224,
        width: 134,
        height: 56,
        text: Size.S.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Size.name,
          [Category.value]: Size.S.name,
        },
      },
      {
        type: "button",
        x: 585,
        y: 338,
        width: 134,
        height: 56,
        text: Size.M.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Size.name,
          [Category.value]: Size.M.name,
        },
      },
      {
        type: "button",
        x: 585,
        y: 451,
        width: 134,
        height: 56,
        text: Size.L.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Size.name,
          [Category.value]: Size.L.name,
        },
      },
      // {
      //   type: "button",
      //   x: 585,
      //   y: 250,
      //   width: 160,
      //   height: 56,
      //   text: Mode.TimeLimit.text,
      //   fontSize: 24,
      //   data: {
      //     [Category.key]: Category.data.Mode.name,
      //     [Category.value]: Mode.TimeLimit.name,
      //   },
      // },
      {
        type: "button",
        x: 551,
        y: 300,
        width: 229,
        height: 56,
        text: Mode.TimeAttack.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Mode.name,
          [Category.value]: Mode.TimeAttack.name,
        },
      },
      {
        type: "button",
        x: 551,
        y: 413,
        width: 229,
        height: 56,
        text: Mode.Learn.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Mode.name,
          [Category.value]: Mode.Learn.name,
        },
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
        text: Country.Thai.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Thai.name,
        },
      },
      {
        type: "button",
        x: 565,
        y: 200,
        width: 154,
        height: 56,
        text: Country.Bengali.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Bengali.name,
        },
      },
      {
        type: "button",
        x: 735,
        y: 200,
        width: 134,
        height: 56,
        text: Country.Lao.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Lao.name,
        },
      },
      {
        type: "button",
        x: 435,
        y: 300,
        width: 114,
        height: 56,
        text: Country.Korean.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Korean.name,
        },
      },
      // {
      //   type: "text",
      //   x: 456,
      //   y: 380,
      //   text: "すべての漢字が登場！\nどんどん難易度が上がっていくぞ！",
      //   font: {
      //     size: 24,
      //     align: "center",
      //   },
      //   dataKey: Category.key,
      //   dataValue: Category.data.Challenge.name,
      //   lineSpacing: 12,
      // },
    ];
    return settingButtonArgs.map((arg) => {
      switch (arg.type) {
        case "button":
          const settingButton = new SettingButton(
            this,
            arg.x,
            arg.y,
            arg.width,
            arg.height,
            arg.text,
            arg.fontSize,
            this.fontFamily
          ).setData(arg.data);

          switch (arg.data[Category.key]) {
            case Category.data.Size.name:
              settingButton.buttonGraphic.on(
                "pointerdown",
                () => {
                  this.selectedSize = arg.data[Category.value];
                  this.updateView();
                },
                this
              );
              return settingButton;
            case Category.data.Mode.name:
              settingButton.buttonGraphic.on(
                "pointerdown",
                () => {
                  this.selectedMode = arg.data[Category.value];
                  this.updateView();
                },
                this
              );
              return settingButton;
            case Category.data.Country.name:
              settingButton.buttonGraphic.on(
                "pointerdown",
                () => {
                  this.selectedCountry = arg.data[Category.value];
                  this.updateView();
                },
                this
              );
              return settingButton;
            case Category.data.Challenge.name:
              break;
          }
          break;
        // case "text":
        //   return this.add
        //     .text(arg.x, arg.y, arg.text, {
        //       fontSize: arg.font.size,
        //       fontFamily: this.fontFamily,
        //       align: arg.font.align,
        //     })
        //     .setData(arg.dataKey, arg.dataValue)
        //     .setLineSpacing(arg.lineSpacing);
      }
    });
  };
}
