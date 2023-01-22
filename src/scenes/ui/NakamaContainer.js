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
      text: "レベル1",
    },
  };
  static Category = {
    key: "category",
    value: "value",
    data: {
      Level: {
        name: "level",
        text: "レベル",
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
    switch (level) {
      case NakamaContainer.Level[1].name:
        this.quizzes = this.createRandomQuizList();
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
    const [leftSideObjs, rightSideObjs] = this.createObjs(scene);
    this.questionsCounter += leftSideObjs.length;
    this.questionsCounter += rightSideObjs.length;

    const okButton = this.createOKButton(scene, () => {
      this.check(scene, leftSideObjs, rightSideObjs, whenCleard);
      this.createNextQuizButton(scene, () => {
        this.group.setVisible(false);
        this.start(scene, whenCleard);
      });
      this.answerComponent = this.createAnswerComponent(scene);
    });
  };

  /**
   * @param {Phaser.Scene} scene
   * @returns {[Phaser.GameObjects.Text[], Phaser.GameObjects.Text[]]}
   */
  createObjs = (scene) => {
    const leftSide = {
      radicalName: this.quizzes[this.answerCounter][1],
      chars: this.quizzes[this.answerCounter][2],
      radical: this.quizzes[this.answerCounter][5],
      x: 400,
      y: 700,
      width: 100,
      height: 100,
    };
    const rightSide = {
      radicalName: this.quizzes[this.answerCounter][3],
      chars: this.quizzes[this.answerCounter][4],
      radical: this.quizzes[this.answerCounter][6],
      x: 30,
      y: 30,
      width: 100,
      height: 100,
    };

    const leftTitle = scene.add.text(150, 30, leftSide.radical, {
      color: "#333333",
      fontSize: "60px",
      fontFamily: scene.registry.get("fontFamily"),
    });
    leftTitle.setOrigin(0.5, 0.5);
    this.group.add(leftTitle);
    const rightTitle = scene.add.text(670, 30, rightSide.radical, {
      color: "#333333",
      fontSize: "60px",
      fontFamily: scene.registry.get("fontFamily"),
    });
    rightTitle.setOrigin(0.5, 0.5);
    this.group.add(rightTitle);

    /** @type {{x: number, y:number}[]} */
    const randomPoss = [];
    for (let i = 0; i < 1000; i++) {
      const x = Math.floor(Math.random() * (924 - 100)) + 100;
      const y = Math.floor(Math.random() * (568 - 100)) + 100;

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
      if (leftSide.chars.length + rightSide.chars.length <= randomPoss.length)
        break;
    }
    const leftSideObjs = leftSide.chars.map((e, i) => {
      const obj = scene.add.text(randomPoss[i].x, randomPoss[i].y, e[0], {
        color: "#333333",
        fontSize: "50px",
        fontFamily: scene.registry.get("fontFamily"),
      });
      obj.setOrigin(0.5, 0.5);
      obj.setDepth(2);
      this.group.add(obj);
      return obj
        .setInteractive({ draggable: true })
        .on("drag", (pointer, dragX, dragY) => {
          obj.setPosition(dragX, dragY);
        });
    });
    const rightSideObjs = rightSide.chars.map((e, i) => {
      const obj = scene.add.text(
        randomPoss[i + leftSide.chars.length].x,
        randomPoss[i + leftSide.chars.length].y,
        e[0],
        {
          color: "#333333",
          fontSize: "50px",
          fontFamily: scene.registry.get("fontFamily"),
        }
      );
      obj.setOrigin(0.5, 0.5);
      obj.setDepth(2);
      this.group.add(obj);
      return obj
        .setInteractive({ draggable: true })
        .on("drag", (pointer, dragX, dragY) => {
          obj.setPosition(dragX, dragY);
        });
    });

    return [leftSideObjs, rightSideObjs];
  };

  /**
   * @param {Phaser.Scene} scene
   * @param {Phaser.GameObjects.Text[]} rightSideObjs
   * @param {Phaser.GameObjects.Text[]} leftSideObjs
   * @param {afterConfirmationCallback} whenCleard callback
   */
  check = (scene, rightSideObjs, leftSideObjs, whenCleard) => {
    const threshouldX = 497;
    leftSideObjs.forEach((e) => {
      e.removeListener("drag");
      if (e.x < threshouldX) {
        const batu = scene.add.sprite(e.x, e.y, "batu");
        batu.setScale(0.2);
        batu.setOrigin(0.5, 0.5);
        this.group.add(batu);
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
        const batu = scene.add.sprite(e.x, e.y, "batu");
        batu.setScale(0.2);
        batu.setOrigin(0.5, 0.5);
        this.group.add(batu);
      } else {
        const maru = scene.add.sprite(e.x, e.y, "maru");
        maru.setScale(0.2);
        maru.setOrigin(0.5, 0.5);
        this.group.add(maru);
        this.correctedCounter += 1;
      }
    });
    this.answerCounter += 1;
    if (9 <= this.answerCounter) {
      whenCleard();
    }
  };

  createRandomQuizList = () => {
    const quizzes = nakamalist[NakamaContainer.Level[1].text];
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
    const okButton = scene.add
      .text(490, 650, "OK", {
        fontSize: "32px",
        color: "#000000",
        backgroundColor: "#ffffff",
      })
      .setInteractive()
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
  createNextQuizButton = (scene, callback) => {
    const nextButton = scene.add
      .text(490, 650, "つぎへ", {
        fontSize: "32px",
        color: "#000000",
        backgroundColor: "#ffffff",
      })
      .setInteractive()
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
    const text = scene.add.text(
      155,
      671,
      `残り : ${10 - this.answerCounter}問`,
      {
        color: "#333333",
        fontSize: "50px",
        fontFamily: scene.registry.get("fontFamily"),
      }
    );
    return text;
  };
}
