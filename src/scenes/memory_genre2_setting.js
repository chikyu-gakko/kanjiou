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
const Genre2 = MemoryContainer.Genre2;
const Category = MemoryContainer.Category;

export default class MemoryGenreSetting extends Phaser.Scene {
  constructor() {
    super({ key: "MemoryGenre2Setting", active: false });
    this.prevSceneData = undefined;
    this.settingElements = undefined;
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

    this.selectedMode = this.prevSceneData.mode;
    this.selectedGenre = this.prevSceneData.genre;

    console.log(this.selectedMode);

    // 設定の選択肢の初期値
    this.selectedSettingCategory = Category.data.Genre2.name;
    this.challenge = false;
    this.fontFamily = this.registry.get("fontFamily");
  }

  create() {
    this.startMusic();
    this.createSoundButton();
    this.createTitle();
    this.createGameMenu();
    this.createSubTitle();
    this.createGameNextButton();
    this.createGamePreveButton();
    this.createHowToPlayButton();
    this.settingElements = this.createSettingButtons();
    this.updateView();
  }

  updateView() {

    this.settingElements.forEach((element) => {
      switch (element.getData(Category.key)) {
        case this.selectedSettingCategory:
            element.setVisible(true);
          switch (element.getData(Category.value)) {
            case this.selectedGenre:
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

  createTitle = () => {
    this.add
      .text(380, 64, "神経衰弱", {
        fontSize: "65px",
        fontFamily: this.fontFamily,
      })
      .setPadding(4);
  };

  createSubTitle = () => {
    this.add
    .text(430, 150, "ジャンル２", {
      fontSize: "35px",
      fontFamily: this.fontFamily,
    })
    .setPadding(4);
  }

  createGameMenu = () => {
    const gameMenuBox = this.add.graphics();
    gameMenuBox.fillStyle(0x333333, 1).fillRect(120, 138, 787, 478);

  };

  createGameNextButton = () => {
    const gameStartSe = this.sound.add("game_start_se");
    this.add
      .graphics()
      .lineStyle(2, 0x645246)
      .fillStyle(0x32b65e, 1)
      .fillRoundedRect(680, 520, 200, 60, 30)
      .lineStyle(2, 0xFFFFFF).strokeRoundedRect(680, 520, 200, 60, 30)
      .setInteractive(
        new Phaser.Geom.Rectangle(680, 520, 200, 60),
        Phaser.Geom.Rectangle.Contains
      )
      .strokePath()
      .on(
        "pointerdown",
        () => {
           this.sound.stopAll();
           this.sound.removeByKey("top_bgm");
           this.scene.start("MemoryLevelSetting",
            {
              genre: this.selectedGenre,
              mode:this.selectedMode
            }
          );
        },
        this
      );

    this.add.text(740, 530, "次へ▶", {
      fontSize: "32px",
      color: "#ffffff",
      fontFamily: this.fontFamily,
    });
  };

  createGamePreveButton = () => {
    const gameStartSe = this.sound.add("game_start_se");
    this.add
      .graphics()
      .lineStyle(2, 0x645246)
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(150, 520, 200, 60, 30)
      .setInteractive(
        new Phaser.Geom.Rectangle(150, 510, 200, 60),
        Phaser.Geom.Rectangle.Contains
      )
      .lineStyle(3, 0x00000).strokeRoundedRect(150, 520, 200, 60, 30)
      .on(
        "pointerdown",
        () => {
           this.sound.stopAll();
           this.sound.removeByKey("top_bgm");
           this.scene.start("MemoryGenre1Setting",
            {
              mode:this.selectedMode,
            }
          );
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


  createSettingButtons = () => {
    const settingButtonArgs = [     
      {
        type: "button",
        x: 155,
        y: 225,
        width: 220,
        height: 56,
        text: Genre2.Sweets.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre2.name,
          [Category.value]: Genre2.Sweets.name,
        },
      },
      {
        type: "button",
        x: 405,
        y: 225,
        width: 220,
        height: 56,
        text: Genre2.Vegetables.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre2.name,
          [Category.value]: Genre2.Vegetables.name,
        },
      },
      {
        type: "button",
        x: 655,
        y: 225,
        width: 220,
        height: 56,
        text: Genre2.Menu.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre2.name,
          [Category.value]: Genre2.Menu.name,
        },
      }
      ,{
        type: "button",
        x: 155,
        y: 290,
        width: 220,
        height: 56,
        text: Genre2.Animal.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre2.name,
          [Category.value]: Genre2.Animal.name,
        },
      }
      ,{
        type: "button",
        x: 405,
        y: 290,
        width: 220,
        height: 56,
        text: Genre2.SeaAnimals.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre2.name,
          [Category.value]: Genre2.SeaAnimals.name,
        },
      }
      ,{
        type: "button",
        x: 655,
        y: 290,
        width: 220,
        height: 56,
        text: Genre2.Bard.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre2.name,
          [Category.value]: Genre2.Bard.name,
        },
      },
      {
        type: "button",
        x: 155,
        y: 355,
        width: 220,
        height: 56,
        text: Genre2.Fruit.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre2.name,
          [Category.value]:  Genre2.Fruit.name,
        },
      }
      ,{
        type: "button",
        x: 405,
        y: 355,
        width: 220,
        height: 56,
        text: Genre2.Plant.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre2.name,
          [Category.value]: Genre2.Plant.name,
        },
      }
      ,{
        type: "button",
        x: 655,
        y: 355,
        width: 220,
        height: 56,
        text: Genre2.Flower.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre2.name,
          [Category.value]: Genre2.Flower.name,
        },
      }
      ,{
        type: "button",
        x: 155,
        y: 420,
        width: 220,
        height: 56,
        text: Genre2.Zodiac.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre2.name,
          [Category.value]: Genre2.Zodiac.name,
        },
      },{
        type: "button",
        x: 405,
        y: 420,
        width: 220,
        height: 56,
        text: Genre2.LunarCalendar.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre2.name,
          [Category.value]: Genre2.LunarCalendar.name,
        },
      }
      ,{
        type: "button",
        x: 655,
        y: 420,
        width: 220,
        height: 56,
        text: Genre2.Constellation.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre2.name,
          [Category.value]: Genre2.Constellation.name,
        },
      }
    ];

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
            case Category.data.Genre2.name:
              settingButton.buttonGraphic.on(
                "pointerdown",
                () => {
                  this.selectedGenre = arg.data[Category.value];
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
