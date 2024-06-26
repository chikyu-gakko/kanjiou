import { nakamalist } from "../../nakamalist";

/**
 * @callback onPointerdown
 *
 * @callback afterConfirmationCallback
 */
export default class NakamaContainer extends Phaser.GameObjects.Container {
  static Level = {
    1: {
      name: "level1",
      text: "レベル1 (小学1〜3年)",
    },
    2: {
      name: "level2",
      text: "レベル2 (小学4〜6年)",
    },
    3: {
      name: "level3",
      text: "レベル3 (小学1〜6年)",
    },
    4: {
      name: "level4",
      text: "レベル4 (中学1〜3年)",
    },
    5: {
      name: "level5",
      text: "レベル5 (小学1〜中学3年)",
    },
  };
  static StrokeCount = {
    1: {
      name: "level1",
      text: "レベル1 (小1)",
    },
    2: {
      name: "level2",
      text: "レベル2 (小2)",
    },
    3: {
      name: "level3",
      text: "レベル3 (小3)",
    },
    4: {
      name: "level4",
      text: "レベル4 (小4)",
    },
    5: {
      name: "level5",
      text: "レベル5 (小5)",
    },
    6: {
      name: "level6",
      text: "レベル6 (小6)",
    },
    7: {
      name: "level7",
      text: "レベル7 (中学生)",
    },
    8: {
      name: "level8",
      text: "レベル8 (小中学生)",
    },
    9: {
      name: "level9",
      text: "レベル9 (小学生)",
    },
    10: {
      name: "level10",
      text: "レベル10 (小１～中３)",
    },
    11: {
      name: "level11",
      text: "レベル11 (小１～６)",
    },
    12: {
      name: "level12",
      text: "レベル12 (小１～中３)",
    },
  };
  static Category = {
    key: "category",
    value: "value",
    data: {
      Level: {
        name: "level",
        text: "レベル",
        width: 434,
        height: 56,
        basePositionX: 445,
        basePositionY: 100,
        marginX: 19,
        marginY: 19,
        row: 1,
        fontSize: 24,
        value: this.Level
      },
      StrokeCount: {
        name: "strokeCount",
        text: "画数",
        width: 235,
        height: 56,
        basePositionX: 410,
        basePositionY: 100,
        marginX: 15,
        marginY: 19,
        row: 2,
        fontSize: 16,
        value: this.StrokeCount
      },
    },
  };

  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   * @param {number} x number
   * @param {number} y number
   * @param {string} level string
   */
  constructor(scene, x, y, level) {
    super(scene, x, y);
    scene.add.existing(this);
    // stupid LOL :-)
    switch (level) {
      case NakamaContainer.Level[1].name:
        this.quizzes = this.createRandomQuizList(1);
        break;
      case NakamaContainer.Level[2].name:
        this.quizzes = this.createRandomQuizList(2);
        break;
      case NakamaContainer.Level[3].name:
        this.quizzes = this.createRandomQuizList(3);
        break;
      case NakamaContainer.Level[4].name:
        this.quizzes = this.createRandomQuizList(4);
        break;
      case NakamaContainer.Level[5].name:
        this.quizzes = this.createRandomQuizList(5);
        break;
      default:
      // throw `${level} does not exist in nakamalist`;
    }
    this.group = this.createGroup(scene);
    this.answerCounter = 0;
    this.questionsCounter = 0;
    this.correctedCounter = 0;
    this.answerComponent = this.createAnswerComponent(scene);
  }

  /**
   * @param {Phaser.Scene} scene
   * @param {afterConfirmationCallback} whenCleard callback
   */
  start = (scene, whenCleard) => {
    const [leftSideObjs, rightSideObjs] = this.createObjs(scene, false);
    this.questionsCounter += leftSideObjs.length;
    this.questionsCounter += rightSideObjs.length;

    const okButton = this.createOKButton(scene, () => {
      this.check(scene, leftSideObjs, rightSideObjs);
      this.createExampleAnswerButton(scene, () => {
        this.group.setVisible(false);
        this.createObjs(scene, true);
        this.showLeftRadicalName(scene);
        this.showRightRadicalName(scene);
        this.showMoguran(scene);

        this.createNextQuizButton(scene, () => {
          if (9 <= this.answerCounter) {
            whenCleard();
          }
          this.answerCounter += 1;
          this.group.setVisible(false);
          this.start(scene, whenCleard);
          this.answerComponent = this.createAnswerComponent(scene);
        });
      });
    });
  };

  /**
   * @param {Phaser.Scene} scene
   * @param {boolean} isExampleAnswer
   * @returns {[Phaser.GameObjects.Text[], Phaser.GameObjects.Text[]]}
   */
  createObjs = (scene, isExampleAnswer) => {
    const leftSide = {
      chars: this.quizzes[this.answerCounter].left.chars,
      radical: this.quizzes[this.answerCounter].left.radical,
      x: 400,
      y: 700,
      width: 100,
      height: 100,
    };
    const rightSide = {
      chars: this.quizzes[this.answerCounter].right.chars,
      radical: this.quizzes[this.answerCounter].right.radical,
      x: 30,
      y: 30,
      width: 100,
      height: 100,
    };

    const leftTitle = scene.add.text(306, 80, leftSide.radical, {
      color: "#333333",
      fontSize: "80px",
      strokeThickness: 10,
      fontFamily: scene.registry.get("fontFamily"),
    });
    leftTitle.setOrigin(0.5, 0.5);
    this.group.add(leftTitle);
    const rightTitle = scene.add.text(718, 80, rightSide.radical, {
      color: "#333333",
      fontSize: "80px",
      strokeThickness: 10,
      fontFamily: scene.registry.get("fontFamily"),
    });
    rightTitle.setOrigin(0.5, 0.5);
    this.group.add(rightTitle);

    const generatePoss = () => {
      if (isExampleAnswer) {
        /** @type {{x: number, y:number}[]} */
        const sequentialPoss = [];
        for (let i = 0; i < leftSide.chars.length; i++) {
          const x = ((i / 3) | 0) * 80 + 250;
          const y = (i % 3) * 80 + 320;
          sequentialPoss.push({ x, y });
        }
        for (let i = 0; i < rightSide.chars.length; i++) {
          const x = ((i / 3) | 0) * 80 + 512 + 100;
          const y = (i % 3) * 80 + 320;
          sequentialPoss.push({ x, y });
        }
        return sequentialPoss;
      } else {
        /** @type {{x: number, y:number}[]} */
        const randomPoss = [];
        for (let i = 0; i < 1000; i++) {
          const x = Math.floor(Math.random() * (724 - 200)) + 200;
          const y = Math.floor(Math.random() * (570 - 230)) + 230;

          let overlapped = false;
          // FIXME: 文字や線に重ならないように位置を決めているがまだ重なるときがある
          for (let pos of randomPoss) {
            if (
              pos.x - 50 < x &&
              x < pos.x + 50 &&
              pos.y - 50 < y &&
              y < pos.y + 50
            ) {
              overlapped = true;
              break;
            }
            if (462 < x && x < 562) {
              // line
              overlapped = true;
              break;
            }
          }
          if (overlapped) continue;
          randomPoss.push({ x, y });
          if (
            leftSide.chars.length + rightSide.chars.length <=
            randomPoss.length
          )
            break;
        }
        return randomPoss;
      }
    };
    const poss = generatePoss();

    const leftSideObjs = leftSide.chars.map((e, i) => {
      const obj = scene.add.text(poss[i].x, poss[i].y, e[0], {
        color: "#333333",
        fontSize: "60px",
        fontFamily: scene.registry.get("fontFamily"),
      });
      obj.setOrigin(0.5, 0.5);
      obj.setDepth(2);
      this.group.add(obj);
      return obj
        .setInteractive({ draggable: true })
        .on("drag", (pointer, dragX, dragY) => {
          if (200 <= dragY && dragY <= 600 && (dragX <= 502 || 522 <= dragX)) {
            obj.setPosition(dragX, dragY);
          }
          // console.log(dragX, dragY);
        });
    });
    const rightSideObjs = rightSide.chars.map((e, i) => {
      const obj = scene.add.text(
        poss[i + leftSide.chars.length].x,
        poss[i + leftSide.chars.length].y,
        e[0],
        {
          color: "#333333",
          fontSize: "60px",
          fontFamily: scene.registry.get("fontFamily"),
        }
      );
      obj.setOrigin(0.5, 0.5);
      obj.setDepth(2);
      this.group.add(obj);
      return obj
        .setInteractive({ draggable: true })
        .on("drag", (pointer, dragX, dragY) => {
          if (200 <= dragY && dragY <= 600 && (dragX <= 502 || 522 <= dragX)) {
            obj.setPosition(dragX, dragY);
          }
          // console.log(dragX, dragY);
        });
    });

    return [leftSideObjs, rightSideObjs];
  };

  /**
   * @param {Phaser.Scene} scene
   * @param {Phaser.GameObjects.Text[]} rightSideObjs
   * @param {Phaser.GameObjects.Text[]} leftSideObjs
   */
  check = (scene, rightSideObjs, leftSideObjs) => {
    this.showLeftRadicalName(scene);
    this.showRightRadicalName(scene);
    const threshouldX = 512;
    leftSideObjs.forEach((e) => {
      e.removeListener("drag");
      if (e.x < threshouldX) {
        // NOTE: バツ印は表示しないことに決まりました
        // const batu = scene.add.sprite(e.x, e.y, "batu");
        // batu.setScale(0.2);
        // batu.setOrigin(0.5, 0.5);
        // this.group.add(batu);
      } else {
        const maru = scene.add.sprite(e.x, e.y, "maru");
        maru.setScale(0.2);
        maru.setOrigin(0.5, 0.5);
        this.group.add(maru);
        this.correctedCounter += 1;
      }
    });
    rightSideObjs.forEach((e) => {
      e.removeListener("drag");
      if (threshouldX < e.x) {
        // NOTE: バツ印は表示しないことに決まりました
        // const batu = scene.add.sprite(e.x, e.y, "batu");
        // batu.setScale(0.2);
        // batu.setOrigin(0.5, 0.5);
        // this.group.add(batu);
      } else {
        const maru = scene.add.sprite(e.x, e.y, "maru");
        maru.setScale(0.2);
        maru.setOrigin(0.5, 0.5);
        this.group.add(maru);
        this.correctedCounter += 1;
      }
    });
  };

  /**
   * @param {Number} level
   */
  createRandomQuizList = (level) => {
    const quizzes = nakamalist[NakamaContainer.Level[level].name];
    console.log(NakamaContainer.Level[level].text)
    // NOTE: ランダムではなく難易度順に出題することにした
    // for (let i = 0; i < quizzes.length; i++) {
    //   const a = Math.floor(Math.random() * quizzes.length);
    //   const b = Math.floor(Math.random() * quizzes.length);
    //   [quizzes[a], quizzes[b]] = [quizzes[b], quizzes[a]];
    // }
    return quizzes;
  };

  /**
   * @param {Phaser.Scene} scene
   * @callback {onPointerdown} callback
   */
  createOKButton = (scene, callback) => {
    // NOTE: 一時的に画像を試す
    // const okButton = scene.add
    //   .text(512, 650, "OK", {
    //     fontSize: "32px",
    //     color: "#000000",
    //     backgroundColor: "#ffffff",
    //   })
    //   .setOrigin(0.5, 0.5)
    //   .setInteractive()
    //   .on("pointerdown", () => {
    //     callback();
    //     okButton.destroy();
    //   });
    const okButton = scene.add
      .sprite(512, 680, "ok")
      .setInteractive()
      .setScale(0.6, 0.6)
      .setOrigin(0.5, 0.5)
      .on("pointerdown", () => {
        callback();
        okButton.destroy();
      });

    okButton.setDepth(2);
    return okButton;
  };

  /**
   * @param {Phaser.Scene} scene
   * @callback {onPointerdown} callback
   */
  createExampleAnswerButton = (scene, callback) => {
    // NOTE: 一時的に画像を試す
    // const exampleAnswerButton = scene.add
    //   .text(512, 650, "見本をみる", {
    //     fontSize: "32px",
    //     color: "#000000",
    //     backgroundColor: "#ffffff",
    //   })
    //   .setInteractive()
    //   .setOrigin(0.5, 0.5)
    //   .on("pointerdown", () => {
    //     callback();
    //     exampleAnswerButton.destroy();
    //   });
    const exampleAnswerButton = scene.add
      .sprite(512, 680, "kotae")
      .setInteractive()
      .setScale(0.8, 0.8)
      .setOrigin(0.5, 0.5)
      .on("pointerdown", () => {
        callback();
        exampleAnswerButton.destroy();
      });
    return exampleAnswerButton;
  };

  /**
   * @param {Phaser.Scene} scene
   * @callback {onPointerdown} callback
   */
  createNextQuizButton = (scene, callback) => {
    // NOTE: 一時的に画像を試す
    // const nextButton = scene.add
    //   .text(512, 650, "つぎへ", {
    //     fontSize: "32px",
    //     color: "#000000",
    //     backgroundColor: "#ffffff",
    //   })
    //   .setInteractive()
    //   .setOrigin(0.5, 0.5)
    //   .on("pointerdown", () => {
    //     callback();
    //     nextButton.destroy();
    //   });
    const nextButton = scene.add
      .sprite(512, 680, "go")
      .setInteractive()
      .setScale(0.8, 0.8)
      .setOrigin(0.5, 0.5)
      .on("pointerdown", () => {
        callback();
        nextButton.destroy();
      });
    return nextButton;
  };

  /**
   * @param {Phaser.Scene} scene
   */
  createGroup = (scene) => {
    return scene.add.group();
  };

  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   */
  createAnswerComponent = (scene) => {
    if (this.answerComponent) this.answerComponent.destroy();
    const text = scene.add
      .text(250, 700, `${this.answerCounter + 1} / 10 問`, {
        color: "#333333",
        fontSize: "50px",
        fontFamily: scene.registry.get("fontFamily"),
      })
      .setOrigin(0.5, 0.5);
    return text;
  };

  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   */
  showLeftRadicalName = (scene) => {
    const leftRadicalName = scene.add.text(
      306,
      150,
      this.quizzes[this.answerCounter].left.radicalName,
      {
        color: "#333333",
        fontSize: "40px",
        fontFamily: scene.registry.get("fontFamily"),
      }
    );
    leftRadicalName.setOrigin(0.5, 0.5);
    this.group.add(leftRadicalName);
  };

  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   */
  showRightRadicalName = (scene) => {
    const rightRadicalName = scene.add.text(
      718,
      150,
      this.quizzes[this.answerCounter].right.radicalName,
      {
        color: "#333333",
        fontSize: "40px",
        fontFamily: scene.registry.get("fontFamily"),
      }
    );
    rightRadicalName.setOrigin(0.5, 0.5);
    this.group.add(rightRadicalName);
  };

  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   */
  showMoguran = (scene) => {
    const moguran = scene.add
      .sprite(850, 550, "correctmogura")
      .setScale(0.4, 0.4);
    this.group.add(moguran);
  };
}
