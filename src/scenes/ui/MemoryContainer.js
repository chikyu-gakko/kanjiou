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
export default class MemoryContainer extends Phaser.GameObjects.Container {

  static Mode = {
    Flag: {
      name: "flag",
      text: "国旗",
    },
    Color: {
      name: "color",
      text: "色(漢字)",
    },
    Job: {
      name: "job",
      text: "職業",
    },
    Prefecture: {
      name: "prefecture",
      text: "都道府県",
    },
    versus: {
      name: "versus",
      text: "対戦モード",
    },
  };

  static Level = {
    Level1: {
      name: 1,
      text: "レベル1",
    },
    Level2: {
      name: 2,
      text: "レベル2",
    },
    Level3: {
      name: 3,
      text: "レベル3",
    },
  };

  static Category = {
    key: "category",
    value: "value",
    data: {
      Mode: {
        name: "mode",
        text: "ゲームモード",
      },
      Level: {
        name: "level",
        text: "漢字レベル",
      }
    },
  };  
}
