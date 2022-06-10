import SoundButton from "../components/sound_button.js";

export default class HowToPlay extends Phaser.Scene {
  constructor() {
    super({ key: "how_to_play", active: false });
  }

  init() {
    this.kanjiList = [
      ["白", "日"],
      ["刀", "力"],
      ["右", "左"],
    ];
    this.kanjiIndex = Math.floor(Math.random() * this.kanjiList.length);
    this.sizeY = 2;
    this.sizeX = 4;
    this.kanjiComponents = [];
    this.fontFamily = this.registry.get("fontFamily");
  }

  preload() {
    this.load.path = window.location.href.replace("index.html", "");

    // もぐらんボタン
    this.load.image("funMoguraImg", "assets/img/fun_mogura.png");

    // サウンドアイコン
    this.load.image("sound", "assets/img/sound.png");
    this.load.image("mute", "assets/img/mute.png");

    // ミニゲーム中bgm
    this.load.audio("correct_se", "audio/correct.mp3");
    this.load.audio("but_se", "audio/but_se.mp3");

    this.load.image("maru", "assets/img/maru.png");
    this.load.image("batu", "assets/img/batu.png");
    this.load.image("correctmogura", "assets/img/fun_mogura2.png");
    this.load.image("mistakemogura", "assets/img/sad_mogura.png");
  }

  create() {
    // 画面描画（大）
    this.add
      .graphics()

      .fillStyle(0xffffff, 1)
      .fillRect(121, 37, 788, 694, 5, 5);

    // 画面描画（大）
    this.add
      .graphics()

      .fillStyle(0xeaeaea, 1)
      .fillRect(231, 82, 561, 419, 5, 5);

    this.add.text(270, 548, `ひとつだけ違う漢字を選んでね！`, {
      fontSize: "32px",
      fill: 0x333333,
      fontFamily: this.fontFamily,
    });

    // 「わかった」ボタン
    this.add
      .graphics()
      .lineStyle(2, 0x645246)
      .fillStyle(0x32b65e, 1)
      .fillRoundedRect(331, 615, 368, 80, 40)
      .strokePath()
      .setInteractive(
        new Phaser.Geom.Rectangle(331, 615, 368, 80),
        Phaser.Geom.Rectangle.Contains
      )
      .on(
        "pointerdown",
        () => {
          this.scene.start("game_setting");
        },
        this
      );

    this.add.text(453, 635, "わかった！", {
      fontSize: "32px",
      fill: "#FFFFFF",
      fontFamily: this.fontFamily,
    });

    // もぐら
    this.add.sprite(400, 650, "funMoguraImg");

    this.soundButton = new SoundButton(this, 300, 460, 30);

    this.createKanji();
  }

  correctAnim() {
    const correctBg = this.add.graphics();
    correctBg
      .fillStyle(0x333333, 0.5)
      .fillRect(0, 0, 1024, 768)
      .setInteractive(
        new Phaser.Geom.Rectangle(0, 0, 1024, 768),
        Phaser.Geom.Rectangle.Contains
      ).depth = 4;

    const correctImg = this.add.sprite(512, 384, "maru");
    correctImg.depth = 5;

    const correctMoguraImg = this.add.sprite(700, 550, "correctmogura");
    correctMoguraImg.depth = 6;

    const correctGroup = this.add.group();
    correctGroup.addMultiple([correctBg, correctMoguraImg, correctImg]);
    correctGroup.toggleVisible(true);

    setTimeout(() => {
      correctGroup.toggleVisible(false);
    }, 1500);
    correctGroup.toggleVisible(true);
  }

  mistakeAnim() {
    const mistakeBg = this.add.graphics();
    mistakeBg
      .fillStyle(0x333333, 0.5)
      .fillRect(0, 0, 1024, 768)
      .setInteractive(
        new Phaser.Geom.Rectangle(0, 0, 1024, 768),
        Phaser.Geom.Rectangle.Contains
      ).depth = 4;

    const mistakeImg = this.add.sprite(512, 384, "batu");
    mistakeImg.depth = 5;

    const mistakeMogura = this.add.sprite(800, 600, "mistakemogura");
    mistakeMogura.depth = 6;

    const mistakeGroup = this.add.group();
    mistakeGroup.addMultiple([mistakeBg, mistakeMogura, mistakeImg]);
    mistakeGroup.toggleVisible(true);

    setTimeout(() => {
      mistakeGroup.toggleVisible(false);
    }, 1500);
    mistakeGroup.toggleVisible(true);
  }

  createKanji() {
    const answerY = Math.floor(Math.random() * this.sizeY);
    const answerX = Math.floor(Math.random() * this.sizeX);
    const i = this.kanjiIndex;

    // 正解/不正解SE
    const correct = this.sound.add("correct_se");
    const but = this.sound.add("but_se");

    this.clearKanji();

    for (let y = 0; y < this.sizeY; y += 1) {
      this.kanjiComponents.push([]);
      for (let x = 0; x < this.sizeX; x += 1) {
        const kanji =
          y === answerY && x === answerX
            ? this.kanjiList[i][1]
            : this.kanjiList[i][0];
        this.kanjiComponents[y].push(
          this.add
            .text(300 + x * 114, 163 + y * 128, kanji, {
              fill: 0x333333,
              fontSize: 80,
              fontFamily: this.fontFamily,
            })
            .setInteractive()
        );

        if (y === answerY && x === answerX) {
          this.kanjiComponents[y][x].once("pointerdown", () => {
            this.correctAnim();
            correct.play();
            setTimeout(() => {
              this.createKanji();
            }, 1400);
          });
        } else {
          this.kanjiComponents[y][x].once("pointerdown", () => {
            this.mistakeAnim();
            but.play();
            setTimeout(() => {
              this.createKanji();
            }, 1400);
          });
        }
      }
    }

    this.kanjiIndex = (this.kanjiIndex + 1) % this.kanjiList.length;
  }

  clearKanji() {
    for (let y = 0; y < this.kanjiComponents.length; y += 1) {
      for (let x = 0; x < this.kanjiComponents[y].length; x += 1) {
        this.kanjiComponents[y][x].destroy();
      }
    }
    this.kanjiComponents = [];
  }
}
