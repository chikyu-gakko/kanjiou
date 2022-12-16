import Phaser from "phaser";

/**
 * @typedef {import("./KanjiContainer").default} KanjiContainer
 */

/**
 * @callback afterConfirmationCallback
 *
 * @callback checkCallback
 *
 * @callback updateComponentCallback
 */

/**
 * ゲーム(Scene)内時間
 *
 * 1秒ごとにチェックも行う
 */
export default class GameTime extends Phaser.Time.Clock {
  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   */
  constructor(scene) {
    super(scene);
    this.timer = 0;
  }

  /**
   * @param {string} mode string
   * @param {number} counter number of correct answers
   * @param {number} questions number of questions
   * @param {boolean} wrongFlag boolean
   * @param {afterConfirmationCallback} whenCleared callback
   */
  check = (mode, counter, questions, wrongFlag, whenCleared) => {
    if (
      (mode === "timeLimit" && (this.timer >= 60 || counter >= questions)) ||
      (mode === "timeAttack" && counter >= questions) ||
      (mode === "suddenDeath" && wrongFlag)
    ) {
      whenCleared();
    }
  };

  /**
   * @param {checkCallback} check callback
   * @param {updateComponentCallback} update callback
   */
  countTime = (check, update) => {
    this.timer += 1;
    check();
    update();
  };
}
