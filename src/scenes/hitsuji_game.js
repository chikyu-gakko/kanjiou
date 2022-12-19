import { kanjiList } from "../kanjilist.js";
import SoundButton from "../components/sound_button.js";
import BackGround from "./ui/BackGround.js";
import KanjiContainer from "./ui/KanjiContainer.js";
import TimeStopLabel from "./ui/TimerStopLabel.js";
import GameTime from "./ui/GameTime.js";

export default class HitsujiGame extends Phaser.Scene {
  constructor() {
    super({ key: "hitsuji_game", active: false });
    this.fontFamily = undefined;
    this.prevSceneData = undefined;
    this.kanjiContainer = undefined;
    this.gameTime = undefined;
    this.timerComponent = undefined;
  }

  preload() {
    this.load.path = window.location.href.replace("index.html", "");

    // bgm
    this.load.audio("game_bgm", "assets/audio/timer.mp3");
    this.load.audio("correct_se", "assets/audio/correct.mp3");
    this.load.audio("but_se", "assets/audio/but_se.mp3");

    this.load.image("maru", "assets/img/maru.png");
    this.load.image("batu", "assets/img/batu.png");
    this.load.image("correctmogura", "assets/img/fun_mogura2.png");
    this.load.image("mistakemogura", "assets/img/sad_mogura.png");
  }

  init(data) {
    this.fontFamily = this.registry.get("fontFamily");
    this.prevSceneData = {
      size: data.size,
      mode: data.mode,
      schoolYear: data.schoolYear,
      isChallenge: data.isChallenge,
    };
  }

  create() {
    this.createBackGround();
    this.createSoundButton();
    this.startMusic();
    this.kanjiContainer = this.createKanjiContainer();
    this.kanjiContainer.createKanji(
      this,
      "correct_se",
      "but_se",
      this.correctAnim,
      this.mistakeAnim
    );
    this.createTimeStopLabel();
    this.gameTime = this.createGameTime();
    this.time.addEvent({
      delay: 1000,
      repeat: Infinity,
      callback: () => {
        this.gameTime.countTime(
          () => {
            this.gameTime.check(
              this.kanjiContainer.mode,
              this.kanjiContainer.answerCounter,
              this.kanjiContainer.numberOfQuestions,
              this.kanjiContainer.wrongFlag,
              () => {
                this.fx.stop();
                this.scene.start("game_result", {
                  time: this.gameTime.timer,
                  ranking: true,
                  modalVisible: true,
                  rankingRegistered: false,
                  answers: this.kanjiContainer.answerCounter,
                  mode: this.kanjiContainer.mode,
                  schoolYear: this.kanjiContainer.schoolYear,
                  size: this.kanjiContainer.size,
                });
              }
            );
          },
          () => this.createTimerComponent(this.gameTime.timer)
        );
      },
      callbackScope: this,
    });
    this.createTimerComponent(this.gameTime.timer);

    this.events.on("resume", (scene, data) => {
      switch (data.status) {
        case "restart":
          this.events.off();
          this.scene.stop();
          this.scene.start("hitsuji_game", {
            size: this.kanjiContainer.size,
            mode: this.kanjiContainer.mode,
            schoolYear: this.kanjiContainer.schoolYear,
          });
          break;
        case "return-to-top":
          this.events.off();
          this.scene.stop();
          this.scene.start("game_menu");
          break;
        case "return-to-setting":
          this.events.off();
          this.scene.stop();
          this.scene.start("game_setting", {
            size: this.kanjiContainer.size,
            mode: this.kanjiContainer.mode,
            schoolYear: this.kanjiContainer.schoolYear,
          });
          break;
        default:
      }
    });
  }

  correctAnim = () => {
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
  };

  mistakeAnim = () => {
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
  };

  /**
   * @param {number} time
   */
  createTimerComponent = (time) => {
    if (this.timerComponent) this.timerComponent.destroy();
    if (this.kanjiContainer.mode === "timeLimit") {
      this.timerComponent = this.add
        .text(this.game.canvas.width / 2, 54, `残り時間：${60 - time}秒`, {
          fill: 0x333333,
          fontSize: 50,
          fontFamily: this.fontFamily,
        })
        .setOrigin(0.5, 0);
    } else if (this.kanjiContainer.mode === "timeAttack") {
      this.timerComponent = this.add
        .text(this.game.canvas.width / 2, 54, `タイム：${time}秒`, {
          fill: 0x333333,
          fontSize: 50,
          fontFamily: this.fontFamily,
        })
        .setOrigin(0.5, 0);
    }
  };

  createBackGround = () => {
    new BackGround(this, { color: 0xeaeaea, alpha: 1 });
  };

  createSoundButton = () => {
    new SoundButton(this, 70, 700, 40);
  };

  startMusic = () => {
    this.fx = this.sound.add("game_bgm");
    this.fx.allowMultiple = false;
    this.fx.setLoop(true);
  };

  createKanjiContainer = () => {
    return new KanjiContainer(
      this,
      0,
      0,
      this.prevSceneData.size,
      this.prevSceneData.schoolYear,
      this.prevSceneData.isChallenge,
      this.prevSceneData.mode
    );
  };

  createTimeStopLabel = () => {
    const timeStopLabel = new TimeStopLabel(this, 775, 672, "一時停止", {
      fill: 0x333333,
      fontSize: 32,
      fontFamily: this.fontFamily,
    });
    timeStopLabel.setInteractive().on("pointerdown", () => {
      this.scene.pause();
      this.scene.launch("pause_menu");
    });
  };

  createGameTime = () => {
    return new GameTime(this);
  };
}
