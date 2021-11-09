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
  }

  preload() {
    this.load.path = window.location.href.replace("index.html","");

    // もぐらんボタン
    // this.load.image("mogura", "img/fun_mogura2.png");
    this.load.image("mogura", "img/fun_mogura.png");
    
    // サウンドアイコン
    this.load.image("sound", "img/sound.png");

    // ミニゲーム中bgm
    this.load.audio("top_bgm", "audio/top.mp3");
    this.load.audio("correct_se", "audio/correct.mp3");
    this.load.audio("but_se", "audio/but_se.mp3");
  }

  create() {
    // 画面描画（大）
    const bigframeGraphics = this.add.graphics();

    bigframeGraphics
      .fillStyle(0xffffff, 1)
      .fillRect(121, 37, 788, 694, 5, 5).depth = 0;

    // 画面描画（大）
    const smallframeGraphics = this.add.graphics();

    smallframeGraphics
      .fillStyle(0xeaeaea, 1)
      .fillRect(231, 82, 561, 419, 5, 5).depth = 1;

    const explainText = this.add.text(
      270,
      548,
      `ひとつだけ違う漢字を選んでね！`,
      {
        fontSize: "32px",
        fill: 0x333333,
        fontFamily: "Arial",
      }
    );

    explainText.setPadding(4).depth = 2;

    // 「わかった」ボタン
    const completeButton = this.add.graphics();
    completeButton
      .lineStyle(5, 0x645246)
      .fillStyle(0x32b65e, 1)
      .fillRoundedRect(331, 615, 368, 80, 40)
      .strokePath()
      .setInteractive(
        new Phaser.Geom.Rectangle(331, 615, 368, 80),
        Phaser.Geom.Rectangle.Contains
      ).depth = 1;

    const completeText = this.add.text(453, 635, "わかった！", {
      fontSize: "32px",
      fill: "#FFFFFF",
      fontFamily: "Arial",
    });
    completeText.depth = 2;

    completeButton.setInteractive().on(
      "pointerdown",
      () => {
        this.gameMusic.stop();
        this.scene.start("game_setting");
      },
      this
    );

    // もぐら
    const moguraIcon = this.add.sprite(430, 650, "mogura");
    moguraIcon.depth = 2;

    // 音楽
    // ゲームBGM
    this.gameMusic = this.sound.add("top_bgm");
    this.gameMusic.allowMultiple = false;
    this.gameMusic.setLoop(true);
    this.gameMusic.play();
    let soundStatus = 1;

    // 音声アイコン枠描画
    const soundCircle = this.add.graphics();
    soundCircle
      .fillStyle(0x939393, 1)
      .fillCircle(300, 460, 30)
      .setInteractive(
        new Phaser.Geom.Circle(300, 460, 30),
        Phaser.Geom.Circle.Contains
      ).depth = 3;

    // 音声アイコン
    const soundIcon = this.add.sprite(300, 460, "sound");
    soundIcon.depth = 4;

    soundCircle.on(
      "pointerdown",
      () => {
        if (soundStatus === 0) {
          this.gameMusic.play();
          soundStatus = 1;
        } else if (soundStatus === 1) {
          this.gameMusic.stop();
          soundStatus = 0;
        }
      },
      this
    );

    this.createKanji();
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
              fontFamily: "Arial",
            })
            .setInteractive()
        );

        if (y === answerY && x === answerX) {
          this.kanjiComponents[y][x].once("pointerdown", () => {
            correct.play();
            this.createKanji();
          });
        } else {
          this.kanjiComponents[y][x].once("pointerdown", () => {
            but.play();
            this.createKanji();
          });
        }
        this.kanjiComponents[y][x].depth = 10;
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
