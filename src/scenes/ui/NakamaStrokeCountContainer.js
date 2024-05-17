import { nakamaStrokeCountData } from "../../nakamaStrokeCountData";
import NakamaContainer from "./NakamaContainer";

/**
 * @callback onPointerdown
 *
 * @callback afterConfirmationCallback
 */
export default class NakamaGameStrokeCountContainer extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   * @param {number} x number
   * @param {number} y number
   * @param {string} level string
   */
  constructor(scene, x, y, level) {
    super(scene, x, y);
    scene.add.existing(this);
    Object.entries(NakamaContainer.StrokeCount).forEach(([index, value]) => {
        if (value.name === level) {
            this.quizzes = this.createRandomQuizList(Number(index));
        }
    });
    this.parentScene = scene;
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
          if (20 <= this.answerCounter) {
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
    // 2個ずつ問題として出すため、indexを調整
    const currentIndex = this.answerCounter * 2;
    
    const leftSide = {
      chars: this.quizzes[currentIndex].correctValues,
      strokeCount: this.quizzes[currentIndex].strokeCount,
      x: 400,
      y: 700,
      width: 100,
      height: 100,
    };
    const rightSide = {
      chars: this.quizzes[currentIndex + 1].correctValues,
      strokeCount: this.quizzes[currentIndex + 1].strokeCount,
      x: 30,
      y: 30,
      width: 100,
      height: 100,
    };

    let leftTitleText = 'おおい';
    let rightTitleText = 'すくない';

    if (this.quizzes[currentIndex].correctValues.length > 1) {
      leftTitleText = this.quizzes[currentIndex].strokeCount + '画';
      rightTitleText = this.quizzes[currentIndex + 1].strokeCount + '画';
    }

    const leftTitle = scene.add.text(306, 80, leftTitleText, {
      color: "#333333",
      fontSize: "80px",
      strokeThickness: 10,
      fontFamily: scene.registry.get("fontFamilyForStrokeCount"),
    });
    leftTitle.setOrigin(0.5, 0.5);
    this.group.add(leftTitle);
    const rightTitle = scene.add.text(718, 80, rightTitleText, {
      color: "#333333",
      fontSize: "80px",
      strokeThickness: 10,
      fontFamily: scene.registry.get("fontFamilyForStrokeCount"),
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
      }

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
        if (overlapped) {
          continue;
        }
        
        randomPoss.push({ x, y });

        if (
          leftSide.chars.length + rightSide.chars.length <=
          randomPoss.length
        ) {
          break;
        }
      }

      return randomPoss;
    };
    const poss = generatePoss();

    /**
     * @param {Phaser.GameObjects.Text} obj 
     * @param {*} pointer 
     * @param {number} dragX 
     * @param {number} dragY 
     */
    const dragCallback = (obj, pointer, dragX, dragY) => {
      if (200 <= dragY && dragY <= 600 && (dragX <= 502 || 522 <= dragX)) {
        obj.setPosition(dragX, dragY);
      }
      // console.log(dragX, dragY);
    }

    /**
     * @param {Phaser.GameObjects.Text} obj 
     * @param {*} pointer 
     * @param {number} dropX 
     * @param {number} dropY 
     */
    const dragLeaveCallback = (obj, pointer, dropX, dropY) => {
      if (200 <= dropY && dropY <= 600 && (dropX <= 502 || 522 <= dropX)) {
        obj.setPosition(dropX, dropX);
      }

      /**
       * @param {Phaser.GameObjects.Text} standardObj 
       */
      // const checkOverlappedObjCommand = (standardObj) => {
      //   if (
      //     standardObj.x <= obj.x &&
      //     standardObj.x + standardObj.width >= obj.x &&
      //     standardObj.y  <= obj.y &&
      //     standardObj.y + standardObj.height >= obj.y
      //   ) {
      //     obj.setPosition(
      //       obj.x + obj.width,
      //       obj.y + obj.height
      //     );
      //   }
      // }
      
      // leftSideObjs.forEach(checkOverlappedObjCommand);
      // rightSideObjs.forEach(checkOverlappedObjCommand);
    }

    const leftSideObjs = leftSide.chars.map((e, i) => {
      let fontSize = '120px';
      if (this.quizzes[currentIndex].correctValues.length > 1) {
        fontSize = '80px';
      }

      const obj = scene.add.text(poss[i].x, poss[i].y, e[0], {
        color: "#333333",
        fontSize: fontSize,
        fontFamily: scene.registry.get("fontFamilyForStrokeCount"),
      });
      obj.setOrigin(0.5, 0.5);
      obj.setDepth(2);
      this.group.add(obj);
      return obj
        .setInteractive({ draggable: true })
        .on("drag", (pointer, dragX, dragY) => dragCallback(obj, pointer, dragX, dragY))
        .on("dragend", (pointer, dropX, dropY) => dragLeaveCallback(obj, pointer, dropX, dropY));
    });
    const rightSideObjs = rightSide.chars.map((e, i) => {
      let fontSize = '120px';
      if (this.quizzes[currentIndex].correctValues.length > 1) {
        fontSize = '80px';
      }

      const obj = scene.add.text(
        poss[i + leftSide.chars.length].x,
        poss[i + leftSide.chars.length].y,
        e[0],
        {
          color: "#333333",
          fontSize: fontSize,
          fontFamily: scene.registry.get("fontFamilyForStrokeCount"),
        }
      );
      obj.setOrigin(0.5, 0.5);
      obj.setDepth(2);
      this.group.add(obj);
      return obj
        .setInteractive({ draggable: true })
        .on("drag", (pointer, dragX, dragY) => dragCallback(obj, pointer, dragX, dragY))
        .on("dragend", (pointer, dropX, dropY) => dragLeaveCallback(obj, pointer, dropX, dropY));
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

    let isCorrect = true;
    
    leftSideObjs.forEach((e) => {
      e.removeListener("drag");
      if (e.x >= threshouldX) {
        const maru = scene.add.sprite(e.x, e.y, "MARU");
        maru.setScale(0.2);
        maru.setOrigin(0.5, 0.5);
        this.group.add(maru);
        return;
      }
      isCorrect = false;
    });
    rightSideObjs.forEach((e) => {
      e.removeListener("drag");
      if (threshouldX >= e.x) {
        const maru = scene.add.sprite(e.x, e.y, "MARU");
        maru.setScale(0.2);
        maru.setOrigin(0.5, 0.5);
        this.group.add(maru);
        return;
      }
      isCorrect = false;
    });

    if (isCorrect) {
      this.correctedCounter += 1;
      this.parentScene.sound.play("CORRECT_SE");
    }
  };

  /**
   * @param {Number} level
   */
  createRandomQuizList = (level) => {
    const quizzes = nakamaStrokeCountData[level - 1];

    for (let i = 0; i < quizzes.length; i++) {
      const a = Math.floor(Math.random() * quizzes.length);
      const b = Math.floor(Math.random() * quizzes.length);
      [quizzes[a], quizzes[b]] = [quizzes[b], quizzes[a]];
    }

    for (let i = 0; i < quizzes.length / 2; i++) {
      const currentIndex = i * 2

      if (quizzes[currentIndex].strokeCount === quizzes[currentIndex + 1].strokeCount) {
        for (let j = i + 1; j < quizzes.length; j++) {
          if (quizzes[currentIndex].strokeCount > quizzes[j].strokeCount) {
            [quizzes[j], quizzes[currentIndex + 1]] = [quizzes[currentIndex + 1], quizzes[j]];
            break;
          }
        }
      }

      if (quizzes[currentIndex].strokeCount < quizzes[currentIndex + 1].strokeCount) {
        [quizzes[currentIndex], quizzes[currentIndex + 1]] = [quizzes[currentIndex + 1], quizzes[currentIndex]];
      }
    }
    
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
      .sprite(512, 680, "OK")
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
      .sprite(512, 680, "KOTAE")
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
      .sprite(512, 680, "GO")
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
      .text(250, 700, `${this.answerCounter + 1} / 20 問`, {
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
      this.quizzes[this.answerCounter * 2].strokeCount + '画',
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
      this.quizzes[this.answerCounter * 2 + 1].strokeCount + '画',
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
      .sprite(850, 550, "CORRECT_MOGURA")
      .setScale(0.4, 0.4);
    this.group.add(moguran);
  };
}
