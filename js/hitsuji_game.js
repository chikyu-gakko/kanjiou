import { kanjiList } from "./kanjilist.js";
import SoundButton from "./sound_button.js";

export default class HitsujiGame extends Phaser.Scene {
  constructor() {
    super({ key: "hitsuji_game", active: false });
  }

  preload() {
    this.load.path = window.location.href.replace("index.html", "");

    // bgm
    this.load.audio("game_bgm", "audio/timer.mp3");
    this.load.audio("correct_se", "audio/correct.mp3");
    this.load.audio("but_se", "audio/but_se.mp3");

    this.load.image("maru", "img/maru.png");
    this.load.image("batu", "img/batu.png");
    this.load.image("correctmogura", "img/fun_mogura2.png");
    this.load.image("mistakemogura", "img/sad_mogura.png");
  }

  init(data) {
    this.schoolYear = data.schoolYear;
    this.mode = data.mode;
    this.sizeY = data.sizeY;
    this.sizeX = data.sizeX;
    this.isChallenge = data.isChallenge;
    this.createKanjiList();
    this.kanjiIndex = 0;
    this.timer = 0;
    this.answerCounter = 0;
    this.wrongFlag = false;
    this.fontFamily = this.registry.get("fontFamily");
  }

  create() {
    // 背景
    const bgGameMenu = this.add.graphics();
    bgGameMenu.fillStyle(0xeaeaea, 1).fillRect(0, 0, 1024, 768);

    this.soundButton = new SoundButton(this, 70, 700, 40);

    // 音楽
    // ゲームBGM
    this.fx = this.sound.add("game_bgm");
    this.fx.allowMultiple = false;
    this.fx.setLoop(true);

    this.kanjiContainer = this.add.container(0, 0);
    switch (this.sizeX) {
      case 6:
        this.kanjiContainer.setY(250);
        this.kanjiFontSize = 50;
        this.kanjiSpace = 100;
        break;
      case 8:
        this.kanjiContainer.setY(200);
        this.kanjiFontSize = 50;
        this.kanjiSpace = 100;
        break;
      default:
        this.kanjiContainer.setY(190);
        this.kanjiFontSize = 40;
        this.kanjiSpace = 70;
    }
    this.kanjiContainer.setSize(
      this.sizeX * this.kanjiSpace - this.kanjiFontSize,
      this.sizeY * this.kanjiSpace - this.kanjiFontSize
    );
    this.kanjiContainer.setX(
      this.game.canvas.width / 2 - this.kanjiContainer.width / 2
    );

    this.createKanji();

    this.add
      .text(775, 672, "一時停止", {
        fill: 0x333333,
        fontSize: 32,
        fontFamily: this.fontFamily,
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.pause();
        this.scene.launch("pause_menu");
      });

    this.createTimerComponent();
    this.createAnswerComponent();

    this.time.addEvent({
      delay: 1000,
      repeat: Infinity,
      callback: this.countTime,
      callbackScope: this,
    });

    this.events.on("resume", (scene, data) => {
      switch (data.status) {
        case "restart":
          this.events.off();
          this.scene.stop();
          this.scene.start("hitsuji_game", {
            sizeY: this.sizeY,
            sizeX: this.sizeX,
            mode: this.mode,
            schoolYear: this.schoolYear,
          });
          break;
        case "return-to-top":
          this.events.off();
          this.scene.stop();
          this.scene.start("game_menu");
          break;
        default:
      }
    });
  }

  correctAnim() {
    const correctBg = this.add.graphics();
    correctBg
      .fillStyle(0x333333, 0.5)
      .fillRect(0, 0, 1024, 768)
      .setInteractive(
        new Phaser.Geom.Rectangle(0, 0, 1024, 768),
        Phaser.Geom.Rectangle.Contains
      ).depth = 2;

    const correctImg = this.add.sprite(512, 384, "maru");
    correctImg.depth = 3;

    const correctMoguraImg = this.add.sprite(700, 550, "correctmogura");
    correctMoguraImg.depth = 4;

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
      ).depth = 2;

    const mistakeImg = this.add.sprite(512, 384, "batu");
    mistakeImg.depth = 3;

    const mistakeMogura = this.add.sprite(800, 600, "mistakemogura");
    mistakeMogura.depth = 4;

    const mistakeGroup = this.add.group();
    mistakeGroup.addMultiple([mistakeBg, mistakeMogura, mistakeImg]);
    mistakeGroup.toggleVisible(true);

    setTimeout(() => {
      mistakeGroup.toggleVisible(false);
    }, 1500);
    mistakeGroup.toggleVisible(true);
  }

  countTime() {
    this.timer += 1;
    this.check();
    this.createTimerComponent();
  }

  check() {
    if (
      (this.mode === "timeLimit" &&
        (this.timer >= 60 || this.answerCounter >= this.kanjiList.length)) ||
      (this.mode === "timeAttack" &&
        this.answerCounter >= this.kanjiList.length) ||
      (this.mode === "suddenDeath" && this.wrongFlag)
    ) {
      this.fx.stop();
      this.scene.start("game_result", {
        time: this.timer,
        answers: this.answerCounter,
        mode: this.mode,
      });
    }
  }

  shuffleKanjiList() {
    let i = this.kanjiList.length;
    while (i > 1) {
      i -= 1;
      const j = Math.floor(Math.random() * i);
      [this.kanjiList[i], this.kanjiList[j]] = [
        this.kanjiList[j],
        this.kanjiList[i],
      ];
    }
  }

  createKanji() {
    const answerY = Math.floor(Math.random() * this.sizeY);
    const answerX = Math.floor(Math.random() * this.sizeX);
    const kanjiArray = [];
    const i = this.kanjiIndex;

    // 正解/不正解SE
    const correct = this.sound.add("correct_se");
    const but = this.sound.add("but_se");

    this.kanjiContainer.removeAll(true);

    for (let y = 0; y < this.sizeY; y += 1) {
      for (let x = 0; x < this.sizeX; x += 1) {
        const kanji =
          y === answerY && x === answerX
            ? this.kanjiList[i][1]
            : this.kanjiList[i][0];

        kanjiArray.push(
          this.add
            .text(x * this.kanjiSpace, y * this.kanjiSpace, kanji, {
              fill: 0x333333,
              fontSize: this.kanjiFontSize,
              fontFamily: this.fontFamily,
            })
            .setInteractive()
        );

        if (y === answerY && x === answerX) {
          kanjiArray[kanjiArray.length - 1].once("pointerdown", () => {
            this.correctAnim();
            correct.play();
            this.answerCounter += 1;
            this.createAnswerComponent();
            setTimeout(() => {
              this.check();
              this.createKanji();
            }, 1400);
          });
        } else {
          kanjiArray[kanjiArray.length - 1].once("pointerdown", () => {
            this.mistakeAnim();
            but.play();
            this.wrongFlag = true;
            setTimeout(() => {
              this.check();
              this.createKanji();
            }, 1400);
          });
        }
      }
    }
    this.kanjiContainer.add(kanjiArray);

    this.kanjiIndex += 1;
    if (this.kanjiIndex >= this.kanjiList.length) {
      this.shuffleKanjiList();
      this.kanjiIndex %= this.kanjiList.length;
    }
  }

  createKanjiList() {
    let kanji = [];
    if (this.isChallenge) {
      Object.values(kanjiList).forEach((element) => {
        let i = element.length;
        const list = element;
        while (i > 1) {
          i -= 1;
          const j = Math.floor(Math.random() * i);
          [list[i], list[j]] = [list[j], list[i]];
        }
        kanji = kanji.concat(list);
      });
      this.kanjiList = kanji;
    } else {
      kanji = kanjiList[this.schoolYear];
      this.kanjiList = kanji;
      this.shuffleKanjiList();
    }
  }

  createAnswerComponent() {
    if (this.answerComponent) this.answerComponent.destroy();

    if (this.mode === "suddenDeath") {
      this.answerComponent = this.add.text(
        155,
        671,
        `正解数：${this.answerCounter}問`,
        {
          fill: 0x333333,
          fontSize: 50,
          fontFamily: this.fontFamily,
        }
      );
    } else if (this.mode === "timeAttack" || this.mode === "timeLimit") {
      this.answerComponent = this.add.text(
        155,
        671,
        `残り：${this.kanjiList.length - this.answerCounter}問`,
        {
          fill: 0x333333,
          fontSize: 50,
          fontFamily: this.fontFamily,
        }
      );
    }
  }

  createTimerComponent() {
    if (this.timerComponent) this.timerComponent.destroy();
    if (this.mode === "timeLimit") {
      this.timerComponent = this.add
        .text(
          this.game.canvas.width / 2,
          54,
          `残り時間：${60 - this.timer}秒`,
          {
            fill: 0x333333,
            fontSize: 50,
            fontFamily: this.fontFamily,
          }
        )
        .setOrigin(0.5, 0);
    } else if (this.mode === "timeAttack") {
      this.timerComponent = this.add
        .text(this.game.canvas.width / 2, 54, `タイム：${this.timer}秒`, {
          fill: 0x333333,
          fontSize: 50,
          fontFamily: this.fontFamily,
        })
        .setOrigin(0.5, 0);
    }
  }
}
