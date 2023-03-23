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
    Learn: {
      name: "learn",
      text: "学習",
    },
  };
  static Country = {
    Thai: {
      name: "thai",
      text: "タイ語",
    },
    Bengali: {
      name: "bengali",
      text: "ベンガル語",
    },
    Lao: {
      name: "lao",
      text: "ラオス語",
    },
    Korean: {
      name: "korean",
      text: "韓国語",
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
      Country: {
        name: "country",
        text: "何語?",
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
   * @param {string} country string
   * @param {boolean} isChallenge boolean
   * @param {string} mode string
   */
  constructor(scene, x, y, size, country, isChallenge, mode) {
    super(scene, x, y);
    scene.add.existing(this);
    switch (size) {
      case CharContainer.Size.M.name:
        this.sizeX = CharContainer.Size.M.x;
        this.sizeY = CharContainer.Size.M.y;
        break;
      case CharContainer.Size.L.name:
        this.sizeX = CharContainer.Size.L.x;
        this.sizeY = CharContainer.Size.L.y;
        break;
      default:
        this.sizeX = CharContainer.Size.S.x;
        this.sizeY = CharContainer.Size.S.y;
    }
    this.country = country;
    this.charFontSize = 60;
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
    this.correctAnsExample = undefined;
    this.correctAnsRead = undefined;
    this.mistakeAnsRead = undefined;
    this.correctAnsMean = undefined;
    this.mistakeAnsMean = undefined;
    this.wrongFlag = undefined;
    this.createAnswerComponent(scene);
  }

  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   */
  changeDifficulty = (scene) => {
    switch (this.sizeX) {
      case CharContainer.Size.S.x:
        this.setY(250);
        this.charFontSize = 70;
        this.charSpace = 100;
        break;
      case CharContainer.Size.M.x:
        this.setY(200);
        this.charFontSize = 60;
        this.charSpace = 100;
        break;
      default:
        this.setY(190);
        this.charFontSize = 50;
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
      switch (country) {
        case CharContainer.Country.Bengali.name:
          character = characterList[CharContainer.Country.Bengali.text];
          break;
        case CharContainer.Country.Lao.name:
          character = characterList[CharContainer.Country.Lao.text];
          break;
        case CharContainer.Country.Korean.name:
          character = characterList[CharContainer.Country.Korean.text];
          break;
        default:
          character = characterList[CharContainer.Country.Thai.text];
      }
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

      this.mistakeCharacter = this.charList[i].incorrect.char;
      this.correctCharacter = this.charList[i].correct.char;
      this.correctAnsExample = this.charList[i].correct.vocabulary;
      this.mistakeAnsExample = this.charList[i].incorrect.vocabulary;
      this.correctAnsRead = this.charList[i].correct.read;
      this.mistakeAnsRead = this.charList[i].incorrect.read;
      this.correctAnsMean = this.charList[i].correct.mean;
      this.mistakeAnsMean = this.charList[i].incorrect.mean;

      for (let y = 0; y < this.sizeY; y += 1) {
        for (let x = 0; x < this.sizeX; x += 1) {
          const character =
            y === answerY && x === answerX
              ? this.correctCharacter
              : this.mistakeCharacter;

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
        `${this.answerCounter} / ${this.numberOfQuestions} 問`,
        {
          fill: 0x333333,
          fontSize: 50,
          fontFamily: scene.registry.get("fontFamily"),
        }
      );
    }
  };
}
