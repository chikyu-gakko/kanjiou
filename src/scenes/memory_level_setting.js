import Phaser from "phaser";
import SettingButton from "../components/setting_button.js";
import SoundButton from "../components/sound_button.js";
import MemoryContainer from "./ui/MemoryContainer.js";

const images = [
  ["sound", "assets/img/sound.png"],
  ["mute", "assets/img/mute.png"],
  ["mogura", "assets/img/fun_mogura1.png"],
];
const bgms = [
  ["top_bgm", "assets/audio/top.mp3"],
  ["game_start_se", "assets/audio/game_start.mp3"],
];

const Genre = MemoryContainer.Genre;
const Category = MemoryContainer.Category;
const Level = MemoryContainer.Level;

export default class MemoryLevelSetting extends Phaser.Scene {
  constructor() {
    super({
      key: "MemoryLevelSetting",
      active: false
    });
    this.prevSceneData = undefined;
    this.settingElements = undefined;
    this.selectedCategory = undefined;
    this.selectedMode = undefined;
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
      mode: data.mode,
      genre: data.genre
    };
    console.log(this.prevSceneData.mode);
    console.log(this.prevSceneData.genre);

    this.selectedLevel = Level.Level1.name;
    this.selectedGenre = this.prevSceneData.genre;
    this.selectedMode = this.prevSceneData.mode;

    // 設定の選択肢の初期値
    this.selectedSettingCategory = Category.data.Level.name;
    this.challenge = false;
    this.fontFamily = this.registry.get("fontFamily");
    this.fontFamily2 = this.registry.get("kanjiFontFamily");
  }

  create() {
    this.startMusic();
    this.createSoundButton();
    this.createTitle();
    this.createGameMenu();
    this.createSubTitle();
    this.createGamePreveButton();
    this.createGameStartButton();
    this.createHowToPlayButton();
    this.createCrossButton();
    this.settingElements = this.createSettingButtons();
    this.updateView();
  }

  updateView() {
    this.settingElements.forEach((element) => {
      switch (element.getData(Category.key)) {
        case this.selectedSettingCategory:
          element.setVisible(true);
          switch (element.getData(Category.value)) {
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
  }

  startMusic = () => {
    if (this.sound.get("top_bgm") === null) {
      this.sound.add("top_bgm");
      this.sound.play("top_bgm", {
        loop: true
      });
    }
  };

  createSoundButton = () => {
    new SoundButton(this, 70, 700, 40);
  };

  createTitle = () => {
    this.add
      .text(390, 64, "神経衰弱", {
        fontSize: "65px",
        fontFamily: this.fontFamily,
      })
      .setPadding(4);
  };

  createSubTitle = () => {
    this.add
      .text(470, 150, "レベル", {
        fontSize: "35px",
        fontFamily: this.fontFamily,
      })
      .setPadding(4);
  }

  createGameMenu = () => {
    const gameMenuBox = this.add.graphics();
    gameMenuBox.fillStyle(0x333333, 1).fillRect(120, 138, 787, 478);
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
          this.scene.start("memory_game", {
            level: this.selectedLevel,
            mode: this.prevSceneData.mode,
            genre: this.prevSceneData.genre
          });
        },
        this
      );

    this.add.text(437, 666, "ゲームスタート", {
      fontSize: "32px",
      color: "#ffffff",
      fontFamily: this.fontFamily,
    });

    this.add.text(437, 666, "", {
      fontSize: "32px",
      color: "#ffffff",
      fontFamily: this.fontFamily2,
    });

    // mogura画像
    this.add.image(410, 680, "mogura");
  };

  createGamePreveButton = () => {
    const gameStartSe = this.sound.add("game_start_se");
    this.add
      .graphics()
      .lineStyle(2, 0x645246)
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(150, 520, 200, 60, 30)
      .lineStyle(3, 0x00000).strokeRoundedRect(150, 520, 200, 60, 30)
      .setInteractive(
        new Phaser.Geom.Rectangle(150, 520, 200, 60),
        Phaser.Geom.Rectangle.Contains
      )
      .strokePath()
      .on(
        "pointerdown",
        () => {
          this.sound.stopAll();
          this.sound.removeByKey("top_bgm");
          this.scene.start("MemoryGenre1Setting", {
            genre: this.selectedGenre,
            mode: this.selectedMode,
          });
        },
        this
      );

    this.add.text(190, 530, "◀戻る", {
      fontSize: "32px",
      color: "#333333",
      fontFamily: this.fontFamily,
    });
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
          this.scene.start("memory_how_to_play");
        },
        this
      );

    this.add.text(830, 665, "遊び方", {
      fontSize: "32px",
      color: "#ffffff",
      fontFamily: this.fontFamily,
    });
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


  createSettingButtons = () => {
    let settingButtonArgs = [{
      type: "button",
      x: 415,
      y: 233,
      width: 229,
      height: 56,
      text: Level.Level1.text,
      fontSize: 24,
      data: {
        [Category.key]: Category.data.Level.name,
        [Category.value]: Level.Level1.name,
      },

    }, {
      type: "button",
      x: 415,
      y: 333,
      width: 229,
      height: 56,
      text: Level.Level2.text,
      fontSize: 24,
      data: {
        [Category.key]: Category.data.Level.name,
        [Category.value]: Level.Level2.name,
      },
    }];

    settingButtonArgs.push({
      type: "button",
      x: 415,
      y: 433,
      width: 229,
      height: 56,
      text: Level.Level3.text,
      fontSize: 24,
      data: {
        [Category.key]: Category.data.Level.name,
        [Category.value]: Level.Level3.name,
      },
    })

    return settingButtonArgs.map((arg) => {
      switch (arg.type) {
        case "button": //ボタン表示処理
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
            case Category.data.Level.name:
              settingButton.buttonGraphic.on(
                "pointerdown",
                () => {
                  this.selectedLevel = arg.data[Category.value];
                  this.updateView();
                },
                this
              );
              return settingButton;
          }
          break;
      }
    });
  };
}