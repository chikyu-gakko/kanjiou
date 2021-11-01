import { kanjiList } from "./kanjilist.js";

export default class HitsujiGame extends Phaser.Scene {
  constructor() {
    super({
      key: "hitsuji_game",
      active: false,
    });
  }

  preload() {
    // bgm
    this.load.audio("game_bgm", "../audio/timer.mp3");
    this.load.audio("correct_se", "../audio/correct.mp3");
    this.load.audio("but_se", "../audio/but_se.mp3");

    this.load.image("maru","../img/maru.png");
    this.load.image("batu","../img/batu.png");
  }

  init(data) {
    this.schoolYear = data.schoolYear;
    this.mode = data.mode;
    this.sizeY = data.sizeY;
    this.sizeX = data.sizeX;
    this.kanjiList = kanjiList[data.schoolYear];
    this.kanjiIndex = 0;
    this.kanjiComponents = [];
    this.timer = 0;
    this.answerCounter = 0;
    this.wrongFlag = false;
  }

  create() {
    // 背景
    const bgGameMenu = this.add.graphics();
    bgGameMenu.fillStyle(0xeaeaea, 1).fillRect(0, 0, 1024, 768);
    bgGameMenu.depth = 0;

    // 音声アイコン枠描画
    const soundCircle = this.add.graphics();
    soundCircle.fillStyle(0x333333, 1).fillCircle(70, 700, 40);
    soundCircle.depth = 3;

    // 音声アイコン
    const soundIcon = this.add.sprite(70, 700, "sound");
    let soundStatus = 1;
    soundIcon.depth = 4;
    soundIcon.setInteractive();

    // 音楽
    // ゲームBGM
    this.fx = this.sound.add("game_bgm");
    this.fx.allowMultiple = false;
    this.fx.setLoop(true);


    soundIcon.on(
      "pointerdown",
      () => {
        if (soundStatus === 0) {
          this.fx.play();
          soundStatus = 1;
        } else if (soundStatus === 1) {
          this.fx.stop();
          soundStatus = 0;
        }
      },
      this
    );

    this.shuffleKanjiList();
    this.createKanji();

    this.add
      .text(775, 672, "一時停止", {
        fill: 0x333333,
        fontSize: 32,
        fontFamily: "Arial",
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
          this.registry.destroy();
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
          this.registry.destroy();
          this.events.off();
          this.scene.stop();
          this.scene.start("game_menu");
          break;
        case "finish-game":
          this.registry.destroy();
          this.events.off();
          this.scene.stop();
          this.scene.start("game_menu");
          break;
        default:
      }
    });
  }

  correctAnim(){
    const correctBg = this.add.graphics();
    correctBg.fillStyle(0x333333, 0.5).fillRect(0, 0, 1024, 768);
    const correctImg = this.add.sprite(512, 384, "maru");
    const correctGroup = this.add.group();
    correctGroup.addMultiple([correctImg,correctBg]);
    
    correctGroup.toggleVisible(true);
    setTimeout(() => {
      correctGroup.toggleVisible(false);
    }, 1500,);
    correctGroup.toggleVisible(true);
  }

  mistakeAnim(){
    const mistakeBg = this.add.graphics();
    mistakeBg.fillStyle(0x333333, 0.5).fillRect(0, 0, 1024, 768);
    const mistakeImg = this.add.sprite(512, 384, "batu");
    const mistakeGroup = this.add.group();
    mistakeGroup.addMultiple([mistakeImg,mistakeBg]);
    mistakeGroup.toggleVisible(true);
    setTimeout(() => {
      mistakeGroup.toggleVisible(false);
    }, 1500,);
    mistakeGroup.toggleVisible(true);
  }

  countTime() {
    this.timer += 1;
    this.check();
    this.createTimerComponent();
  }

  check() {
    if (
      (this.mode === "timeLimit" && this.timer >= 60) ||
      (this.mode === "timeAttack" && this.answerCounter >= 10) ||
      (this.mode === "suddenDeath" && this.wrongFlag)
    ) {
      this.fx.stop();
      this.scene.start("game_result", {
        time: this.timer,
        answers: this.answerCounter,
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
          if(this.sizeX === 6){
            this.kanjiComponents[y].push(
            this.add
            .text(200 + x * 100, 250 + y * 100, kanji, {
              fill: 0x333333,
              fontSize: 50,
              fontFamily: "Arial",
            })
            .setInteractive()
            );
          }else if(this.sizeX === 8){
            this.kanjiComponents[y].push(
              this.add
              .text(150 + x * 100, 200 + y * 100, kanji, {
                fill: 0x333333,
                fontSize: 50,
                fontFamily: "Arial",
              })
              .setInteractive()
              );
          }else if(this.sizeX === 12){
            this.kanjiComponents[y].push(
              this.add
              .text(100 + x * 70, 190 + y * 70, kanji, {
                fill: 0x333333,
                fontSize: 40,
                fontFamily: "Arial",
              })
              .setInteractive()
            );
          }
          
          if (y === answerY && x === answerX) {
            this.kanjiComponents[y][x].once("pointerdown", () => {
              this.correctAnim();
              correct.play();
              this.answerCounter += 1;
              this.check();
              this.createAnswerComponent();
              this.createKanji();
            });
        } else {
          this.kanjiComponents[y][x].once("pointerdown", () => {
            this.mistakeAnim();
            but.play();
            this.wrongFlag = true;
            this.check();
            this.createKanji();
          });
        }
      }
    }

    this.kanjiIndex += 1;
    if (this.kanjiIndex >= this.kanjiList.length) {
      this.shuffleKanjiList();
      this.kanjiIndex %= this.kanjiList.length;
    }
  }

  clearKanji() {
    for (let y = 0; y < this.kanjiComponents.length; y += 1) {
      for (let x = 0; x < this.kanjiComponents[y].length; x += 1) {
        this.kanjiComponents[y][x].destroy();
      }
    }
    this.kanjiComponents = [];
  }

  createAnswerComponent() {
    if (this.answerComponent) this.answerComponent.destroy();
    this.answerComponent = this.add
      .text(360, 671, `正解数:${this.answerCounter}問`, {
        fill: 0x333333,
        fontSize: 50,
        fontFamily: "Arial",
      })
      .setOrigin(1, 0);
  }

  createTimerComponent() {
    if (this.timerComponent) this.timerComponent.destroy();
    if (this.mode === "timeLimit") {
      this.timerComponent = this.add.text(
        310,
        54,
        `残り時間：${60 - this.timer}秒`,
        {
          fill: 0x333333,
          fontSize: 50,
          fontFamily: "Arial",
        }
      );
    } else if (this.mode === "timeAttack") {
      this.timerComponent = this.add.text(10, 10, `残り時間：${this.timer}秒`, {
        fontSize: 50,
        fontFamily: "Arial",
      });
    }
  }
}
