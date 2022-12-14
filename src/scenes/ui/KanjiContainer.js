import Phaser from "phaser";
import { kanjiList } from "../../kanjilist.js";

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
   */
  constructor(scene, x, y, sizeX, sizeY, schoolYear, isChallenge) {
    super(scene, x, y);
    scene.add.existing(this);
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.kanjiFontSize = 40;
    this.kanjiSpace = 70;
    this.setY(200);

    this.changeDifficulty(scene);
    this.kanjiList = this.createKanjiList(schoolYear, isChallenge);
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

}
