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
const Mode = MemoryContainer.Mode;
const Category = MemoryContainer.Category;
const Level = MemoryContainer.Level;

export default class MemoryGameSetting extends Phaser.Scene {
  constructor() {
    super({ key: "memory_game_setting", active: false });
    this.prevSceneData = undefined;
    this.categoryButtons = undefined;
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
      size: data.size,
      mode: data.mode,
      level: data.Level,
    };
    this.selectedMode = this.prevSceneData.mode || Mode.Flag.name;
    this.selectedLevel = this.prevSceneData.mode || Level.Level1.name;

    // 設定の選択肢の初期値
    this.selectedSettingCategory = Category.data.Mode.name;
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

            case this.selectedMode:
              element.changeSelected();
              break;
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
      .text(390, 64, "神経衰弱", {
        fontSize: "60px",
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
           this.scene.start("memory_game",{level: this.selectedLevel});
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
      // .on(
      //   "pointerdown",
      //   () => {
      //     this.scene.start("sekai_how_to_play");
      //   },
      //   this
      // );

    this.add.text(830, 665, "遊び方", {
      fontSize: "32px",
      color: "#ffffff",
      fontFamily: this.fontFamily,
    });
  };

  createCategoryButtons = () => {
    const categoryButtonArgs = [
      // プレイモード
      {
        x: 162,
        y: 250,
        text: Category.data.Mode.text,
        font: {
          size: 32,
          padding: 3,
        },
        dataKey: Category.value,
        dataValue: Category.data.Mode.name,
      },
      {
        x: 178,
        y: 353,
        text: Category.data.Level.text,
        font: {
          size: 32,
          padding: 3,
        },
        dataKey: Category.value,
        dataValue: Category.data.Level.name,
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
        x: 551,
        y: 213,
        width: 229,
        height: 56,
        text: Mode.Flag.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Mode.name,
          [Category.value]: Mode.Flag.name,
        },
      },
      {
        type: "button",
        x: 551,
        y: 313,
        width: 229,
        height: 56,
        text: Mode.Color.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Mode.name,
          [Category.value]: Mode.Color.name,
        },
        
      },
      {
        type: "button",
        x: 551,
        y: 413,
        width: 229,
        height: 56,
        text: Mode.Job.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Mode.name,
          [Category.value]: Mode.Job.name,
        },
        
      },
      {
        type: "button",
        x: 551,
        y: 513,
        width: 229,
        height: 56,
        text: Mode.Prefecture.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Mode.name,
          [Category.value]: Mode.Prefecture.name,
        }
        },{
          type: "button",
          x: 551,
          y: 213,
          width: 229,
          height: 56,
          text: Level.Level1.text,
          fontSize: 24,
          data: {
            [Category.key]: Category.data.Level.name,
            [Category.value]: Level.Level1.name,
      }
    },{
      type: "button",
      x: 551,
      y: 313,
      width: 229,
      height: 56,
      text: Level.Level2.text,
      fontSize: 24,
      data: {
        [Category.key]: Category.data.Level.name,
        [Category.value]: Level.Level2.name,
  }
  },{
    type: "button",
    x: 551,
    y: 413,
    width: 229,
    height: 56,
    text: Level.Level3.text,
    fontSize: 24,
    data: {
      [Category.key]: Category.data.Level.name,
      [Category.value]: Level.Level3.name,
}
}
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
