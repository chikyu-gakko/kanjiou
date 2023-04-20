import SoundButton from "../components/sound_button";
import SettingButton from "../components/setting_button";
import NakamaContainer from "./ui/NakamaContainer";

const Category = NakamaContainer.Category;
const Level = NakamaContainer.Level;

export default class NakamaGameSetting extends Phaser.Scene {
  constructor() {
    super({ key: "nakama_game_setting", active: false });
    this.prevSceneData = undefined;
    this.selectedLevel = undefined;
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
      level: data.level,
    };
    this.selectedLevel = data.level || "level1";

    this.selectedSettingCategory = "level";
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

  updateView = () => {
    this.categoryButtons.forEach((element) => {
      const data = element.getData("value");
      switch (data) {
        case this.selectedSettingCategory:
          element.setStyle({ color: "#00bfff" });
          break;
        default:
          element.setStyle({ color: "#ffffff" });
      }
    });

    this.settingElements.forEach((element) => {
      switch (element.getData("category")) {
        case this.selectedSettingCategory:
          element.setVisible(true);
          switch (element.getData("value")) {
            case this.selectedLevel:
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
  };

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
      .text(330, 64, "仲間で集まれ", {
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
          this.scene.start("nakama_game", {
            level: this.selectedLevel,
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
          this.scene.start("nakama_how_to_play");
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
        .text(194, 236, "レベル", {
          fontSize: "32px",
          fontFamily: this.fontFamily,
        })
        .setData("value", "level"),
    ];
    return categoryButtons.map((element) =>
      element.setInteractive().on(
        "pointerdown",
        () => {
          this.selectedSettingCategory = element.getData("value");
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
        Level[1].text,
        24,
        this.fontFamily
      ).setData({
        category: Category.data.Level.name,
        value: Level[1].name,
      }),
      new SettingButton(
        this,
        585,
        324,
        134,
        56,
        Level[2].text,
        24,
        this.fontFamily
      ).setData({
        category: Category.data.Level.name,
        value: Level[2].name,
      }),
      new SettingButton(
        this,
        585,
        424,
        134,
        56,
        Level[3].text,
        24,
        this.fontFamily
      ).setData({
        category: Category.data.Level.name,
        value: Level[3].name,
      }),
    ];
    return settingElements.map((element) => {
      switch (element.getData("category")) {
        case Category.data.Level.name:
          element.buttonGraphic.on(
            "pointerdown",
            () => {
              this.selectedLevel = element.getData("value");
              this.updateView();
            },
            this
          );
          break;
      }
      return element;
    });
  };
}
