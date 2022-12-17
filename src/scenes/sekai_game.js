import { characterList } from "../characterlist.js";
import SoundButton from "../components/sound_button.js";

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
];

export default class SekaiGame extends Phaser.Scene {
  constructor() {
    super({ key: "sekai_game", active: false });
    this.fontFamily = undefined;
    this.prevSceneData = undefined;
  }

  preload() {
    this.load.path = window.location.href.replace("index.html", "");
    // bgm
    bgms.forEach((bgm) => {
      this.load.audio(...bgm);
    });
    images.forEach((image) => {
      this.load.image(...image);
    });
  }

  init(data) {
    this.fontFamily = this.registry.get("fontFamily");
    this.prevSceneData = {
      country: data.country,
      mode: data.mode,
      sizeY: data.sizeY,
      sizeX: data.sizeX,
      isChallenge: data.isChallenge,
    };
    this.createCharacterList();
    this.characterIndex = 0;
    this.timer = 0;
    this.answerCounter = 0;
    this.wrongFlag = false;
    this.numberOfQuestions = 10;
    this.correctCharacter = "";
    this.mistakeCharacter = "";
    this.tips = "";
    this.correctAnsExample = "";
    this.wrongAnsExample = "";
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

    this.characterContainer = this.add.container(0, 0);
    switch (this.prevSceneData.sizeX) {
      case 6:
        this.characterContainer.setY(250);
        this.characterFontSize = 50;
        this.characterSpace = 100;
        break;
      case 8:
        this.characterContainer.setY(200);
        this.characterFontSize = 50;
        this.characterSpace = 100;
        break;
      default:
        this.characterContainer.setY(190);
        this.characterFontSize = 40;
        this.characterSpace = 70;
    }
    this.characterContainer.setSize(
      this.prevSceneData.sizeX * this.characterSpace - this.characterFontSize,
      this.prevSceneData.sizeY * this.characterSpace - this.characterFontSize
    );
    this.characterContainer.setX(
      this.game.canvas.width / 2 - this.characterContainer.width / 2
    );

    this.createCharacter();

    this.add
      .text(775, 672, "一時停止", {
        fill: 0x333333,
        fontSize: 32,
        fontFamily: this.fontFamily,
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.pause();
        this.scene.launch("sekai_pause_menu");
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
          this.scene.start("sekai_game", {
            sizeY: this.prevSceneData.sizeY,
            sizeX: this.prevSceneData.sizeX,
            mode: this.prevSceneData.mode,
            country: this.prevSceneData.country,
          });
          break;
        case "return-to-top":
          this.events.off();
          this.scene.stop();
          this.scene.start("sekai_game_menu");
          break;
        case "return-to-setting":
          this.events.off();
          this.scene.stop();
          this.scene.start("sekai_game_setting", {
            sizeY: this.prevSceneData.sizeY,
            sizeX: this.prevSceneData.sizeX,
            mode: this.prevSceneData.mode,
            country: this.prevSceneData.country,
          });
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

  commentAnim() {
    const commentBg = this.add.graphics();
    commentBg
      .fillStyle(0x333333, 0.5)
      .fillRect(0, 0, 1024, 768)
      .setInteractive(
        new Phaser.Geom.Rectangle(0, 0, 1024, 768),
        Phaser.Geom.Rectangle.Contains
      ).depth = 2;

    const correctImg = this.add.sprite(100, 530, "maru");
    correctImg.setScale(0.2);
    correctImg.depth = 4;

    // const correctMoguraImg = this.add.sprite(700, 550, "correctmogura");
    // correctMoguraImg.depth = 4;

    const mistakeImg = this.add.sprite(620, 530, "batu");
    mistakeImg.setScale(0.2);
    mistakeImg.depth = 4;

    const correctAnsBox = this.add.graphics();
    correctAnsBox
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(30, 234, 432, 367, 14).depth = 3;

    // FIXME: たまに読み込めない文字がある
    // FIXME: レイアウトが雑なので修正する
    // console.log(this.mistakeCharacter);
    // console.log(this.correctCharacter);
    // console.log(this.tips);
    // console.log(this.correctAnsExample);
    // console.log(this.wrongAnsExample);

    const correctAnsTitle = this.add.text(210, 250, "正解", {
      fill: "#000000",
      fontSize: 32,
      fontFamily: this.fontFamily,
    });
    correctAnsTitle.depth = 4;

    const correctAnsChar = this.add.text(60, 320, this.correctCharacter, {
      fill: "#000000",
      fontSize: 64,
      fontFamily: this.fontFamily,
    });
    correctAnsChar.depth = 4;

    const correctAnsExample = this.add.text(60, 420, this.correctAnsExample, {
      fill: "#000000",
      fontSize: 16,
      fontFamily: this.fontFamily,
    });
    correctAnsExample.depth = 4;

    const wrongAnsBox = this.add.graphics();
    wrongAnsBox
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(550, 234, 432, 367, 14).depth = 3;

    const wrongAnsTitle = this.add.text(710, 250, "不正解", {
      fill: "#000000",
      fontSize: 32,
      fontFamily: this.fontFamily,
    });
    wrongAnsTitle.depth = 4;

    const wrongAnsChar = this.add.text(610, 320, this.mistakeCharacter, {
      fill: "#000000",
      fontSize: 64,
      fontFamily: this.fontFamily,
    });
    wrongAnsChar.depth = 4;

    const wrongAnsExample = this.add.text(610, 420, this.wrongAnsExample, {
      fill: "#000000",
      fontSize: 16,
      fontFamily: this.fontFamily,
    });
    wrongAnsExample.depth = 4;

    const tips = this.add.text(160, 120, this.tips, {
      fill: "#ffffff",
      fontSize: 32,
      fontFamily: this.fontFamily,
    });
    tips.depth = 4;

    const commentGroup = this.add.group();

    const resumeButton = this.add
      .text(460, 650, "閉じる", {
        fill: "#ffffff",
        fontSize: 32,
        fontFamily: this.fontFamily,
      })
      .setInteractive()
      .on("pointerdown", () => {
        commentGroup.toggleVisible(false);
      });
    resumeButton.depth = 4;

    commentGroup.addMultiple([
      commentBg,
      correctImg,
      mistakeImg,
      correctAnsBox,
      correctAnsTitle,
      correctAnsChar,
      correctAnsExample,
      wrongAnsBox,
      wrongAnsTitle,
      wrongAnsChar,
      wrongAnsExample,
      resumeButton,
      tips,
    ]);
    commentGroup.toggleVisible(true);

    // setTimeout(() => {
    //   commentGroup.toggleVisible(false);
    // }, 1500);
    commentGroup.toggleVisible(true);
  }

  countTime() {
    this.check();
    this.timer += 1;
    this.check();
    this.createTimerComponent();
  }

  check() {
    if (
      (this.prevSceneData.mode === "timeLimit" &&
        (this.timer >= 60 || this.answerCounter >= this.numberOfQuestions)) ||
      (this.prevSceneData.mode === "timeAttack" &&
        this.answerCounter >= this.numberOfQuestions) ||
      (this.prevSceneData.mode === "suddenDeath" && this.wrongFlag) ||
      (this.prevSceneData.mode === "learn" &&
        this.answerCounter >= this.numberOfQuestions)
    ) {
      this.fx.stop();
      this.scene.start("sekai_game_result", {
        time: this.timer,
        ranking: true,
        modalVisible: true,
        rankingRegistered: false,
        answers: this.answerCounter,
        mode: this.prevSceneData.mode,
        country: this.prevSceneData.country,
        sizeX: this.prevSceneData.sizeX,
        sizeY: this.prevSceneData.sizeY,
      });
    }
  }

  shuffleCharacterList() {
    let i = this.characterList.length;
    while (i > 1) {
      i -= 1;
      const j = Math.floor(Math.random() * i);
      [this.characterList[i], this.characterList[j]] = [
        this.characterList[j],
        this.characterList[i],
      ];
    }
  }

  createCharacter() {
    const answerY = Math.floor(Math.random() * this.prevSceneData.sizeY);
    const answerX = Math.floor(Math.random() * this.prevSceneData.sizeX);
    const characterArray = [];
    const i = this.characterIndex;

    // 正解/不正解SE
    const correct = this.sound.add("correct_se");
    const but = this.sound.add("but_se");

    this.characterContainer.removeAll(true);

    this.mistakeCharacter = this.characterList[i][1];
    this.correctCharacter = this.characterList[i][2];
    this.tips = this.characterList[i][3];
    this.correctAnsExample = this.characterList[i][4];
    this.wrongAnsExample = this.characterList[i][5];

    for (let y = 0; y < this.prevSceneData.sizeY; y += 1) {
      for (let x = 0; x < this.prevSceneData.sizeX; x += 1) {
        const character =
          y === answerY && x === answerX
            ? this.characterList[i][1]
            : this.characterList[i][2];

        characterArray.push(
          this.add
            .text(x * this.characterSpace, y * this.characterSpace, character, {
              fill: 0x333333,
              fontSize: this.characterFontSize,
              fontFamily: this.fontFamily,
            })
            .setInteractive()
        );

        if (y === answerY && x === answerX) {
          characterArray[characterArray.length - 1].once("pointerdown", () => {
            this.correctAnim();
            correct.play();
            this.answerCounter += 1;
            this.createAnswerComponent();
            if (this.prevSceneData.mode === "learn") {
              setTimeout(() => {
                this.commentAnim();
              }, 1500);
            }
            setTimeout(
              () => {
                this.createCharacter();
              },
              this.prevSceneData.mode === "learn" ? 2900 : 1400
            );
          });
        } else {
          characterArray[characterArray.length - 1].once("pointerdown", () => {
            this.mistakeAnim();
            but.play();
            this.wrongFlag = true;
            if (this.prevSceneData.mode === "learn") {
              setTimeout(() => {
                this.commentAnim();
              }, 1500);
            }
            setTimeout(
              () => {
                this.createCharacter();
              },
              this.prevSceneData.mode === "learn" ? 2900 : 1400
            );
          });
        }
      }
    }
    this.characterContainer.add(characterArray);

    this.characterIndex += 1;
    if (this.characterIndex >= this.characterList.length) {
      this.shuffleCharacterList();
      this.characterIndex %= this.characterList.length;
    }
  }

  createCharacterList() {
    let character = [];
    if (this.prevSceneData.isChallenge) {
      Object.values(characterList).forEach((element) => {
        let i = element.length;
        const list = element;
        while (i > 1) {
          i -= 1;
          const j = Math.floor(Math.random() * i);
          [list[i], list[j]] = [list[j], list[i]];
        }
        character = character.concat(list);
      });
      this.characterList = character;
    } else {
      character = characterList[this.prevSceneData.country];
      this.characterList = character;
      this.shuffleCharacterList();
    }
  }

  createAnswerComponent() {
    if (this.answerComponent) this.answerComponent.destroy();

    if (this.prevSceneData.mode === "suddenDeath") {
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
    } else if (
      this.prevSceneData.mode === "timeAttack" ||
      this.prevSceneData.mode === "timeLimit" ||
      this.prevSceneData.mode === "learn"
    ) {
      this.answerComponent = this.add.text(
        155,
        671,
        `残り：${this.numberOfQuestions - this.answerCounter}問`,
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
    if (this.prevSceneData.mode === "timeLimit") {
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
    } else if (this.prevSceneData.mode === "timeAttack") {
      this.timerComponent = this.add
        .text(this.game.canvas.width / 2, 54, `タイム：${this.timer}秒`, {
          fill: 0x333333,
          fontSize: 50,
          fontFamily: this.fontFamily,
        })
        .setOrigin(0.5, 0);
    } else if (this.prevSceneData.mode === "learn") {
      this.timerComponent = this.add
        .text(this.game.canvas.width / 2, 54, `経過時間：${this.timer}秒`, {
          fill: 0x333333,
          fontSize: 50,
          fontFamily: this.fontFamily,
        })
        .setOrigin(0.5, 0);
    }
  }
}
