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

export default class MemoryGenreSetting extends Phaser.Scene {
  constructor() {
    super({ key: "MemoryGenre1Setting", active: false });
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
    this.selectedGenre = Genre.Flag.name || this.prevSceneData.genre;

    console.log(this.selectedMode);

    // 設定の選択肢の初期値
    this.selectedSettingCategory = Category.data.Genre.name;
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
    .text(430, 150, "ジャンル１", {
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
          //  this.scene.start("MemoryLevelSetting",
          //   {
          //     genre: this.selectedGenre,
          //     mode:this.selectedMode
          //   }
          this.scene.start("MemoryGenre2Setting",
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
           this.scene.start("MemoryModeSetting",
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
        text: Genre.Flag.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre.name,
          [Category.value]: Genre.Flag.name,
        },
      },
      {
        type: "button",
        x: 405,
        y: 225,
        width: 220,
        height: 56,
        text: Genre.Prefecture.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre.name,
          [Category.value]: Genre.Prefecture.name,
        },
      },{
        type: "button",
        x: 655,
        y: 225,
        width: 220,
        height: 56,
        text: Genre.PrefecturalCapital.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre.name,
          [Category.value]: Genre.PrefecturalCapital.name,
        },
      }
      ,{
        type: "button",
        x: 155,
        y: 290,
        width: 220,
        height: 56,
        text: Genre.MapSymbol.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre.name,
          [Category.value]: Genre.MapSymbol.name,
        },
      }
      ,{
        type: "button",
        x: 405,
        y: 290,
        width: 220,
        height: 56,
        text: Genre.Job.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre.name,
          [Category.value]: Genre.Job.name,
        },
      }
      ,{
        type: "button",
        x: 655,
        y: 290,
        width: 220,
        height: 56,
        text: Genre.Subject.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre.name,
          [Category.value]: Genre.Subject.name,
        },
      },{
        type: "button",
        x: 155,
        y: 355,
        width: 220,
        height: 56,
        text: Genre.Color.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre.name,
          [Category.value]: Genre.Color.name,
        },
      }
      ,{
        type: "button",
        x: 405,
        y: 355,
        width: 220,
        height: 56,
        text: Genre.Vehicle.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre.name,
          [Category.value]: Genre.Vehicle.name,
        },
      }
      ,{
        type: "button",
        x: 655,
        y: 355,
        width: 220,
        height: 56,
        text: Genre.MusicalInstrument.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre.name,
          [Category.value]: Genre.MusicalInstrument.name,
        },
      }
      ,{
        type: "button",
        x: 155,
        y: 420,
        width: 220,
        height: 56,
        text: Genre.date.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre.name,
          [Category.value]: Genre.date.name,
        },
      },{
        type: "button",
        x: 405,
        y: 420,
        width: 220,
        height: 56,
        text: Genre.CountPeople.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre.name,
          [Category.value]: Genre.CountPeople.name,
        },
      }
      ,{
        type: "button",
        x: 655,
        y: 420,
        width: 220,
        height: 56,
        text: Genre.CountThings.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Genre.name,
          [Category.value]: Genre.CountThings.name,
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
            case Category.data.Genre.name:
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
