import Phaser from "phaser";
import SoundButton from "../components/sound_button.js";
import BackGround from "./ui/BackGround.js";
import CharContainer from "./ui/CharContainer.js";
import TimeStopLabel from "./ui/TimerStopLabel.js";
import GameTime from "./ui/GameTime.js";

const bgms = [
  ["game_bgm", "assets/audio/timer.mp3"],
  ["correct_se", "assets/audio/correct.mp3"],
  ["but_se", "assets/audio/but_se.mp3"],
];
const images = [
  ["maru", "assets/img/maru.png"],
  ["batu", "assets/img/batu.png"],
  ["correctmogura", "assets/img/fun_mogura2.png"],
  ["mistakemogura", "assets/img/sad_mogura.png"],
  ["whiteboard", "assets/img/whiteboard.png"],
  ["kanban", "assets/img/kanban.png"],
];

export default class SekaiGame extends Phaser.Scene {
  constructor() {
    super({ key: "sekai_game", active: false });
    this.fontFamily = undefined;
    this.prevSceneData = undefined;
    this.charContainer = undefined;
    this.gameTime = undefined;
  }

  preload() {
    this.load.path = window.location.href.replace("index.html", "");
    // bgm
    bgms.forEach((bgm) => {
      this.load.audio(bgm[0], bgm[1]);
    });
    images.forEach((image) => {
      this.load.image(image[0], image[1]);
    });
  }

  init(data) {
    this.fontFamily = this.registry.get("fontFamily");
    this.prevSceneData = {
      size: data.size,
      mode: data.mode,
      country: data.country,
      isChallenge: data.isChallenge,
    };
    this.characterIndex = 0;
  }

  create() {
    this.createBackGround();
    this.createWhiteBoard();
    this.createSoundButton();
    this.startMusic();
    this.charContainer = this.createCharContainer();
    this.charContainer.createChar(
      this,
      "correct_se",
      "but_se",
      this.correctAnim,
      this.mistakeAnim,
      () =>
        this.commentAnim(
          this.charContainer.mistakeCharacter,
          this.charContainer.correctCharacter,
          this.charContainer.mistakeAnsExample,
          this.charContainer.correctAnsExample,
          this.charContainer.mistakeAnsRead,
          this.charContainer.correctAnsRead,
          this.charContainer.mistakeAnsMean,
          this.charContainer.correctAnsMean
        )
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
              this.charContainer.mode,
              this.charContainer.answerCounter,
              this.charContainer.numberOfQuestions,
              this.charContainer.wrongFlag,
              this.transitionToResult
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
          this.sound.stopAll();
          this.scene.stop();
          this.scene.start("sekai_game", {
            size: this.prevSceneData.size,
            mode: this.prevSceneData.mode,
            country: this.prevSceneData.country,
          });
          break;
        case "return-to-top":
          this.sound.stopAll();
          this.scene.stop();
          this.scene.start("game_menu");
          break;
        case "return-to-setting":
          this.sound.stopAll();
          this.scene.stop();
          this.scene.start("sekai_game_setting", {
            size: this.prevSceneData.size,
            mode: this.prevSceneData.mode,
            country: this.prevSceneData.country,
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
    correctGroup.toggleVisible();

    setTimeout(() => {
      correctGroup.toggleVisible();
    }, 1500);
    correctGroup.toggleVisible();
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
    mistakeGroup.toggleVisible();

    setTimeout(() => {
      mistakeGroup.toggleVisible();
    }, 1500);
    mistakeGroup.toggleVisible();
  };

  /**
   * @param {string} mistakeCharacter
   * @param {string} correctCharacter
   * @param {string} mistakeAnsExample
   * @param {string} correctAnsExample
   * @param {string} mistakeAnsRead
   * @param {string} correctAnsRead
   * @param {string} mistakeAnsMean
   * @param {string} correctAnsMean
   * 
   */
  commentAnim = (
    mistakeCharacter,
    correctCharacter,
    mistakeAnsExample,
    correctAnsExample,
    mistakeAnsRead,
    correctAnsRead,
    mistakeAnsMean,
    correctAnsMean
  ) => {
    const commentBg = this.add.graphics();
    commentBg
      .fillStyle(0x333333, 0.5)
      .fillRect(0, 0, 1024, 768)
      .setInteractive(
        new Phaser.Geom.Rectangle(0, 0, 1024, 768),
        Phaser.Geom.Rectangle.Contains
      ).depth = 2;

    const correctX = 315;
    const wrongX = 717;

    const kanban = this.add
      .sprite(512, 400, "kanban")
      .setScale(1.2, 1.2)
      .setOrigin(0.5, 0.5)
      .setDepth(3);

    const correctAnsChar = this.add
      .text(correctX, 270, correctCharacter, {
        color: "#d53f3f",
        fontSize: "100px",
        fontFamily: this.fontFamily,
      })
      .setOrigin(0.5, 0.5);
    correctAnsChar.depth = 4;

    const correctExample = this.add
      .text(correctX, 358, correctAnsExample, {
        color: "#000000",
        fontSize: "32px",
        fontFamily: this.fontFamily,
      })
      .setOrigin(0.5, 0.5);
    correctExample.depth = 4;

    const correctRead = this.add
      .text(correctX, 400, correctAnsRead, {
        color: "#aaaaaa",
        fontSize: "24px",
        fontFamily: this.fontFamily,
      })
      .setOrigin(0.5, 0.5);
    correctRead.depth = 4;

    const correctMean = this.add
      .text(correctX, 428, correctAnsMean, {
        color: "#000000",
        fontSize: "24px",
        fontFamily: this.fontFamily,
      })
      .setOrigin(0.5, 0.5);
    correctMean.depth = 4;

    const wrongAnsChar = this.add
      .text(wrongX, 270, mistakeCharacter, {
        color: "#000000",
        fontSize: "100px",
        fontFamily: this.fontFamily,
      })
      .setOrigin(0.5, 0.5);
    wrongAnsChar.depth = 4;

    const wrongExample = this.add
      .text(wrongX, 358, mistakeAnsExample, {
        color: "#000000",
        fontSize: "32px",
        fontFamily: this.fontFamily,
      })
      .setOrigin(0.5, 0.5);
    wrongExample.depth = 4;

    const wrongRead = this.add
      .text(wrongX, 400, mistakeAnsRead, {
        color: "#aaaaaa",
        fontSize: "24px",
        fontFamily: this.fontFamily,
      })
      .setOrigin(0.5, 0.5);
    wrongRead.depth = 4;

    const wrongMean = this.add
      .text(wrongX, 428, mistakeAnsMean, {
        color: "#000000",
        fontSize: "24px",
        fontFamily: this.fontFamily,
      })
      .setOrigin(0.5, 0.5);
    wrongMean.depth = 4;

    const mogura = this.add
      .sprite(700, 650, "correctmogura")
      .setDepth(4)
      .setScale(0.5, 0.5);

    const commentGroup = this.add.group();

    const resumeButton = this.add
      .text(512, 650, "閉じる", {
        color: "#ffffff",
        fontSize: "48px",
        fontFamily: this.fontFamily,
      })
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on("pointerdown", () => {
        commentGroup.toggleVisible();
      });
    resumeButton.depth = 4;

    commentGroup.addMultiple([
      commentBg,
      kanban,
      correctAnsChar,
      correctExample,
      correctRead,
      correctMean,
      wrongAnsChar,
      wrongExample,
      wrongRead,
      wrongMean,
      mogura,
      resumeButton,
    ]);
    commentGroup.toggleVisible();
    commentGroup.toggleVisible();
  };

  /**
   * @param {number} time
   */
  createTimerComponent(time) {
    if (this.timerComponent) this.timerComponent.destroy();
    if (this.prevSceneData.mode === "timeLimit") {
      this.timerComponent = this.add
        .text(this.game.canvas.width / 2, 54, `残り時間：${60 - time}秒`, {
          color: "#333333",
          fontSize: "50px",
          fontFamily: this.fontFamily,
        })
        .setOrigin(0.5, 0);
    } else if (this.prevSceneData.mode === "timeAttack") {
      this.timerComponent = this.add
        .text(this.game.canvas.width / 2, 54, `タイム：${time}秒`, {
          color: "#333333",
          fontSize: "50px",
          fontFamily: this.fontFamily,
        })
        .setOrigin(0.5, 0);
    /*} else if (this.prevSceneData.mode === "learn") {
      this.timerComponent = this.add
        .text(this.game.canvas.width / 2, 54, `タイム：${time}秒`, {
          color: "#333333",
          fontSize: "50px",
          fontFamily: this.fontFamily,
        })
        .setOrigin(0.5, 0);*/
    }
  }

  createBackGround = () => {
    new BackGround(this, { color: 0xeedcb3, alpha: 1 });
  };

  createWhiteBoard = () => {
    this.add
      .sprite(512, 364, "whiteboard")
      .setScale(2.8, 2)
      .setOrigin(0.49, 0.3);
  };

  createSoundButton = () => {
    new SoundButton(this, 70, 700, 40);
  };

  startMusic = () => {
    this.sound.play("game_bgm", { loop: true });
  };

  createCharContainer = () => {
    return new CharContainer(
      this,
      0,
      0,
      this.prevSceneData.size,
      this.prevSceneData.country,
      this.prevSceneData.isChallenge,
      this.prevSceneData.mode
    );
  };

  createTimeStopLabel = () => {
    const timeStopLabel = new TimeStopLabel(this, 775, 672, "一時停止", {
      color: "#333333",
      fontSize: "32px",
      fontFamily: this.fontFamily,
    });
    timeStopLabel.setInteractive().on("pointerdown", () => {
      this.scene.pause();
      this.scene.launch("sekai_pause_menu");
    });
  };

  createGameTime = () => {
    return new GameTime(this);
  };

  transitionToResult = () => {
    this.sound.stopAll();
    this.scene.start("sekai_game_result", {
      time: this.gameTime.timer,
      ranking: true,
      modalVisible: true,
      rankingRegistered: false,
      answers: this.charContainer.answerCounter,
      mode: this.prevSceneData.mode,
      country: this.prevSceneData.country,
      size: this.prevSceneData.size,
    });
  };
}
