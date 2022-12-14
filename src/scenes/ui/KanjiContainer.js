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
 */
export default class KanjiContainer extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   * @param {number} x number
   * @param {number} y number
   * @param {number} sizeX number
   * @param {number} sizeY number
   * @param {string} schoolYear string
   * @param {boolean} isChallenge boolean
   * @param {string} mode string
   */
  constructor(scene, x, y, sizeX, sizeY, schoolYear, isChallenge, mode) {
    super(scene, x, y);
    scene.add.existing(this);
    this.sizeX = sizeX;
    this.sizeY = sizeY;
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
    this.createAnswerComponent(scene);
  }

  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   */
  changeDifficulty = (scene) => {
    switch (this.sizeX) {
      case 6:
        this.setY(250);
        this.kanjiFontSize = 50;
        this.kanjiSpace = 100;
        break;
      case 8:
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
      kanji = kanjiList[schoolYear];
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
              fill: 0x333333,
              fontSize: this.kanjiFontSize,
              fontFamily: scene.registry.get("fontFamily"),
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
