import Phaser from "phaser";
import SoundButton from "../components/sound_button";
import SettingButton from "../components/setting_button";
import NakamaContainer from "./ui/NakamaContainer";

const Category = NakamaContainer.Category;

export default class NakamaGameSetting extends Phaser.Scene {
  constructor() {
    super({ key: "nakama_game_setting", active: false });
    this.prevSceneData    = undefined;
    this.selectedLevel    = undefined;
    this.selectedCategory = undefined;
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
      this.selectedCategory = element.getData("value");
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

          if (this.selectedCategory === Category.data.Level.value) {
            this.scene.start("nakama_game", {
              level: this.selectedLevel,
            });
            return;
          }
          if (this.selectedCategory === Category.data.StrokeCount.value) {
            this.scene.start("nakama_game_stroke_count", {
              level: this.selectedLevel,
            });
            return;
          }
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
        .text(254, 236, "部首(ぶしゅ)", {
          fontSize: "32px",
          fontFamily: this.fontFamily,
        })
        .setOrigin(0.5, 0)
        .setData("value", "level"),
      this.add
        .text(254, 436, "画数(かくすう)", {
          fontSize: "32px",
          fontFamily: this.fontFamily,
        })
        .setOrigin(0.5, 0)
        .setData("value", "strokeCount"),
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
    const layOutSettingButtonsCommand = (data) => {
      const COL = 5;
      
      let positionX = 0, positionY = 0;
      let currentRow = 0, currentCol = 0;
      
      return Object.keys(data.value).map((key) => {
        if (currentCol === COL) {
          currentRow++;
          currentCol = 0;
        }
        
        positionX = data.basePositionX + (currentRow * (data.marginX + data.width));
        positionY = data.basePositionY + ((currentCol + 1) * (data.marginY + data.height))

        currentCol++;

        return new SettingButton(
            this,
            positionX,
            positionY,
            data.width,
            data.height,
            data.value[key].text,
            data.fontSize,
            this.fontFamily
          ).setData({
            category: data.name,
            value: data.value[key].name,
          })
      })
    };

    const settingLevelButtons       = layOutSettingButtonsCommand(Category.data.Level);
    const settingStrokeCountButtons = layOutSettingButtonsCommand(Category.data.StrokeCount);
    
    const settingElements = settingLevelButtons.concat(settingStrokeCountButtons)
    
    return settingElements.map((settingElement) => {
      if (settingElement.getData("category") === Category.data.Level.name) {
        settingElement.buttonGraphic.on(
          "pointerdown",
          () => {
            this.selectedLevel = settingElement.getData("value");
            this.updateView();
          },
          this
        );
        return settingElement;
      }
      if (settingElement.getData("category") === Category.data.StrokeCount.name) {
        settingElement.buttonGraphic.on(
          "pointerdown",
          () => {
            this.selectedLevel = settingElement.getData("value");
            this.updateView();
          },
          this
        );
        return settingElement;
      }
    });
  };
}
