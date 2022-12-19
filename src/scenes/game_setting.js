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
    this.settingElements = undefined;
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
    this.settingElements = this.createSettingButtons();
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
  };

  createGameTitle = () => {
    this.add
      .text(330, 64, "羊の中に犬が一匹", {
        fontSize: 48,
        fontFamily: this.fontFamily,
        padding: 3,
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
      fill: "#ffffff",
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
      fill: "#ffffff",
      fontFamily: this.fontFamily,
    });
  };

  createCategoryButtons = () => {
    const categoryButtons = [
      // ゲームサイズ
      this.add
        .text(194, 236, "漢字の数", {
          fontSize: 32,
          padding: 3,
          fontFamily: this.fontFamily,
        })
        .setData(Category.value, "size"),

      // プレイモード
      this.add
        .text(162, 350, "ゲームモード", {
          fontSize: 32,
          padding: 3,
          fontFamily: this.fontFamily,
        })
        .setData(Category.value, "mode"),

      // 出てくる漢字
      this.add
        .text(163, 463, "出てくる漢字", {
          fontSize: 32,
          padding: 3,
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
    const settingElements = [
      new SettingButton(
        this,
        585,
        224,
        134,
        56,
        Size.S.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.Size.name,
        [Category.value]: Size.S.name,
      }),
      new SettingButton(
        this,
        585,
        338,
        134,
        56,
        Size.M.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.Size.name,
        [Category.value]: Size.M.name,
      }),
      new SettingButton(
        this,
        585,
        451,
        134,
        56,
        Size.L.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.Size.name,
        [Category.value]: Size.L.name,
      }),

      new SettingButton(
        this,
        585,
        280,
        160,
        56,
        Mode.TimeLimit.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.Mode.name,
        [Category.value]: Mode.TimeLimit.name,
      }),
      new SettingButton(
        this,
        551,
        424,
        229,
        56,
        Mode.TimeAttack.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.Mode.name,
        [Category.value]: Mode.TimeAttack.name,
      }),
      new SettingButton(
        this,
        430,
        162,
        134,
        56,
        SchoolYear.Grade1.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.SchoolYear.name,
        [Category.value]: SchoolYear.Grade1.name,
      }),
      new SettingButton(
        this,
        584,
        162,
        134,
        56,
        SchoolYear.Grade2.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.SchoolYear.name,
        [Category.value]: SchoolYear.Grade2.name,
      }),
      new SettingButton(
        this,
        738,
        162,
        134,
        56,
        SchoolYear.Grade3.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.SchoolYear.name,
        [Category.value]: SchoolYear.Grade3.name,
      }),
      new SettingButton(
        this,
        430,
        238,
        134,
        56,
        SchoolYear.Grade4.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.SchoolYear.name,
        [Category.value]: SchoolYear.Grade4.name,
      }),
      new SettingButton(
        this,
        584,
        238,
        134,
        56,
        SchoolYear.Grade5.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.SchoolYear.name,
        [Category.value]: SchoolYear.Grade5.name,
      }),
      new SettingButton(
        this,
        738,
        238,
        134,
        56,
        SchoolYear.Grade6.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.SchoolYear.name,
        [Category.value]: SchoolYear.Grade6.name,
      }),
      new SettingButton(
        this,
        430,
        314,
        134,
        56,
        SchoolYear.Underclassmen.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.SchoolYear.name,
        [Category.value]: SchoolYear.Underclassmen.name,
      }),
      new SettingButton(
        this,
        584,
        314,
        134,
        56,
        SchoolYear.Middle.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.SchoolYear.name,
        [Category.value]: SchoolYear.Middle.name,
      }),
      new SettingButton(
        this,
        738,
        314,
        134,
        56,
        SchoolYear.Upperclassmen.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.SchoolYear.name,
        [Category.value]: SchoolYear.Upperclassmen.name,
      }),
      new SettingButton(
        this,
        567,
        390,
        168,
        56,
        SchoolYear.Comprehensive.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.SchoolYear.name,
        [Category.value]: SchoolYear.Comprehensive.name,
      }),
      new SettingButton(
        this,
        430,
        466,
        192,
        56,
        SchoolYear.MiddleRange.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.SchoolYear.name,
        [Category.value]: SchoolYear.MiddleRange.name,
      }),
      new SettingButton(
        this,
        680,
        466,
        192,
        56,
        SchoolYear.High.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.SchoolYear.name,
        [Category.value]: SchoolYear.High.name,
      }),
      new SettingButton(
        this,
        430,
        542,
        192,
        56,
        SchoolYear.ElementalyAndMiddle.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.SchoolYear.name,
        [Category.value]: SchoolYear.ElementalyAndMiddle.name,
      }),
      new SettingButton(
        this,
        680,
        542,
        192,
        56,
        SchoolYear.Uncommon.text,
        24,
        this.fontFamily
      ).setData({
        [Category.key]: Category.data.SchoolYear.name,
        [Category.value]: SchoolYear.Uncommon.name,
      }),
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
        .setData({ [Category.key]: Category.data.Challenge.name })
        .setLineSpacing(12),
    ];
    return settingElements.map((element) => {
      if (element.constructor.name === "SettingButton") {
        switch (element.getData(Category.key)) {
          case Category.data.Size.name:
            element.buttonGraphic.on(
              "pointerdown",
              () => {
                this.selectedSize = element.getData(Category.value);
                this.updateView();
              },
              this
            );
            break;
          case Category.data.Mode.name:
            element.buttonGraphic.on(
              "pointerdown",
              () => {
                this.selectedMode = element.getData(Category.value);
                this.updateView();
              },
              this
            );
            break;
          case Category.data.SchoolYear.name:
            element.buttonGraphic.on(
              "pointerdown",
              () => {
                this.selectedSchoolYear = element.getData(Category.value);
                this.updateView();
              },
              this
            );
            break;
          case Category.data.Challenge.name:
            break;
        }
      }
      return element;
    });
  };
}
