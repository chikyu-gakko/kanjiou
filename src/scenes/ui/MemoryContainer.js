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
    Practice:{
      name:"practice",
      text:"練習モード"
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

  static Genre = {
    Flag: {
      name: "flag",
      text: "国・地域",
    },
    Prefecture: {
      name: "prefecture",
      text: "都道府県",
    },
    PrefecturalCapital: {
      name: "PrefecturalCapital",
      text: "県庁所在地",
    },
    MapSymbol: {
      name: "MapSymbol",
      text: "地図記号",
    },
    Job: {
      name: "job",
      text: "職業",
    },
    Subject: {
      name: "Subject",
      text: "教科",
    },
    
    Color: {
      name: "color",
      text: "色",
    },
    Vehicle: {
      name: "Vehicle",
      text: "乗り物",
    },
    MusicalInstrument: {
      name: "MusicalInstrument",
      text: "楽器",
    },
    date:{
      name: "date",
      text: "日にち",
    },
    CountPeople:{
      name: "CountPeople",
      text: "人の数え方",
    },
    CountThings:{
      name: "CountThings",
      text: "物の数え方",
    }
  };

  static Genre2 = {
    Sweets: {
      name: "sweets",
      text: "お菓子",
    },
    Vegetables:{
      name: "vegetables",
      text: "野菜",
    },
    Fruit:{
      name: "fruit",
      text: "果物",
    },
    Menu:{
      name: "menu",
      text: "メニュー",
    },
    AnimalKanji:{
      name: "AnimalKanji",
      text: "動物(漢字)",
    },
    AnimalKatakana:{
      name: "Animalkatakana",
      text: "動物(カタカナ)",
    },
    Tree:{
      name: "tree",
      text: "木",
    },
    FlowerKanji:{
      name: "FlowerKanji",
      text: "花(漢字)",
    },
    FlowerKatakana:{
      name: "FlowerKatakana",
      text: "花(カタカナ)",
    },
    Zodiac:{
      name: "zodiac",
      text: "干支",
    },
    LunarCalendar:{
      name: "LunarCalendar",
      text: "旧暦",
    },
    Constellation:{
      name:"constellation",
      text:"12星座"
    }
  }

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
      },
      Genre: {
        name: "genre",
        text: "ジャンル",
      },
      Genre2 :{
        name: "genre2",
        text: "ジャンル2",
      }
    },
  
  };  
  
};
