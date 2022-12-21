import SettingButton from "../components/setting_button.js";
import SoundButton from "../components/sound_button.js";
import KanjiContainer from "./ui/KanjiContainer.js";

const Category = KanjiContainer.Category;
const Size = KanjiContainer.Size;
const Mode = KanjiContainer.Mode;
const SchoolYear = KanjiContainer.SchoolYear;

export default class GameSetting extends Phaser.Scene {
  constructor() {
    super({ key: "game_setting", active: false });
    this.prevSceneData = undefined;
    this.categoryButtons = undefined;
    this.settingButtons = undefined;
    this.selectedSettingCategory = undefined;
    this.selectedSize = undefined;
    this.selectedMode = undefined;
    this.selectedSchoolYear = undefined;
  }

  preload() {
    // メニュー画面に出てくる画像のロード
    this.load.path = window.location.href.replace("index.html", "");

    this.load.image("sound", "assets/img/sound.png");
    this.load.image("mute", "assets/img/mute.png");
    this.load.image("mogura", "assets/img/fun_mogura1.png");

    // bgm
    this.load.audio("top_bgm", "assets/audio/top.mp3");
    this.load.audio("game_start_se", "assets/audio/game_start.mp3");
  }

  init(data) {
    this.prevSceneData = {
      size: data.size,
      mode: data.mode,
      schoolYear: data.schoolYear,
    };
    this.selectedSize = this.prevSceneData.size || Size.M.name;
    this.selectedMode = this.prevSceneData.mode || Mode.TimeLimit.name;
    this.selectedSchoolYear =
      this.prevSceneData.schoolYear || SchoolYear.Grade1.name;

    this.selectedSettingCategory = Category.data.Size.name;
    this.challenge = false;
    this.fontFamily = this.registry.get("fontFamily");
  }

  create() {
    this.startMusic();
    this.createSoundButton();
    this.createCrossButton();
    this.createGameTitle();
    this.createGameMenu();
    this.createGameStartButton();
    this.createHowToPlayButton();
    this.categoryButtons = this.createCategoryButtons();
    this.settingButtons = this.createSettingButtons();
    this.updateView();
  }

  updateView() {
    this.categoryButtons.forEach((element) => {
      const data = element.getData(Category.value);
      switch (data) {
        case this.selectedSettingCategory:
          if (data === Category.data.Challenge.name) {
            element.setStyle({ color: "#B63237" });
            break;
          }
          element.setStyle({ color: "#00bfff" });
          break;
        default:
          element.setStyle({ color: "#ffffff" });
      }
    });

    this.settingButtons.forEach((element) => {
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
            case this.selectedSchoolYear:
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
      color: "#ffffff",
      fontSize: "32px",
    });
    crossButton.setInteractive().on(
      "pointerdown",
      () => {
        this.scene.start("game_menu");
      },
      this
    );
  };

  createGameTitle = () => {
    this.add
      .text(330, 64, "羊の中に犬が一匹", {
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
          this.scene.start("hitsuji_game", {
            size: this.selectedSize,
            mode: this.selectedMode,
            schoolYear: this.selectedSchoolYear,
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
      color: "#ffffff",
      fontFamily: this.fontFamily,
    });
  };

  createCategoryButtons = () => {
    const categoryButtons = [
      // ゲームサイズ
      this.add
        .text(194, 236, "漢字の数", {
          fontSize: "32px",
          fontFamily: this.fontFamily,
        })
        .setData(Category.value, "size"),

      // プレイモード
      this.add
        .text(162, 350, "ゲームモード", {
          fontSize: "32px",
          fontFamily: this.fontFamily,
        })
        .setData(Category.value, "mode"),

      // 出てくる漢字
      this.add
        .text(163, 463, "出てくる漢字", {
          fontSize: "32px",
          fontFamily: this.fontFamily,
        })
        .setData(Category.value, "schoolYear"),
    ];
    return categoryButtons.map((element) =>
      element.setInteractive().on(
        "pointerdown",
        () => {
          this.selectedSettingCategory = element.getData(Category.value);
          this.updateView();
        },
        this
      )
    );
  };

  createSettingButtons = () => {
    const settingButtonArgs = [
      {
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
      {
        x: 585,
        y: 280,
        width: 160,
        height: 56,
        text: Mode.TimeLimit.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Mode.name,
          [Category.value]: Mode.TimeLimit.name,
        },
      },
      {
        x: 551,
        y: 424,
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
        x: 430,
        y: 162,
        width: 134,
        height: 56,
        text: SchoolYear.Grade1.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.SchoolYear.name,
          [Category.value]: SchoolYear.Grade1.name,
        },
      },
      {
        x: 584,
        y: 162,
        width: 134,
        height: 56,
        text: SchoolYear.Grade2.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.SchoolYear.name,
          [Category.value]: SchoolYear.Grade2.name,
        },
      },
      {
        x: 738,
        y: 162,
        width: 134,
        height: 56,
        text: SchoolYear.Grade3.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.SchoolYear.name,
          [Category.value]: SchoolYear.Grade3.name,
        },
      },
      {
        x: 430,
        y: 238,
        width: 134,
        height: 56,
        text: SchoolYear.Grade4.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.SchoolYear.name,
          [Category.value]: SchoolYear.Grade4.name,
        },
      },
      {
        x: 584,
        y: 238,
        width: 134,
        height: 56,
        text: SchoolYear.Grade5.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.SchoolYear.name,
          [Category.value]: SchoolYear.Grade5.name,
        },
      },
      {
        x: 738,
        y: 238,
        width: 134,
        height: 56,
        text: SchoolYear.Grade6.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.SchoolYear.name,
          [Category.value]: SchoolYear.Grade6.name,
        },
      },
      {
        x: 430,
        y: 314,
        width: 134,
        height: 56,
        text: SchoolYear.Underclassmen.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.SchoolYear.name,
          [Category.value]: SchoolYear.Underclassmen.name,
        },
      },
      {
        x: 584,
        y: 314,
        width: 134,
        height: 56,
        text: SchoolYear.Middle.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.SchoolYear.name,
          [Category.value]: SchoolYear.Middle.name,
        },
      },
      {
        x: 738,
        y: 314,
        width: 134,
        height: 56,
        text: SchoolYear.Upperclassmen.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.SchoolYear.name,
          [Category.value]: SchoolYear.Upperclassmen.name,
        },
      },
      {
        x: 567,
        y: 390,
        width: 168,
        height: 56,
        text: SchoolYear.Comprehensive.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.SchoolYear.name,
          [Category.value]: SchoolYear.Comprehensive.name,
        },
      },
      {
        x: 430,
        y: 466,
        width: 192,
        height: 56,
        text: SchoolYear.MiddleRange.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.SchoolYear.name,
          [Category.value]: SchoolYear.MiddleRange.name,
        },
      },
      {
        x: 680,
        y: 466,
        width: 192,
        height: 56,
        text: SchoolYear.High.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.SchoolYear.name,
          [Category.value]: SchoolYear.High.name,
        },
      },
      {
        x: 430,
        y: 542,
        width: 192,
        height: 56,
        text: SchoolYear.ElementalyAndMiddle.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.SchoolYear.name,
          [Category.value]: SchoolYear.ElementalyAndMiddle.name,
        },
      },
      {
        x: 680,
        y: 542,
        width: 192,
        height: 56,
        text: SchoolYear.Uncommon.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.SchoolYear.name,
          [Category.value]: SchoolYear.Uncommon.name,
        },
      },
      // new SettingButton(
      //   this,
      //   561,
      //   304,
      //   184,
      //   56,
      //   Mode.SuddenDeath.text,
      //   24,
      //   this.fontFamily
      // ).setData({
      //   [Category.key]: Category.data.Mode.name,
      //   [Category.value]: Mode.SuddenDeath.name,
      // }),
      // this.add
      //   .text(
      //     456,
      //     380,
      //     "すべての漢字が登場！\nどんどん難易度が上がっていくぞ！",
      //     {
      //       fontSize: 24,
      //       fontFamily: this.fontFamily,
      //       align: "center",
      //     }
      //   )
      //   .setData({ [Category.key]: Category.data.Challenge.name })
      //   .setLineSpacing(12),
    ];
    return settingButtonArgs.map((arg) => {
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
        case Category.data.SchoolYear.name:
          settingButton.buttonGraphic.on(
            "pointerdown",
            () => {
              this.selectedSchoolYear = arg.data[Category.value];
              this.updateView();
            },
            this
          );
          return settingButton;
        case Category.data.Challenge.name:
          break;
      }
    });
  };
}
