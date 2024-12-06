import Phaser from "phaser";
import { nationalFlags } from "../data/countries";
import { jobs } from "../data/jobs";
import { CountPeople } from "../data/CountPeople";
import { constellations } from "../data/constellations";
import { Prefecture } from "../data/prefecture";
import { PrefecturalCapital } from "../data/PrefecturalCapital";
import { calendar } from "../data/calendar";
import { CountThing } from "../data/CountThing";
import { Day } from "../data/Day";
import { Subject } from "../data/Subject";
import { Color } from "../data/Color";
import { vehicle } from "../data/vehicle";
import { instrument } from "../data/instrument";
import { sweets } from "../data/sweets";
import { vegetable } from "../data/vegetable";
import { menu } from "../data/menu";
import { animal } from "../data/animal";
import { SeaCreature } from "../data/Sea​​Creature";
import { bard } from "../data/bard";
import { fruits } from "../data/fruits";
import { plant } from "../data/plant";
import { flower } from "../data/flower";
import { MapSymbol } from "../data/MapSymbol";
import { zodiac } from "../data/zodiac";

import SoundButton from "../components/sound_button";
import TimeStopLabel from "./ui/TimerStopLabel.js";
import BackGround from "./ui/BackGround";
import { LEVEL1,LEVEL2,LEVEL3 } from "./constants/level";
import { COLOR_LIGHT_BLACK, COLOR_LIGHT_GRAY, COLOR_PALE_GREEN, COLOR_WHITE } from "./constants/color";

const DEBUG_MODE = false;
const ERROR_MESSAGE_FOR_LEVEL = 'invalid level.';
const ERROR_MESSAGE_FOR_MEMORY_CARDS_COUNT = 'count out of bounds for cardsData length.';

const CARD_BACK_SIDE_IMAGE_KEY = '3:2Mogra';
const ANIMATION_DURATION_FLIP = 900;


const FLIPED_AREA = {
  MEMORY_CARD: 'national',
  RIGTH_CARD: 'RIGTH_CARD',
}

/**
 * @typedef {Object} cardData
 * @property {string} LeftCard
 * @property {string} id
 * @property {string} RightCard
 */
export default class MemoryGame extends Phaser.Scene {
  constructor() {
    super({
      key: "memory_game",
      active: false
    });

    this.cardsData = []; //カードのデータ用配列

    this.RightCardsData = [];
    this.cardsCount = 0;

    this.gameConfig = {
      level: 0,
    };

    this.maxTryCount = 0;
    this.triedCount = 0;

    this.TryLimitComponent = undefined;

    this.nowPlayerComponent = undefined;
    this.player1PointComponent = undefined;
    this.player2PointComponent = undefined;

    this.flippedAreas = {};

    this.leftCardType = "";
    this.rightCardType = "";

    this.DoubleExeFlag; //create関数に2回実行阻止
  }

  preload = () => {
      this.DoubleExeFlag = false;    
      
        //左のカード用写真を登録
        this.cardsData.forEach((cardData) => {
          this.load.image(cardData.id + "_LEFT", cardData.LeftCard);          
        });

        //右のカード用写真を登録
        this.cardsData.forEach((cardData) => {
          this.load.image(cardData.id + "_RIGHT", cardData.RightCard);
        });    

      this.load.image(CARD_BACK_SIDE_IMAGE_KEY, 'assets/img/card/card_back.png');
      this.load.image("BackCarpet", 'assets/img/carpet.png');

      this.load.image("LeftPattern", 'assets/img/pattern.png');
      this.load.image("RightPattern", 'assets/img/pattern.png');

      this.load.audio("CardSe", "assets/audio/card_se.mp3");

  }


  /**
   * @typedef {Object} MemoryGameConfig
   * @property {number} level
   * @property {string} level
   * @property {string} mode
   * @property {string} genre
   * @param {MemoryGameConfig} data 
   */
  init = (data) => {
    if (DEBUG_MODE) {
      data = {
        level: LEVEL1,
        mode: "",
        genre: ""
      }
    }

    this.prevSceneData = {
      level: data.level,
      mode: data.mode,
      genre: data.genre
    };

    //ジャンルの設定
    switch (this.prevSceneData.genre) {
      case "flag":
        this.cardsData = nationalFlags;
        this.rightCardType = "char";
        this.leftCardType = "img";
        this.leftFontSize = 80;
        this.rightFontSize = 80;
        break
      case "job":
        this.cardsData = jobs;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "constellation":
        this.cardsData = constellations;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "CountPeople":
        this.cardsData = CountPeople;
        this.rightCardType = "char";
        this.leftCardType = "char";
        this.leftFontSize = 60;
        this.rightFontSize = 35;
        break
      case "prefecture":
        this.cardsData = Prefecture;
        this.rightCardType = "char";
        this.leftCardType = "char";
        this.leftFontSize = 60;
        this.rightFontSize = 45;
        break
      case "PrefecturalCapital":
        this.cardsData = PrefecturalCapital;
        this.rightCardType = "char";
        this.leftCardType = "char";
        this.leftFontSize = 60;
        this.rightFontSize = 50;
        break
      case "Subject":
        this.cardsData = Subject;
        this.rightCardType = "img";
        this.leftCardType = "char";
        this.leftFontSize = 40;
        break
      case "color":
        this.cardsData = Color;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "Vehicle":
        this.cardsData = vehicle;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "Instrument":
        this.cardsData = instrument;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "sweets":
        this.cardsData = sweets;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "vegetables":
        this.cardsData = vegetable;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "menu":
        this.cardsData = menu;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "animal":
        this.cardsData = animal;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "SeaAnimals":
        this.cardsData = SeaCreature;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "bard":
        this.cardsData = bard;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "fruit":
        this.cardsData = fruits;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "plant":
        this.cardsData = plant;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "flower":
        this.cardsData = flower;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "zodiac":
        this.cardsData = zodiac;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "MapSymbol":
        this.cardsData = MapSymbol;
        this.rightCardType = "img";
        this.leftCardType = "img";
        break
      case "day":
        this.cardsData = Day;
        this.rightCardType = "char";
        this.leftCardType = "char";
        this.leftFontSize = 60;
        this.rightFontSize = 30;
        break
      case "CountThing":
        this.cardsData = CountThing;
        this.rightCardType = "char";
        this.leftCardType = "char";
        this.leftFontSize = 70;
        this.rightFontSize = 55;
        break
      case "LunarCalendar":
        this.cardsData = calendar;
        this.rightCardType = "char";
        this.leftCardType = "img";
        this.rightFontSize = 60;
        break
    }
    
    //初期値の設定
    this.gameConfig = {
      level: data.level,
      mode: data.mode
    };
    this.DoubleExeFlag = false;

    if(this.DoubleExeFlag == false){
      this.DoubleExeFlag = true;
      this.triedCount = 0;

      //レベルごとに最大回数を指定
      this.maxTryCount = this.levelToMaxTryCount(this.gameConfig.level)

      //レベルごとにカード数を指定
      this.cardsCount = 0;
      this.cardsCount = this.levelToCardsCount(this.gameConfig.level);
      
      //右側のカードをランダムに並び変える
      this.cardsData = this.randomlySelectCards(this.cardsCount);
      this.RightCardsData = this.mixedUpArray(this.cardsData.map(({
        RightCard
      }) => RightCard));
      this.RightCardImg = this.mixedUpArray(this.cardsData.map((id) => id));

      //左側のカードをランダムに並び変える
      this.LeftCardChar = this.mixedUpArray(this.cardsData.map(({
        LeftCard
      }) => LeftCard));

      this.createCardsTextures();
    }

    this.nowPlayerName = "プレイヤー1の番";
    this.player1PointCounter = 0;
    this.player2PointCounter = 0;

    this.leftFontSize = 0;
    this.rightFontSize = 0;

    this.flippedComponents = [];

    this.fontFamily = this.registry.get("fontFamily");

    this.flipLeftCard = false;
    this.flipRightCard = false;
  }

  create = () => {

    //UIの生成
    if(this.DoubleExeFlag == false){
      this.DoubleExeFlag = true;
      this.createBackGround();
      this.createCarpet();
      this.createSoundButton();

      this.createGameStopLabel();
      
      //一時停止画面の処理
      this.events.on("resume", (scene, data) => {
        switch (data.status) {
          case "restart":
            this.sound.stopAll();
            this.scene.stop();
            
            this.scene.start("memory_game", {
              mode:this.prevSceneData.mode,
              genre:this.prevSceneData.genre,
              level: this.prevSceneData.level
            });
            break;
          case "return-to-top":
            this.sound.stopAll();
            this.scene.stop();
            this.scene.start("game_menu");
            break;
          case "return-to-setting":
            this.sound.stopAll();
            this.scene.stop();
            this.scene.start("MemoryModeSetting",{
              mode:this.prevSceneData.mode
            });
            break;
          default:
        }
      });
    
      //練習モードが選択されたときのみ実行
      if (this.prevSceneData.mode == "practice") {
        this.createTryCountText();
      }

      //対戦モードが選択されたときのみ実行
      if (this.prevSceneData.mode == "versus") {
        this.createPlayer1PointBack();
        this.createPlayer2PointBack();
        this.createPleyerNameText();
        this.Player1PointCountText();
        this.Player2PointCountText();
      }
      this.createLeftCards(); //左カード表示
      this.createRightCards(); //右カード表示
    }
  }

  initFlippedArea = () => {
    this.flippedAreas = {};
  }

  createCardsTextures = () => {
    const IMAGE_SIZE_WIDTH = 300;
    const IMAGE_SIZE_HEIGHT = 200;

    const gridSize = this.gridSizeByLevel(this.gameConfig.level);
    this.consoleLogForDebug(gridSize);

    const GLOBAL_START_POSITION_X = 0;
    const GLOBAL_START_POSITION_Y = 0;

    //右側カードのテクスチャ
    this.RightCardsData.forEach((RightCardsData) => {

      let localStartPositionXForText = GLOBAL_START_POSITION_X + IMAGE_SIZE_WIDTH / 2 - (this.rightFontSize * RightCardsData.length / 2);
      let localStartPositionYForText = GLOBAL_START_POSITION_Y + IMAGE_SIZE_HEIGHT / 2 - this.rightFontSize / 2;

      const MemoryGameBackground = this.add
        .rectangle(GLOBAL_START_POSITION_X, GLOBAL_START_POSITION_Y, IMAGE_SIZE_WIDTH, IMAGE_SIZE_HEIGHT, COLOR_LIGHT_GRAY.toNumber(), 1)
        .setOrigin(0, 0)
        .setDisplaySize(IMAGE_SIZE_WIDTH, IMAGE_SIZE_HEIGHT);

      //カードに文字を追加
      const RightCard = this.add
        .text(
          localStartPositionXForText,
          localStartPositionYForText,
          RightCardsData, {
            color: COLOR_LIGHT_BLACK.toString(),
            fontSize: `${this.rightFontSize}px`,
            fontFamily: "KleeOneForStrokeCount"
          }
        )
        .setOrigin(0, 0).setPadding(0, 4, 0, 0)

      const renderTexture = this.add.renderTexture(
        GLOBAL_START_POSITION_X,
        GLOBAL_START_POSITION_Y,
        IMAGE_SIZE_WIDTH,
        IMAGE_SIZE_HEIGHT,
      );
      renderTexture.draw(MemoryGameBackground);
      renderTexture.draw(RightCard);
      renderTexture.saveTexture(RightCardsData);

      MemoryGameBackground.destroy();
      RightCard.destroy();
      renderTexture.destroy();
    })


    //左側カードのテクスチャ
    this.LeftCardChar.forEach((LeftCardChar) => {

      let localStartPositionXForText = GLOBAL_START_POSITION_X + IMAGE_SIZE_WIDTH / 2 - (this.leftFontSize * LeftCardChar.length / 2);
      let localStartPositionYForText = GLOBAL_START_POSITION_Y + IMAGE_SIZE_HEIGHT / 2 - this.leftFontSize / 2;

      const MemoryGameBackground = this.add
        .rectangle(GLOBAL_START_POSITION_X, GLOBAL_START_POSITION_Y, IMAGE_SIZE_WIDTH, IMAGE_SIZE_HEIGHT, COLOR_LIGHT_GRAY.toNumber(), 1)
        .setOrigin(0, 0)
        .setDisplaySize(IMAGE_SIZE_WIDTH, IMAGE_SIZE_HEIGHT);

      const RightCard = this.add
        .text(
          localStartPositionXForText,
          localStartPositionYForText,
          LeftCardChar, {
            color: COLOR_LIGHT_BLACK.toString(),
            fontSize: `${this.leftFontSize}px`,
            fontFamily: "KleeOneForStrokeCount"
          }
        )
        .setOrigin(0, 0).setPadding(0, 4, 0, 0)

      const renderTexture = this.add.renderTexture(
        GLOBAL_START_POSITION_X,
        GLOBAL_START_POSITION_Y,
        IMAGE_SIZE_WIDTH,
        IMAGE_SIZE_HEIGHT,
      );
      renderTexture.draw(MemoryGameBackground);
      renderTexture.draw(RightCard);
      renderTexture.saveTexture(LeftCardChar);

      MemoryGameBackground.destroy();
      RightCard.destroy();
      renderTexture.destroy();
    })
  }

  /**
   * @param {number} level
   */
  levelToCardsCount = (level) => {

    const LEVEL1_NATIONAL_FLAGS_COUNT = 6;
    const LEVEL2_NATIONAL_FLAGS_COUNT = 9;
    const LEVEL3_NATIONAL_FLAGS_COUNT = 12;

    switch (level) {
      case LEVEL1:
        return LEVEL1_NATIONAL_FLAGS_COUNT;
      case LEVEL2:
        return LEVEL2_NATIONAL_FLAGS_COUNT;
      case LEVEL3:
        return LEVEL3_NATIONAL_FLAGS_COUNT;
      default:
        throw new Error(ERROR_MESSAGE_FOR_LEVEL);
    }
  }

  /**
   * @param {number} level
   */
  levelToMaxTryCount = (level) => {
    const LEVEL1_MAX_TRY_COUNT = 15;
    const LEVEL2_MAX_TRY_COUNT = 25;
    const LEVEL3_MAX_TRY_COUNT = 40;

    switch (level) {
      case LEVEL1:
        return LEVEL1_MAX_TRY_COUNT;
      case LEVEL2:
        return LEVEL2_MAX_TRY_COUNT;
      case LEVEL3:
        return LEVEL3_MAX_TRY_COUNT;
      default:
        throw new Error(ERROR_MESSAGE_FOR_LEVEL);
    }
  }

  /**
   * @typedef {Object} ImageSize
   * @property {number} width
   * @property {number} height
   * 
   * @param {number} level
   * @returns {ImageSize}
   */
  imageSizeByLevel = (level) => {
    switch (level) {
      case LEVEL1:
        return {
          width: 177, height: 118
        };
      case LEVEL2:
      case LEVEL3:
        return {
          width: 135, height: 90
        };
      default:
        throw new Error(ERROR_MESSAGE_FOR_LEVEL);
    }
  }

  /**
   * @typedef {Object} GridSize
   * @property {number} maxColumn
   * @property {number} maxRow
   * 
   * @param {number} level
   * @returns {GridSize}
   */
  gridSizeByLevel = (level) => {
    switch (level) {
      case LEVEL1:
        return {
          maxColumn: 2, maxRow: 3
        };
      case LEVEL2:
        return {
          maxColumn: 3, maxRow: 3
        };
      case LEVEL3:
        return {
          maxColumn: 3, maxRow: 4
        };
      default:
        throw new Error(ERROR_MESSAGE_FOR_LEVEL);
    }
  }

  createBackGround = () => {
    new BackGround(this, {
      color: COLOR_PALE_GREEN.toNumber(),
      alpha: 1
    });
  }


  /**
   * @param {number} count 
   * @returns {cardData[]}
   */
  randomlySelectCards = (count) => {
    if (count > this.cardsData.length) {
      throw new Error(ERROR_MESSAGE_FOR_MEMORY_CARDS_COUNT);
    }

    const result = [];

    while (result.length < count) {
      const randomIndex = Math.floor(Math.random() * this.cardsData.length);
      const randomElement = this.cardsData[randomIndex];

      if (!result.includes(randomElement)) {
        result.push(randomElement);
      }
    }

    return result;
  }

  /**
   * 
   * @param {any[]} array 
   * @returns {any[]}
   */
  mixedUpArray = (array) => {
    const result = array;

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  isFlippedAll = () => {    
    return this.flippedComponents.length >= this.levelToCardsCount(this.gameConfig.level) * 2;    
  }

  isGameOver = () => {
    return this.triedCount >= this.maxTryCount;
  }

  createLeftCards = () => {
    
    const GLOBAL_START_POSITION_X = 40;
    const GLOBAL_START_POSITION_Y = 250;
    const GAP = 16;

    const imageSize = this.imageSizeByLevel(this.gameConfig.level);
    const gridSize = this.gridSizeByLevel(this.gameConfig.level);
    this.consoleLogForDebug(imageSize);
    this.consoleLogForDebug(gridSize);



    this.cardsData.forEach((cardData, index) => {
      const gridGap = (gridPosition, maxGridPosition) => {
        return gridPosition > 0 && gridPosition < maxGridPosition ? GAP * gridPosition : 0;
      }


      const column = index % gridSize.maxColumn;
      const row = Math.floor(index / gridSize.maxColumn);

      const localStartPositionX = column * imageSize.width + imageSize.width / 2 + gridGap(column, gridSize.maxColumn) + GLOBAL_START_POSITION_X;
      const localStartPositionY = row * imageSize.height + imageSize.height / 2 + gridGap(row, gridSize.maxRow) + GLOBAL_START_POSITION_Y;

      const gameCardComponent = this.add
        .sprite(localStartPositionX, localStartPositionY, CARD_BACK_SIDE_IMAGE_KEY)
        .setDisplaySize(imageSize.width, imageSize.height)
        .setInteractive({
          cursor: 'pointer'
        });
      gameCardComponent.depth = 2;
      let isFinishedFlipAnimation = true;

      gameCardComponent.on(
        'pointerdown',
        () => {

          //左カードをめくったら3秒間、クリックを受け付けない
          if(!this.flipLeftCard){
              this.flipLeftCard = true;

              if (!isFinishedFlipAnimation || this.flippedComponents.includes(gameCardComponent)) {
                return;
              }
              const CardSe = this.sound.add("CardSe");
              CardSe.play();

              isFinishedFlipAnimation = false;
              

              if (this.leftCardType == "img") {
                //第二引数 cardData.id = imageの名前
                this.flipAnimation(
                  gameCardComponent,
                  cardData.id + "_LEFT",
                  gameCardComponent.scaleX,
                  gameCardComponent.scaleY,
                )
              } else if (this.leftCardType == "char") {
                this.flipAnimation(
                  gameCardComponent,
                  cardData.LeftCard,
                  gameCardComponent.scaleX,
                  gameCardComponent.scaleY,
                )
              }

              this.flippedAreas[FLIPED_AREA.MEMORY_CARD] = cardData;
              this.flippedComponents.push(gameCardComponent);

              setTimeout(() => isFinishedFlipAnimation = true, ANIMATION_DURATION_FLIP)

              if (!(FLIPED_AREA.RIGTH_CARD in this.flippedAreas) || !(FLIPED_AREA.MEMORY_CARD in this.flippedAreas)) {
                return;
              }          
            
              this.validateNeurastheniaMatch();            
          }
                    
        },
        this
      )
    })
  }


  createRightCards = () => {

    const globalStartPositionXByLevel = (level) => {
      switch (level) {
        case LEVEL1:
          return 600;
        case LEVEL2:
        case LEVEL3:
          return 548;
        default:
          throw new Error(ERROR_MESSAGE_FOR_LEVEL)
      }
    }

    const GLOBAL_START_POSITION_X = globalStartPositionXByLevel(this.gameConfig.level);
    const GLOBAL_START_POSITION_Y = 250;
    const GAP = 16;

    const imageSize = this.imageSizeByLevel(this.gameConfig.level);
    const gridSize = this.gridSizeByLevel(this.gameConfig.level);
    this.consoleLogForDebug(imageSize);
    this.consoleLogForDebug(gridSize);

    let RightCardArray;
    if (this.rightCardType == "img") {
      RightCardArray = this.RightCardImg
    } else if (this.rightCardType == "char") {
      RightCardArray = this.RightCardsData
    }

    RightCardArray.forEach((RightCardImg, index) => {

      const gridGap = (gridPosition, maxGridPosition) => {
        return gridPosition > 0 && gridPosition < maxGridPosition ? GAP * gridPosition : 0;
      }

      const column = index % gridSize.maxColumn;
      const row = Math.floor(index / gridSize.maxColumn);

      const localStartPositionX = column * imageSize.width + imageSize.width / 2 + gridGap(column, gridSize.maxColumn) + GLOBAL_START_POSITION_X;
      const localStartPositionY = row * imageSize.height + imageSize.height / 2 + gridGap(row, gridSize.maxRow) + GLOBAL_START_POSITION_Y;

      const RigthCardComponent = this.add
        .sprite(localStartPositionX, localStartPositionY, CARD_BACK_SIDE_IMAGE_KEY)
        .setDisplaySize(imageSize.width, imageSize.height)
        .setInteractive({
          cursor: 'pointer'
        });
      RigthCardComponent.depth = 2;

      let isFinishedFlipAnimation = true;

      RigthCardComponent.on(
        'pointerdown',
        () => {

          //左カードをめくったら3秒間、クリックを受け付けない
          if(!this.flipRightCard){
            this.flipRightCard = true;

            if (!isFinishedFlipAnimation || this.flippedComponents.includes(RigthCardComponent)) {
              return;
            }
            const CardSe = this.sound.add("CardSe");
            CardSe.play();
            isFinishedFlipAnimation = false;

            //カード用のデータ判別(文字・写真)
            if (this.rightCardType == "img") {
              this.flipAnimation(
                RigthCardComponent,
                RightCardImg.id + "_RIGHT",
                RigthCardComponent.scaleX,
                RigthCardComponent.scaleY,
              )
              this.flippedAreas[FLIPED_AREA.RIGTH_CARD] = RightCardImg.RightCard;
            } else if (this.rightCardType == "char") {
              this.flipAnimation(
                RigthCardComponent,
                RightCardImg,
                RigthCardComponent.scaleX,
                RigthCardComponent.scaleY,
              )
              this.flippedAreas[FLIPED_AREA.RIGTH_CARD] = RightCardImg;
            }

            this.flippedComponents.push(RigthCardComponent);
            setTimeout(() => isFinishedFlipAnimation = true, ANIMATION_DURATION_FLIP)

            if (!(FLIPED_AREA.RIGTH_CARD in this.flippedAreas) || !(FLIPED_AREA.MEMORY_CARD in this.flippedAreas)) {
              return;
            }

            this.validateNeurastheniaMatch();
         }
        },
        this
      )
    })
  }


  /**
   * 
   * @param {Phaser.GameObjects.Sprite} spriteObject 
   * @param {string} toChangeTextureName 
   */
  flipAnimation = (spriteObject, toChangeTextureName, scaleX = 1, scaleY = 1) => {
    const singleMotionAnimationDuration = ANIMATION_DURATION_FLIP / 4;

    this.tweens.add({
      targets: spriteObject,
      scaleX: scaleX * 1.1,
      scaleY: scaleY * 1.1,
      duration: singleMotionAnimationDuration
    });

    //カード裏　表示アニメーション
    this.tweens.add({
      targets: spriteObject,
      scaleX: 0,
      duration: singleMotionAnimationDuration,
      delay: singleMotionAnimationDuration,
      onComplete: () => {
        spriteObject.setTexture(toChangeTextureName);
      }
    });

    this.tweens.add({
      targets: spriteObject,
      scaleX: scaleX * 1.1,
      duration: singleMotionAnimationDuration,
      delay: singleMotionAnimationDuration * 2,
    })

    this.tweens.add({
      targets: spriteObject,
      scaleX: scaleX,
      scaleY: scaleY,
      duration: singleMotionAnimationDuration,
      delay: singleMotionAnimationDuration * 3,
    })

  }

  createSoundButton = () => {
    new SoundButton(this, 70, 700, 40);
  }

  TryCount = () => {
    //残り回数が10以下になったらスペースを入れて右揃えを維持する
    if((this.maxTryCount - this.triedCount) >= 10){
      return `${this.maxTryCount - this.triedCount}`;
    }else{
      return "  "+(`${this.maxTryCount - this.triedCount}`);
    }
    
  }

  currentTryCount = () => {
    return `${this.triedCount + 1}回目`;
  }

  nowPlayerText = () => {
    return this.nowPlayerName = this.triedCount % 2 == 0 ? "プレイヤー1の番" : "プレイヤー2の番";
  }

  Player1NowPoint = () => {
    return this.player1PointCounter;
  }

  Player2NowPoint = () => {
    return this.player2PointCounter;
  }

  createTryCountText = () => {
    const GLOBAL_START_POSITION_X = this.sys.game.canvas.width / 2;
    const GLOBAL_START_POSITION_Y = 64;

    let graphics = this.add.graphics();
    graphics.fillStyle(0x00ff7f, 1).
    fillRoundedRect(GLOBAL_START_POSITION_X - 300, GLOBAL_START_POSITION_Y - 20, 600, 120, 11)

    const number1Object = this.add.text(0, 0, "あと", {
      color: COLOR_WHITE.toString(),
      fontSize: "100px",
      fontFamily: this.fontFamily
    });

      this.TryLimitComponent = this.add.text(number1Object.width, 0, this.TryCount(), {
        color: "#D53F3F",
        fontSize: "100px",
        fontFamily: this.fontFamily
      });

    const text2Object = this.add.text(number1Object.width + this.TryLimitComponent.width + 10, 0, "回", {
      color: COLOR_WHITE.toString(),
      fontSize: "100px",
      fontFamily: this.fontFamily
    }).setPadding(4, 4, 4, 4)

    const container = this.add.container(0, 55, [
      number1Object,
      this.TryLimitComponent,
      text2Object
    ]);
    container.setSize(
      number1Object.width + this.TryLimitComponent.width + text2Object.width,
      number1Object.height
    );
    container.setX(this.game.canvas.width / 2 - container.width / 2);

    //左模様
    this.add.image(250, 80, "LeftPattern").setScale(0.3, 0.3)
      .setOrigin(0.5, 0.5);

    //右模様
    this.add.image(770, 130, "RightPattern").setScale(0.3, 0.3)
      .setOrigin(0.5, 0.5).setAngle(180);

  }


  createPlayer1PointBack = () => {
    const BLACK_POS_X = this.game.canvas.width / 8 - 50;
    const GRAY_POS_X = this.game.canvas.width / 8 - 45;
    const NAME_BACK_X = this.game.canvas.width / 8 - 45;

    let graphics = this.add.graphics();
    graphics.fillStyle(0X000000, 1).fillRect(BLACK_POS_X + 50, 25, 260, 190);

    if (this.nowPlayerName == "プレイヤー1の番") {
      graphics.fillStyle(0X00FF7F, 1).fillRect(NAME_BACK_X + 50, 30, 250, 45);
      graphics.fillStyle(0X00FF7F, 1).fillRect(GRAY_POS_X + 50, 80, 250, 130);
    } else {
      graphics.fillStyle(0X696969, 1).fillRect(NAME_BACK_X + 50, 30, 250, 45);
      graphics.fillStyle(0X696969, 1).fillRect(GRAY_POS_X + 50, 80, 250, 130);
    }
  }

  createPlayer2PointBack = () => {
    const BLACK_POS_X = this.game.canvas.width * 0.76 - 30;
    const NAME_BACK_X = this.game.canvas.width * 0.76 - 25;
    const GRAY_POS_X = this.game.canvas.width * 0.76 - 25;

    let graphics = this.add.graphics();
    graphics.fillStyle(0X000000, 1).fillRect(BLACK_POS_X - 110, 25, 260, 190);

    if (this.nowPlayerName == "プレイヤー2の番") {
      graphics.fillStyle(0X00FF7F, 1).fillRect(NAME_BACK_X - 110, 30, 250, 45);
      graphics.fillStyle(0X00FF7F, 1).fillRect(GRAY_POS_X - 110, 80, 250, 130);
    } else {
      graphics.fillStyle(0X696969, 1).fillRect(NAME_BACK_X - 110, 30, 250, 45);
      graphics.fillStyle(0X696969, 1).fillRect(GRAY_POS_X - 110, 80, 250, 130);
    }
  }

  createNowPlayerNameText = () => {
    this.nowPlayerComponent = this.add
      .text(
        this.game.canvas.width / 2 - 160,
        50,
        this.nowPlayerName, {
          color: COLOR_LIGHT_BLACK.toString(),
          fontSize: '40px',
          fontFamily: this.fontFamily
        }
      )
      .setOrigin(0, 0).setPadding(4, 4, 4, 4).setStroke("black", 1);
  }

  createPleyerNameText = () => {

    this.add
      .text(
        this.game.canvas.width / 8 - 45 + 75,
        30,
        "プレイヤー１", {
          color: COLOR_LIGHT_BLACK.toString(),
          fontSize: '30px',
          fontFamily: this.fontFamily
        }
      )
      .setOrigin(0, 0).setPadding(4, 4, 4, 4).setStroke("black", 1);

    this.add
      .text(
        this.game.canvas.width * 0.76 - 100,
        30,
        "プレイヤー２", {
          color: COLOR_LIGHT_BLACK.toString(),
          fontSize: '30px',
          fontFamily: this.fontFamily
        }
      )
      .setOrigin(0, 0).setPadding(4, 4, 4, 4).setStroke("black", 1);
  }

  Player1PointCountText = () => {

    this.player1PointComponent =
      this.add
      .text(
        130 + 85,
        75,
        (this.player1PointCounter.toString()), {
          color: COLOR_LIGHT_BLACK.toString(),
          fontSize: '130px',
          fontFamily: this.fontFamily
        }
      )
      .setOrigin(0, 0).setPadding(0, 4, 0, 0).setStroke("black", 1.3);

  }

  Player2PointCountText = () => {
    this.player2PointComponent =
      this.add
      .text(
        800 - 75,
        75,
        (this.player2PointCounter.toString()), {
          color: COLOR_LIGHT_BLACK.toString(),
          fontSize: '130px',
          fontFamily: this.fontFamily
        }
      )
      .setOrigin(0, 0).setPadding(0, 4, 0, 0).setStroke("black", 1);
  }

  createGameStopLabel = () => {
    const timeStopLabel = new TimeStopLabel(this, 775, 672, "一時停止", {
      color: "#333333",
      fontSize: "32px",
      fontFamily: this.fontFamily,
    });
    timeStopLabel.setInteractive().on("pointerdown", () => {
      this.scene.pause();
      this.scene.launch("memory_pause_menu");
    });
  };


  PlayerPointAdd = () => {
    if (this.triedCount % 2 == 0) {
      this.player1PointCounter++;
    } else {
      this.player2PointCounter++;
    }
  }

  createCarpet = () => {
    this.add
      .sprite(512, 384, "BackCarpet")
      .setScale(0.5, 0.5)
      .setOrigin(0.5, 0.5);

  };

  /**
   * @typedef {Object} InitResultSceneData
   * @property {boolean} isWon
   * @param {InitResultSceneData} data 
   */

  goToResultScene = (data) => {
    this.scene.start('MemoryRuselt', {
      isWon: data.isWon,
      level: this.gameConfig.level,
      MaxCount: this.maxTryCount,
      TriedCount: this.triedCount,
      mode: this.prevSceneData.mode,
      p1point: this.player1PointCounter,
      p2point: this.player2PointCounter,
      genre: this.prevSceneData.genre
    });
  }

  validateNeurastheniaMatch = () => {

      const cardData = this.flippedAreas[FLIPED_AREA.MEMORY_CARD];
      const RightCardsData = this.flippedAreas[FLIPED_AREA.RIGTH_CARD];

      this.consoleLogForDebug(this.flippedAreas);
      this.consoleLogForDebug(this.flippedComponents);

      //めくったペアが同じペアを立ったら
      if (cardData.RightCard === RightCardsData) {        

        setTimeout(() => {

          //対戦モードの場合
          if (this.prevSceneData.mode == "versus") {
            this.PlayerPointAdd();

            if (this.isFlippedAll()) {
              this.goToResultScene({
                isWon: true
              });
            }
          }

          this.triedCount++;

          //練習モードの場合
          if (this.prevSceneData.mode == "practice") {            
            //全てのペアを見つけたか
            if (this.isFlippedAll()) {
              //結果画面：クリア
              this.goToResultScene({
                isWon: true
              });
              //制限回数を超えたか
            }else if (this.isGameOver()) {
              //結果画面：ゲームオーバー
              this.goToResultScene({
                isWon: false
              });
            }
          }

          this.initFlippedArea();
          this.refreshCounter();

        }, ANIMATION_DURATION_FLIP * 2);        

        //カードをめくった3秒後にクリック解禁
        setTimeout(() => {
          this.flipLeftCard = false;
          this.flipRightCard = false;          
        }, 3000);        

        return;
      }

      this.flippedComponents.forEach((flippedComponent, index) => {
        if (this.flippedComponents.length - 2 > index) {
          return;
        }
        
        setTimeout(() => {
          this.flipAnimation(
            flippedComponent,
            CARD_BACK_SIDE_IMAGE_KEY,
            flippedComponent?.scaleX,
            flippedComponent?.scaleY,            
          )
        }, 1800);//指定されたミリ秒後にカードを裏返すアニメーション実行
        
        //カードをめくった3秒後にクリック解禁
        setTimeout(() => {
          this.flipLeftCard = false;
          this.flipRightCard = false;
        }, 3000);
        
      });
      
      setTimeout(() => {
        this.triedCount++;

        if (this.prevSceneData.mode === "practice") {

          if (this.isGameOver()) {
            this.goToResultScene({
              isWon: false,
            });
          }
        }

        this.initFlippedArea();
        this.refreshCounter();

      }, ANIMATION_DURATION_FLIP * 2);

      this.flippedComponents = this.flippedComponents.slice(0, this.flippedComponents.length - 2)
    
  }

  refreshCounter = () => {
    if (this.prevSceneData.mode == "practice") {
      this.TryLimitComponent.setText(this.TryCount());
    } else if (this.prevSceneData.mode == "versus") {
      this.nowPlayerText();

      this.player1PointComponent.setText((this.Player1NowPoint().toString()));
      this.player2PointComponent.setText((this.Player2NowPoint().toString()));

      this.createPlayer1PointBack();
      this.Player1PointCountText();

      this.createPlayer2PointBack();
      this.Player2PointCountText();
      this.createPleyerNameText();
    }
  }

  consoleLogForDebug = (...contents) => {
    if (!DEBUG_MODE) {
      return;
    }
  }
}