import Phaser from "phaser";
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
    this.countryPage = 0;
    this.countryButtonPages = [
      //国の選択ボタンはあまりにも多すぎるのでページごとに分ける。新たに言語を追加する場合は全ページいっぱいいっぱいなので新しく配列追加してそこに収容すること
      [
        Country.JapaneseHiragana.name,
        Country.JapaneseKatakana.name,
        Country.Chinese.name,
        Country.ChineseTaiwan.name,
        Country.Korean.name,
        Country.English.name,
        Country.Arabic.name,
        Country.Italian.name,
        Country.Indonesian.name,
      ],
      [
        Country.Urdu.name,
        Country.Greek.name,
        Country.Khmer.name,
        Country.Sinhala.name,
        Country.Svenska.name,
        Country.Kiswahili.name,
        Country.Dzongkha.name,
        Country.Thai.name,
        Country.Tagalog.name,
      ],
      [
        Country.Tamil.name,
        Country.Dari.name,
        Country.German.name,
        Country.Turkish.name,
        Country.Nepali.name,
        Country.Pasto.name,
        Country.Hindi.name,
        Country.VirginPortuguese.name,
        Country.French.name,
        Country.Vietnamese.name,
      ],
      [
        Country.PeruSpanish.name,
        Country.Persian.name,
        Country.Bengali.name,
        Country.Malayalam.name,
        Country.Malay.name,
        Country.Burmese.name,
        Country.Yoruba.name,
        Country.Lao.name,
        Country.Latvie.name,
        Country.Russian.name,
      ],
    ];
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
    this.selectedCountry =
      this.prevSceneData.country || Country.JapaneseHiragana.name;

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
          this.createCountryNextButton();
          this.createCountryPrevButton();
          if (this.selectedSettingCategory === "country") {
            console.log("countryPage is...?" + this.countryPage);
            if (
              this.countryButtonPages[this.countryPage].includes(
                element.data.list["value"]
              )
            ) {
              element.setVisible(true);
            } else {
              element.setVisible(false);
            }
          } else {
            element.setVisible(true);
          }
          //console.log(element.data.list['value']);
          switch (element.getData(Category.value)) {
            case this.selectedSize:
              element.changeSelected();
              break;
            case this.selectedMode:
              element.changeSelected();
              break;
            case this.selectedCountry:
              console.log("country selected");
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

  createCountryPageChangeButton = () => {
    if (this.selectedSettingCategory === "country") {
    }
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
    gameMenuBox.fillStyle(0x333333, 1).fillRect(120, 138, 396, 478);

    const gameMenuLine = this.add.graphics();
    gameMenuLine.fillStyle(0x535353, 1).fillRect(396, 138, 2, 478);

    const gameMenuBoxRight = this.add.graphics();
    gameMenuBoxRight.fillStyle(0x333333, 1).fillRect(398, 138, 512, 478);
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
          this.scene.start("sekai_how_to_play");
        },
        this
      );

    this.add.text(830, 665, "遊び方", {
      fontSize: "32px",
      color: "#ffffff",
      fontFamily: this.fontFamily,
    });
  };

  createCountryNextButton = () => {
    const color =
      this.selectedSettingCategory === "country" &&
      this.countryPage != this.countryButtonPages.length - 1
        ? "#FFFFFF"
        : "#808080"
    const countryNextButton = this.add.text(810, 560, "▶▶", {
      color: color,
      fontSize: "32px",
      fontFamily: this.fontFamily,
    },);
    countryNextButton.setInteractive().on("pointerdown", () => {
      if (
        this.selectedSettingCategory === "country" &&
        this.countryPage != this.countryButtonPages.length - 1
      ) {
        console.log("next pressed");
        this.countryPage++;
        this.updateView();
      }
    });
    /*
    countryNextButton.on("pointerdown", () => {
      if(this.countryPage != this.countryButtonPages.length - 1) {
        console.log("next pressed");
        this.countryPage++;
        this.updateView();
      }
    });
    */
    //return countryNextButton;
    /*
    const countryNextButton = new TogglableTextButtonLabel(this, 740, 600, "▶▶", {
      color: "#FFFFFF",
      fontSize: "32px",
      fontFamily: this.fontFamily,
    });
    countryNextButton.setInteractive().on("pointerdown", () => {
      console.log("next pressed");
      this.countryPage++;
      this.updateView();
    });
    return countryNextButton;
    */
  };

  createCountryPrevButton = () => {
    const color =
      this.selectedSettingCategory === "country" && this.countryPage != 0
        ? "#FFFFFF"
        : "#808080"
    const countryPrevButton = this.add.text(435, 560, "◀◀", {
      color: color,
      fontSize: "32px",
      fontFamily: this.fontFamily,
    });
    countryPrevButton.setInteractive().on("pointerdown", () => {
      if (this.selectedSettingCategory === "country" && this.countryPage != 0) {
        console.log("prev pressed");
        this.countryPage--;
        this.updateView();
      }
    });
    /*
    countryPrevButton.on("pointerdown", () => {
      if(this.countryPage != 0) {
        console.log("prev pressed");
        this.countryPage--;
        this.updateView();
      }
    });
    */
    //return countryPrevButton;
    /*
    const countryPrevButton = new TogglableTextButtonLabel(this, 435, 600, "◀◀", {
      color: "#FFFFFF",
      fontSize: "32px",
      fontFamily: this.fontFamily,
    });
    countryPrevButton.setInteractive().on("pointerdown", () => {
      this.countryPage--;
      this.updateView();
    });
    return countryPrevButton;
    */
  };

  createCategoryButtons = () => {
    const categoryButtonArgs = [
      // ゲームサイズ
      {
        x: 209,
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
        x: 224,
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
            console.log(arg.dataValue + "selectedだとっっ!!??");
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
        width: 140,
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
        width: 140,
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
        width: 140,
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
      //国はここからだぜええええええええええええええええええええええええええええええええええええええええええええええええええええええええ！！！！！！！！！
      /*
      JapaneseHiragana
      JapaneseKatakana
      Chinese
      ChineseTaiwan
      Korean
      English
      Arabic
      Italian
      Indonesian
      ーーーーーーーーーーーー区切りーーーーーーーーーーーーー
      Urdu
      Greek
      Khmer
      Sinhala
      Svenska
      Kiswahili
      Dzongkha
      Thai
      Tagalog
      Tamil
      Dari
      German
      Turkish
      Nepali
      Pasto
      Hindi
      VirginPortuguese
      French
      Vietnamese
      PeruSpanish
      Persian
      Bengali
      Malayalam
      Malay
      Burmese
      Yoruba
      Lao
      Latvie
      Russian
      */
      //1ページ目なんだよくそがあああああああああああああああああああああああああああああああああああああああ
      {
        type: "button",
        x: 435,
        y: 180,
        width: 204,
        height: 56,
        text: Country.JapaneseHiragana.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.JapaneseHiragana.name,
        },
      },
      {
        type: "button",
        x: 655,
        y: 180,
        width: 204,
        height: 56,
        text: Country.JapaneseKatakana.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.JapaneseKatakana.name,
        },
      },
      {
        type: "button",
        x: 435,
        y: 280,
        width: 184,
        height: 56,
        text: Country.Chinese.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Chinese.name,
        },
      },
      {
        type: "button",
        x: 635,
        y: 280,
        width: 184,
        height: 56,
        text: Country.ChineseTaiwan.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.ChineseTaiwan.name,
        },
      },
      {
        type: "button",
        x: 435,
        y: 380, //400
        width: 114,
        height: 56,
        text: Country.Korean.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Korean.name,
        },
      },
      {
        type: "button",
        x: 565,
        y: 380, //400
        width: 94,
        height: 56,
        text: Country.English.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.English.name,
        },
      },
      {
        type: "button",
        x: 675,
        y: 380, //400
        width: 154,
        height: 56,
        text: Country.Arabic.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Arabic.name,
        },
      },
      {
        type: "button",
        x: 435,
        y: 480, //400
        width: 154,
        height: 56,
        text: Country.Italian.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Italian.name,
        },
      },
      {
        type: "button",
        x: 605,
        y: 480, //400
        width: 194,
        height: 56,
        text: Country.Indonesian.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Indonesian.name,
        },
      },
      //2ページ目だゴルァアアアアアアアアアアアアアアアアアアアアアアアアアアアアアアアアアアアアアアアアアアア
      {
        type: "button",
        x: 435,
        y: 180,
        width: 174,
        height: 56,
        text: Country.Urdu.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Urdu.name,
        },
      },
      {
        type: "button",
        x: 625,
        y: 180,
        width: 154,
        height: 56,
        text: Country.Greek.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Greek.name,
        },
      },
      {
        type: "button",
        x: 435,
        y: 280,
        width: 154,
        height: 56,
        text: Country.Khmer.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Khmer.name,
        },
      },
      {
        type: "button",
        x: 605,
        y: 280,
        width: 154,
        height: 56,
        text: Country.Sinhala.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Sinhala.name,
        },
      },
      {
        type: "button",
        x: 435,
        y: 380,
        width: 194,
        height: 56,
        text: Country.Svenska.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Svenska.name,
        },
      },
      {
        type: "button",
        x: 645,
        y: 380,
        width: 154,
        height: 56,
        text: Country.Kiswahili.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Kiswahili.name,
        },
      },
      {
        type: "button",
        x: 435,
        y: 480,
        width: 134,
        height: 56,
        text: Country.Dzongkha.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Dzongkha.name,
        },
      },
      {
        type: "button",
        x: 585,
        y: 480,
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
        x: 725,
        y: 480,
        width: 154,
        height: 56,
        text: Country.Tagalog.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Tagalog.name,
        },
      },
      //3ページ目だよこのタコおおおおおおおおおおおおおおおおおおおおおおおおおおおおお！！！！！！
      {
        type: "button",
        x: 435,
        y: 180,
        width: 134,
        height: 56,
        text: Country.Tamil.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Tamil.name,
        },
      },
      {
        type: "button",
        x: 585,
        y: 180,
        width: 134,
        height: 56,
        text: Country.Dari.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Dari.name,
        },
      },
      {
        type: "button",
        x: 735,
        y: 180,
        width: 134,
        height: 56,
        text: Country.German.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.German.name,
        },
      },
      {
        type: "button",
        x: 435,
        y: 280,
        width: 134,
        height: 56,
        text: Country.Turkish.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Turkish.name,
        },
      },
      {
        type: "button",
        x: 585,
        y: 280,
        width: 134,
        height: 56,
        text: Country.Nepali.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Nepali.name,
        },
      },
      {
        type: "button",
        x: 735,
        y: 280,
        width: 154,
        height: 56,
        text: Country.Pasto.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Pasto.name,
        },
      },
      {
        type: "button",
        x: 435,
        y: 380,
        width: 154,
        height: 56,
        text: Country.Hindi.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Hindi.name,
        },
      },
      {
        type: "button",
        x: 605,
        y: 380,
        width: 274,
        height: 56,
        text: Country.VirginPortuguese.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.VirginPortuguese.name,
        },
      },
      {
        type: "button",
        x: 435,
        y: 480,
        width: 154,
        height: 56,
        text: Country.French.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.French.name,
        },
      },
      {
        type: "button",
        x: 605,
        y: 480,
        width: 154,
        height: 56,
        text: Country.Vietnamese.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Vietnamese.name,
        },
      },
      //4ページ目に到達したぞ！これで最後じゃボケエエエエエエエエエエエエエエエエエエ！！！！！！
      {
        type: "button",
        x: 435,
        y: 180,
        width: 234,
        height: 56,
        text: Country.PeruSpanish.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.PeruSpanish.name,
        },
      },
      {
        type: "button",
        x: 685,
        y: 180,
        width: 154,
        height: 56,
        text: Country.Persian.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Persian.name,
        },
      },
      {
        type: "button",
        x: 435,
        y: 280,
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
        x: 605,
        y: 280,
        width: 194,
        height: 56,
        text: Country.Malayalam.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Malayalam.name,
        },
      },
      {
        type: "button",
        x: 435,
        y: 380,
        width: 124,
        height: 56,
        text: Country.Malay.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Malay.name,
        },
      },
      {
        type: "button",
        x: 575,
        y: 380,
        width: 164,
        height: 56,
        text: Country.Burmese.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Burmese.name,
        },
      },
      {
        type: "button",
        x: 755,
        y: 380,
        width: 124,
        height: 56,
        text: Country.Yoruba.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Yoruba.name,
        },
      },
      {
        type: "button",
        x: 435,
        y: 480,
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
        x: 585,
        y: 480,
        width: 154,
        height: 56,
        text: Country.Latvie.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Latvie.name,
        },
      },
      {
        type: "button",
        x: 755,
        y: 480,
        width: 134,
        height: 56,
        text: Country.Russian.text,
        fontSize: 24,
        data: {
          [Category.key]: Category.data.Country.name,
          [Category.value]: Country.Russian.name,
        },
      },
      //１文字の横幅は20くらい
      //三文字の場合は次の言語ボタンとの距離は130
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
      //const countryButtonGroup = this.add.group();
      //countryButtonGroup.addMultiple(countryButtons);
      //return countryButtonGroup;
    });
  };
}
