import Phaser from "phaser";
import { characterList } from "../../characterlist.js";

/**
 * @callback correctAnimCallback
 * @callback mistakeAnimCallback
 */

/**
 * @template T
 * @callback commentAnimCallback
 * @param {T} args
 */

/**
 * 複数の文字を画面に表示させるためのコンテナ
 *
 * 目安
 * 少ない: 3 x 6
 * ふつう: 4 x 8
 * 多い: 6 x 12
 *
 * インスタンス生成後 createChar を呼び出してください
 */
export default class CharContainer extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   * @param {number} x number
   * @param {number} y number
   * @param {number} sizeX number
   * @param {number} sizeY number
   * @param {string} country string
   * @param {boolean} isChallenge boolean
   * @param {string} mode string
   */
  constructor(scene, x, y, sizeX, sizeY, country, isChallenge, mode) {
    super(scene, x, y);
    scene.add.existing(this);
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.country = country;
    this.charFontSize = 40;
    this.charSpace = 70;
    this.mode = mode;
    this.setY(200);
    this.charIndex = 0;
    this.answerCounter = 0;
    this.numberOfQuestions = 10;
    this.changeDifficulty(scene);
    this.charList = this.createCharList(country, isChallenge);
    this.answerComponent = undefined;
    this.mistakeCharacter = undefined;
    this.correctCharacter = undefined;
    this.mistakeAnsExample = undefined;
    this.wrongAnsExample = undefined;
    this.tips = undefined;
    this.wrongFlag = undefined;
    this.createAnswerComponent(scene);
  }

  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   */
  changeDifficulty = (scene) => {
    switch (this.sizeX) {
      case 6:
        this.setY(250);
        this.charFontSize = 50;
        this.charSpace = 100;
        break;
      case 8:
        this.setY(200);
        this.charFontSize = 50;
        this.charSpace = 100;
        break;
      default:
        this.setY(190);
        this.charFontSize = 40;
        this.charSpace = 70;
    }
    this.setSize(
      this.sizeX * this.charSpace - this.charFontSize,
      this.sizeY * this.charSpace - this.charFontSize
    );
    this.setX(scene.game.canvas.width / 2 - this.width / 2);
  };

  /**
   * @param {string} country string
   * @param {boolean} isChallenge boolean
   * @returns {string[][]} charlist string[][]
   */
  createCharList = (country, isChallenge) => {
    let character = [];
    if (isChallenge) {
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
      character = character;
    } else {
      character = characterList[country];
      character = character;
      character = this.shuffleCharList(character);
    }
    return character;
  };

  /**
   * @param {string[][]} charlist string[][]
   * @returns {string[][]} charlist string[][]
   */
  shuffleCharList = (charlist) => {
    let i = charlist.length;
    while (i > 1) {
      i -= 1;
      const j = Math.floor(Math.random() * i);
      [charlist[i], charlist[j]] = [charlist[j], charlist[i]];
    }
    return charlist;
  };

  /**
   * 漢字を選んだときの挙動を設定する
   *
   * @param {Phaser.Scene} scene Phaser.Scene
   * @param {string} correctKey string
   * @param {string} butKey string
   * @param {correctAnimCallback} correctAnim callback
   * @param {mistakeAnimCallback} mistakeAnim callback
   * @param {commentAnimCallback<any>} commentAnim callback
   */
  createChar = (
    scene,
    correctKey,
    butKey,
    correctAnim,
    mistakeAnim,
    commentAnim
  ) => {
    {
      const answerY = Math.floor(Math.random() * this.sizeY);
      const answerX = Math.floor(Math.random() * this.sizeX);
      const characterArray = [];
      const i = this.charIndex;

      // 正解/不正解SE
      const correct = scene.sound.add(correctKey);
      const but = scene.sound.add(butKey);

      this.removeAll(true);

      this.mistakeCharacter = this.charList[i][1];
      this.correctCharacter = this.charList[i][2];
      this.tips = this.charList[i][3];
      this.correctAnsExample = this.charList[i][4];
      this.wrongAnsExample = this.charList[i][5];

      for (let y = 0; y < this.sizeY; y += 1) {
        for (let x = 0; x < this.sizeX; x += 1) {
          const character =
            y === answerY && x === answerX
              ? this.charList[i][1]
              : this.charList[i][2];

          characterArray.push(
            scene.add
              .text(x * this.charSpace, y * this.charSpace, character, {
                fill: 0x333333,
                fontSize: this.charFontSize,
                fontFamily: scene.registry.get("fontFamily"),
              })
              .setInteractive()
          );

          if (y === answerY && x === answerX) {
            characterArray[characterArray.length - 1].once(
              "pointerdown",
              () => {
                correctAnim();
                correct.play();
                this.answerCounter += 1;
                this.createAnswerComponent(scene);
                if (this.mode === "learn") {
                  setTimeout(() => {
                    commentAnim();
                  }, 1500);
                }
                setTimeout(
                  () => {
                    this.createChar(
                      scene,
                      correctKey,
                      butKey,
                      correctAnim,
                      mistakeAnim,
                      commentAnim
                    );
                  },
                  this.mode === "learn" ? 2900 : 1400
                );
              }
            );
          } else {
            characterArray[characterArray.length - 1].once(
              "pointerdown",
              () => {
                mistakeAnim();
                but.play();
                this.wrongFlag = true;
                if (this.mode === "learn") {
                  setTimeout(() => {
                    commentAnim();
                  }, 1500);
                }
                setTimeout(
                  () => {
                    this.createChar(
                      scene,
                      correctKey,
                      butKey,
                      correctAnim,
                      mistakeAnim,
                      commentAnim
                    );
                  },
                  this.mode === "learn" ? 2900 : 1400
                );
              }
            );
          }
        }
      }
      this.add(characterArray);

      this.charIndex += 1;
      if (this.charIndex >= this.charList.length) {
        this.charList = this.shuffleCharList(this.charList);
        this.charIndex %= this.charList.length;
      }
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
    } else if (
      this.mode === "timeAttack" ||
      this.mode === "timeLimit" ||
      this.mode === "learn"
    ) {
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
