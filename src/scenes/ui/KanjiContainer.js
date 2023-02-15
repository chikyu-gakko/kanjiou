import Phaser from "phaser";
import { kanjiList } from "../../kanjilist.js";

/**
 * @callback correctAnimCallback
 * @callback mistakeAnimCallback
 */

/**
 * 漢字を複数画面に表示させるためのコンテナ
 *
 * 目安
 * 少ない: 3 x 6
 * ふつう: 4 x 8
 * 多い: 6 x 12
 *
 * インスタンス生成後 createKanji を呼び出してください
 */
export default class KanjiContainer extends Phaser.GameObjects.Container {
  static Size = {
    S: {
      name: "s",
      text: "少ない",
      y: 3,
      x: 6,
    },
    M: {
      name: "m",
      text: "ふつう",
      y: 4,
      x: 8,
    },
    L: {
      name: "l",
      text: "多い",
      y: 6,
      x: 12,
    },
  };
  static Mode = {
    TimeLimit: {
      name: "timeLimit",
      text: "時間制限",
    },
    TimeAttack: {
      name: "timeAttack",
      text: "タイムアタック",
    },
    SuddenDeath: {
      name: "suddenDeath",
      text: "サドンデス",
    },
  };
  static SchoolYear = {
    Grade1: {
      name: "grade1",
      text: "1年生",
    },
    Grade2: {
      name: "grade2",
      text: "2年生",
    },
    Grade3: {
      name: "grade3",
      text: "3年生",
    },
    Grade4: {
      name: "grade4",
      text: "4年生",
    },
    Grade5: {
      name: "grade5",
      text: "5年生",
    },
    Grade6: {
      name: "grade6",
      text: "6年生",
    },
    Underclassmen: {
      name: "underclassmen",
      text: "低学年",
    },
    Upperclassmen: {
      name: "upperclassmen",
      text: "高学年",
    },
    Comprehensive: {
      name: "comprehensive",
      text: "総合問題",
    },
    Middle: {
      name: "middle",
      text: "中学生",
    },
    MiddleRange: {
      name: "middleRange",
      text: "中学生範囲",
    },
    ElementalyAndMiddle: {
      name: "elementalyAndMiddle",
      text: "小学＋中学",
    },
    High: {
      name: "high",
      text: "高校生以上",
    },
    Uncommon: {
      name: "uncommon",
      text: "常用外漢字",
    },
  };
  static Category = {
    key: "category",
    value: "value",
    data: {
      Size: {
        name: "size",
        text: "文字の数",
      },
      Mode: {
        name: "mode",
        text: "ゲームモード",
      },
      SchoolYear: {
        name: "schoolYear",
        text: "出てくる漢字",
      },
      Challenge: {
        name: "challenge",
        text: "チャレンジ",
      },
    },
  };

  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   * @param {number} x number
   * @param {number} y number
   * @param {string} size sizename
   * @param {string} schoolYear string
   * @param {boolean} isChallenge boolean
   * @param {string} mode string
   */
  constructor(scene, x, y, size, schoolYear, isChallenge, mode) {
    super(scene, x, y);
    scene.add.existing(this);
    this.size = size;
    switch (size) {
      case KanjiContainer.Size.S.name:
        this.sizeX = KanjiContainer.Size.S.x;
        this.sizeY = KanjiContainer.Size.S.y;
        break;
      case KanjiContainer.Size.M.name:
        this.sizeX = KanjiContainer.Size.M.x;
        this.sizeY = KanjiContainer.Size.M.y;
        break;
      case KanjiContainer.Size.L.name:
        this.sizeX = KanjiContainer.Size.L.x;
        this.sizeY = KanjiContainer.Size.L.y;
        break;
    }
    this.schoolYear = schoolYear;
    this.kanjiFontSize = 40;
    this.kanjiSpace = 70;
    this.mode = mode;
    this.setY(200);
    this.kanjiIndex = 0;
    this.answerCounter = 0;
    this.numberOfQuestions = 10;
    this.changeDifficulty(scene);
    this.kanjiList = this.createKanjiList(schoolYear, isChallenge);
    this.answerComponent = undefined;
    this.wrongFlag = undefined;
    this.createAnswerComponent(scene);
  }

  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   */
  changeDifficulty = (scene) => {
    switch (this.sizeX) {
      case KanjiContainer.Size.S.x:
        this.setY(250);
        this.kanjiFontSize = 60;
        this.kanjiSpace = 100;
        break;
      case KanjiContainer.Size.M.x:
        this.setY(200);
        this.kanjiFontSize = 50;
        this.kanjiSpace = 100;
        break;
      default:
        this.setY(190);
        this.kanjiFontSize = 40;
        this.kanjiSpace = 70;
    }
    this.setSize(
      this.sizeX * this.kanjiSpace - this.kanjiFontSize,
      this.sizeY * this.kanjiSpace - this.kanjiFontSize
    );
    this.setX(scene.game.canvas.width / 2 - this.width / 2);
  };

  /**
   * @param {string} schoolYear string
   * @param {boolean} isChallenge boolean
   * @returns {string[][]} kanjilist string[][]
   */
  createKanjiList = (schoolYear, isChallenge) => {
    let kanji = [];
    if (isChallenge) {
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
    } else {
      switch (schoolYear) {
        case KanjiContainer.SchoolYear.Grade1.name:
          kanji = kanjiList[KanjiContainer.SchoolYear.Grade1.text];
          break;
        case KanjiContainer.SchoolYear.Grade2.name:
          kanji = kanjiList[KanjiContainer.SchoolYear.Grade2.text];
          break;
        case KanjiContainer.SchoolYear.Grade3.name:
          kanji = kanjiList[KanjiContainer.SchoolYear.Grade3.text];
          break;
        case KanjiContainer.SchoolYear.Grade4.name:
          kanji = kanjiList[KanjiContainer.SchoolYear.Grade4.text];
          break;
        case KanjiContainer.SchoolYear.Grade5.name:
          kanji = kanjiList[KanjiContainer.SchoolYear.Grade5.text];
          break;
        case KanjiContainer.SchoolYear.Grade6.name:
          kanji = kanjiList[KanjiContainer.SchoolYear.Grade6.text];
          break;
        case KanjiContainer.SchoolYear.Underclassmen.name:
          kanji = kanjiList[KanjiContainer.SchoolYear.Underclassmen.text];
          break;
        case KanjiContainer.SchoolYear.Upperclassmen.name:
          kanji = kanjiList[KanjiContainer.SchoolYear.Upperclassmen.text];
          break;
        case KanjiContainer.SchoolYear.Comprehensive.name:
          kanji = kanjiList[KanjiContainer.SchoolYear.Comprehensive.text];
          break;
        case KanjiContainer.SchoolYear.Middle.name:
          kanji = kanjiList[KanjiContainer.SchoolYear.Middle.text];
          break;
        case KanjiContainer.SchoolYear.MiddleRange.name:
          kanji = kanjiList[KanjiContainer.SchoolYear.MiddleRange.text];
          break;
        case KanjiContainer.SchoolYear.ElementalyAndMiddle.name:
          kanji = kanjiList[KanjiContainer.SchoolYear.ElementalyAndMiddle.text];
          break;
        case KanjiContainer.SchoolYear.High.name:
          kanji = kanjiList[KanjiContainer.SchoolYear.High.text];
          break;
        case KanjiContainer.SchoolYear.Uncommon.name:
          kanji = kanjiList[KanjiContainer.SchoolYear.Uncommon.text];
          break;
      }
      kanji = this.shuffleKanjiList(kanji);
    }
    return kanji;
  };

  /**
   * @param {string[][]} kanjilist string[][]
   * @returns {string[][]} kanjilist string[][]
   */
  shuffleKanjiList = (kanjilist) => {
    let i = kanjilist.length;
    while (i > 1) {
      i -= 1;
      const j = Math.floor(Math.random() * i);
      [kanjilist[i], kanjilist[j]] = [kanjilist[j], kanjilist[i]];
    }
    return kanjilist;
  };

  /**
   * 漢字を選んだときの挙動を設定する
   *
   * @param {Phaser.Scene} scene Phaser.Scene
   * @param {string} correctKey string
   * @param {string} butKey string
   * @param {correctAnimCallback} correctAnim
   * @param {mistakeAnimCallback} mistakeAnim
   */
  createKanji = (scene, correctKey, butKey, correctAnim, mistakeAnim) => {
    const answerY = Math.floor(Math.random() * this.sizeY);
    const answerX = Math.floor(Math.random() * this.sizeX);
    const kanjiArray = [];
    const i = this.kanjiIndex;

    // 正解/不正解SE
    const correct = scene.sound.add(correctKey);
    const but = scene.sound.add(butKey);

    this.removeAll(true);

    for (let y = 0; y < this.sizeY; y += 1) {
      for (let x = 0; x < this.sizeX; x += 1) {
        const kanji =
          y === answerY && x === answerX
            ? this.kanjiList[i][1]
            : this.kanjiList[i][0];

        kanjiArray.push(
          scene.add
            .text(x * this.kanjiSpace, y * this.kanjiSpace, kanji, {
              color: "#ffffff",
              fontSize: this.kanjiFontSize,
              fontFamily: scene.registry.get("kanjiFontFamily"),
            })
            .setInteractive()
        );

        if (y === answerY && x === answerX) {
          kanjiArray[kanjiArray.length - 1].once("pointerdown", () => {
            correctAnim();
            correct.play();
            this.answerCounter += 1;
            this.createAnswerComponent(scene);
            setTimeout(() => {
              this.createKanji(
                scene,
                correctKey,
                butKey,
                correctAnim,
                mistakeAnim
              );
            }, 1400);
          });
        } else {
          kanjiArray[kanjiArray.length - 1].once("pointerdown", () => {
            mistakeAnim();
            but.play();
            this.wrongFlag = true;
            setTimeout(() => {
              this.createKanji(
                scene,
                correctKey,
                butKey,
                correctAnim,
                mistakeAnim
              );
            }, 1400);
          });
        }
      }
    }
    this.add(kanjiArray);

    this.kanjiIndex += 1;
    if (this.kanjiIndex >= this.kanjiList.length) {
      this.kanjiList = this.shuffleKanjiList(this.kanjiList);
      this.kanjiIndex %= this.kanjiList.length;
    }
  };

  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   */
  createAnswerComponent = (scene) => {
    if (this.answerComponent) this.answerComponent.destroy();

    if (this.mode === "suddenDeath") {
      this.answerComponent = scene.add.text(
        155,
        671,
        `正解数：${this.answerCounter}問`,
        {
          fill: 0x333333,
          fontSize: 50,
          fontFamily: scene.registry.get("fontFamily"),
        }
      );
    } else if (this.mode === "timeAttack" || this.mode === "timeLimit") {
      this.answerComponent = scene.add.text(
        155,
        671,
        `残り：${this.numberOfQuestions - this.answerCounter}問`,
        {
          fill: 0x333333,
          fontSize: 50,
          fontFamily: scene.registry.get("fontFamily"),
        }
      );
    }
  };
}
