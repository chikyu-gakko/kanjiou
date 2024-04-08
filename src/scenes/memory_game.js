import Phaser from "phaser";

import { nationalFlags } from "../data/countries"; //カードのデータ収納場所
import { jobs } from "../data/jobs"; //カードのデータ収納場所
import { CountPeople } from "../data/CountPeople";
import { constellations } from "../data/constellations";
import SoundButton from "../components/sound_button";
import BackGround from "./ui/BackGround";
import { LEVEL1, LEVEL2, LEVEL3 } from "./constants/level";
import { COLOR_LIGHT_BLACK, COLOR_LIGHT_GRAY, COLOR_PALE_GREEN,COLOR_WHITE } from "./constants/color";

const DEBUG_MODE = false;
const ERROR_MESSAGE_FOR_LEVEL = 'invalid level.';
const ERROR_MESSAGE_FOR_NATIONAL_FLAGS_COUNT = 'count out of bounds for nationalFlags length.';

const CARD_BACK_SIDE_IMAGE_KEY = '3:2Mogra';
const ANIMATION_DURATION_FLIP = 900;


const FLIPED_AREA = {
  NATIONAL_FLAG: 'national',
  NATIONAL_FLAG_KANJI: 'national_flag_kanji',
}

/**
* @typedef {Object} NationalFlag
* @property {string} imagePath
* @property {string} englishName
* @property {string} kanaName
* @property {string} shortKanjiName
*/
export default class MemoryGame extends Phaser.Scene {
  constructor() {
    super({ key: "memory_game", active: false });

    this.nationalFlags               = []; //カードのデータ用配列
    
    this.nationalFlagShortKanjiNames = [];
    this.nationalFlagsCount          = 0;

    this.gameConfig = {
      level: 0,
    };
    
    this.maxTryCount = 0;
    this.triedCount  = 0;
    
    this.TryLimitComponent = undefined;

    this.Now_PlayerComponent = undefined;
    this.Player1PointComponent = undefined;
    this.Player2PointComponent = undefined;

    this.flippedAreas      = {};
    this.flippedComponents = [];

    this.LeftCardType = "";
    this.RightCardType = "";
  }

  preload = () => {
    //左のカード用写真を登録
    this.nationalFlags.forEach((nationalFlag) => {
      this.load.image(nationalFlag.englishName, nationalFlag.imagePath);
    });

    //右のカード用写真を登録
    this.nationalFlags.forEach((nationalFlag) => {
         this.load.image(nationalFlag.englishName + "KANA", nationalFlag.shortKanjiName);
    });

    this.load.image(CARD_BACK_SIDE_IMAGE_KEY, 'assets/img/card/card_back.png');
    this.load.image("BackCarpet", 'assets/img/carpet.png');

    this.load.image("LeftPattern", 'assets/img/pattern.png');
    this.load.image("RightPattern", 'assets/img/pattern.png');
    
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
        mode:"",
        genre:""
      }
    }

    this.prevSceneData = {
        level: data.level,
        mode:data.mode,
        genre:data.genre
      };

      switch(this.prevSceneData.genre){
        case "flag":
          this.nationalFlags = nationalFlags;
          this.RightCardType = "char";
          this.LeftCardType = "img";
        break
        case "job":
          this.nationalFlags = jobs;
          this.RightCardType = "char";
          this.LeftCardType = "img";
        break
        case "constellation":
          this.nationalFlags = constellations;
          this.RightCardType = "img";
          this.LeftCardType = "img";
        break
        case "CountPeople":
          this.nationalFlags = CountPeople;
          this.RightCardType = "char";
          this.LeftCardType = "char";
        // default:
        //   this.nationalFlags = countries;
      }
      
      console.log(this.prevSceneData.level);
      console.log(this.prevSceneData.mode);
      console.log(this.prevSceneData.genre);
    
    this.gameConfig = {
      level: data.level,
      mode:data.mode
    };
    
    this.triedCount  = 0;
    this.maxTryCount                 = this.levelToMaxTryCount(this.gameConfig.level)
    
    this.nationalFlagsCount          = this.levelToNationalFlagsCount(this.gameConfig.level);
    this.nationalFlags               = this.randomlySelectNationalFlags(this.nationalFlagsCount);
    this.nationalFlagShortKanjiNames = this.mixedUpArray(this.nationalFlags.map(({ shortKanjiName }) => shortKanjiName));

    this.RightCardImg = this.mixedUpArray(this.nationalFlags.map(( englishName ) => englishName));
    console.log("test:"+this.RightCardImg);

    this.LeftCardChar = this.mixedUpArray(this.nationalFlags.map(({ imagePath }) => imagePath));
    
    this.createShortKanjiNameTextures();

    this.Now_PlayerName = "プレイヤー1の番";
    this.Player1PointCounter = 0;
    this.Player2PointCounter = 0;
  }

  create = () => {
    
    this.createBackGround();
    this.createCarpet();
    this.createSoundButton();

    if(this.prevSceneData.mode == "practice"){
      this.createTryCountText();
    }
    if(this.prevSceneData.mode == "versus"){
      this.createPlayer1PointBack();
      this.createPlayer2PointBack();
      this.createPleyerNameText();
      this.Player1PointCountText();
      this.Player2PointCountText();
    }
    this.createNationalFlagImages(); //左カード表示
    this.createNationalFlagShortKanjiNames(); //右カード表示
  }

  initFlippedArea = () => {
    this.flippedAreas = {};
  }

  createShortKanjiNameTextures = () => {
    const IMAGE_SIZE_WIDTH = 300;
    const IMAGE_SIZE_HEIGHT = 200;
    
    const gridSize = this.gridSizeByLevel(this.gameConfig.level);
    this.consoleLogForDebug(gridSize);

    const GLOBAL_START_POSITION_X = 0;
    const GLOBAL_START_POSITION_Y = 0;

    let LEFT_FONT_SIZE;

    let LeftSideStartPositionXForText;
    

    this.nationalFlagShortKanjiNames.forEach((nationalFlagShortKanjiName) => {

      switch(this.prevSceneData.genre){
        case "flag":
          LEFT_FONT_SIZE = 64;
          LeftSideStartPositionXForText = GLOBAL_START_POSITION_X + IMAGE_SIZE_WIDTH / 2 - LEFT_FONT_SIZE / 2;        
        break
        case "job":
          LEFT_FONT_SIZE = 50;
          LeftSideStartPositionXForText = GLOBAL_START_POSITION_X + 
          IMAGE_SIZE_WIDTH / 2 - LEFT_FONT_SIZE - (10 * nationalFlagShortKanjiName.length);
        break
        case "CountPeople":
          LEFT_FONT_SIZE = 35;
          LeftSideStartPositionXForText = GLOBAL_START_POSITION_X + IMAGE_SIZE_WIDTH / 2 -
           LEFT_FONT_SIZE - (12 * nationalFlagShortKanjiName.length);  
        break
        // default:
        //   this.nationalFlags = countries;
      }

      let LeftSideStartPositionYForText = GLOBAL_START_POSITION_Y + IMAGE_SIZE_HEIGHT / 2 - LEFT_FONT_SIZE / 2;

      const shortKanjiNameBackground = this.add
        .rectangle(GLOBAL_START_POSITION_X, GLOBAL_START_POSITION_Y, IMAGE_SIZE_WIDTH, IMAGE_SIZE_HEIGHT, COLOR_LIGHT_GRAY.toNumber(), 1)
        .setOrigin(0, 0)
        .setDisplaySize(IMAGE_SIZE_WIDTH, IMAGE_SIZE_HEIGHT);

      
      //64
      //const localStartPositionXForText = GLOBAL_START_POSITION_X + IMAGE_SIZE_WIDTH / 2 - FONT_SIZE / 2;
      

      const shortKanjiName = this.add
        .text(
          LeftSideStartPositionXForText,
          LeftSideStartPositionYForText,
          nationalFlagShortKanjiName,
          { color: COLOR_LIGHT_BLACK.toString(), fontSize: `${LEFT_FONT_SIZE}px` }
        )
        .setOrigin(0, 0).setPadding(0, 4, 0, 0)

      const renderTexture = this.add.renderTexture(
        GLOBAL_START_POSITION_X,
        GLOBAL_START_POSITION_Y,
        IMAGE_SIZE_WIDTH,
        IMAGE_SIZE_HEIGHT,
      );
      renderTexture.draw(shortKanjiNameBackground);
      renderTexture.draw(shortKanjiName);
      renderTexture.saveTexture(nationalFlagShortKanjiName);

      shortKanjiNameBackground.destroy();
      shortKanjiName.destroy();
      renderTexture.destroy();
    })

    

    this.LeftCardChar.forEach((LeftCardChar) => {
  
      const shortKanjiNameBackground = this.add
        .rectangle(GLOBAL_START_POSITION_X, GLOBAL_START_POSITION_Y, IMAGE_SIZE_WIDTH, IMAGE_SIZE_HEIGHT, COLOR_LIGHT_GRAY.toNumber(), 1)
        .setOrigin(0, 0)
        .setDisplaySize(IMAGE_SIZE_WIDTH, IMAGE_SIZE_HEIGHT);

      const FONT_SIZE = 42;
      // const localStartPositionXForText = GLOBAL_START_POSITION_X + IMAGE_SIZE_WIDTH / 2 - FONT_SIZE / 2;
      const localStartPositionXForText = GLOBAL_START_POSITION_X + IMAGE_SIZE_WIDTH / 2 - FONT_SIZE;
      const localStartPositionYForText = GLOBAL_START_POSITION_Y + IMAGE_SIZE_HEIGHT / 2 - FONT_SIZE / 2;

      const shortKanjiName = this.add
        .text(
          localStartPositionXForText,
          localStartPositionYForText,
          LeftCardChar,
          { color: COLOR_LIGHT_BLACK.toString(), fontSize: `${FONT_SIZE}px` }
        )
        .setOrigin(0, 0).setPadding(0, 4, 0, 0)

      const renderTexture = this.add.renderTexture(
        GLOBAL_START_POSITION_X,
        GLOBAL_START_POSITION_Y,
        IMAGE_SIZE_WIDTH,
        IMAGE_SIZE_HEIGHT,
      );
      renderTexture.draw(shortKanjiNameBackground);
      renderTexture.draw(shortKanjiName);
      renderTexture.saveTexture(LeftCardChar);

      shortKanjiNameBackground.destroy();
      shortKanjiName.destroy();
      renderTexture.destroy();
    })
  }

  /**
   * @param {number} level
   */
  levelToNationalFlagsCount = (level) => {
    
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
        return { width: 177, height: 118 };
      case LEVEL2:
      case LEVEL3:
        return { width: 135, height: 90 };
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
        return { maxColumn: 2, maxRow: 3 };
      case LEVEL2:
        return { maxColumn: 3, maxRow: 3 };
      case LEVEL3:
        return { maxColumn: 3, maxRow: 4 };
      default:
        throw new Error(ERROR_MESSAGE_FOR_LEVEL);
    }
  }

  createBackGround = () => {
    new BackGround(this, { color: COLOR_PALE_GREEN.toNumber(), alpha: 1 });
  }


  /**
   * @param {number} count 
   * @returns {NationalFlag[]}
   */
  randomlySelectNationalFlags = (count) => {
    if (count > this.nationalFlags.length) {
      throw new Error(ERROR_MESSAGE_FOR_NATIONAL_FLAGS_COUNT);
    }

    const result = [];

    while (result.length < count) {
      const randomIndex = Math.floor(Math.random() * this.nationalFlags.length);
      const randomElement = this.nationalFlags[randomIndex];
      
      if (!result.includes(randomElement)) {
        console.log("randomElement:"+randomElement)
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
    console.log("befor:"+result);

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    console.log("after:"+result);
    return result;
  }

  isFlippedAll = () => {
    return this.flippedComponents.length === this.levelToNationalFlagsCount(this.gameConfig.level) * 2;
  }

  isGameOver = () => {
    return this.triedCount === this.maxTryCount;
  }

  createNationalFlagImages = () => {

    const GLOBAL_START_POSITION_X = 40;
    const GLOBAL_START_POSITION_Y = 250;
    const GAP = 16;

    const imageSize = this.imageSizeByLevel(this.gameConfig.level);
    const gridSize = this.gridSizeByLevel(this.gameConfig.level);
    this.consoleLogForDebug(imageSize);
    this.consoleLogForDebug(gridSize);

  if(this.LeftCardType == "img"){
    this.nationalFlags.forEach((nationalFlag, index) => {
      const gridGap = (gridPosition, maxGridPosition) => {
        return gridPosition > 0 && gridPosition < maxGridPosition ? GAP * gridPosition : 0;
      }
      console.log("nationalFlag:" + nationalFlag.englishName)
      const column = index % gridSize.maxColumn;
      const row    = Math.floor(index / gridSize.maxColumn);

      const localStartPositionX = column * imageSize.width + imageSize.width / 2 + gridGap(column, gridSize.maxColumn) + GLOBAL_START_POSITION_X;
      const localStartPositionY = row * imageSize.height + imageSize.height / 2 + gridGap(row, gridSize.maxRow) + GLOBAL_START_POSITION_Y;
      
      const nationalFlagComponent = this.add
        .sprite(localStartPositionX, localStartPositionY, CARD_BACK_SIDE_IMAGE_KEY)
        .setDisplaySize(imageSize.width, imageSize.height)
        .setInteractive({
          cursor: 'pointer'
        });
      nationalFlagComponent.depth = 2;
      let isFinishedFlipAnimation = true;
      nationalFlagComponent.on(
        'pointerdown',
        () =>  {
          if (!isFinishedFlipAnimation || FLIPED_AREA.NATIONAL_FLAG in this.flippedAreas || this.flippedComponents.includes(nationalFlagComponent)) {
            return;
          }

          isFinishedFlipAnimation = false;

          //第二引数 nationalFlag.englishName = imageの名前
          this.flipAnimation(
            nationalFlagComponent,
            nationalFlag.englishName,
            nationalFlagComponent.scaleX,
            nationalFlagComponent.scaleY,
          )

          this.flippedAreas[FLIPED_AREA.NATIONAL_FLAG] = nationalFlag;
          this.flippedComponents.push(nationalFlagComponent);

          setTimeout(() => isFinishedFlipAnimation = true, ANIMATION_DURATION_FLIP)

          if (!(FLIPED_AREA.NATIONAL_FLAG_KANJI in this.flippedAreas) || !(FLIPED_AREA.NATIONAL_FLAG in this.flippedAreas)) {
            return;
          }

          this.validateNeurastheniaMatch();
        },
        this
      )
    })

  }else if(this.LeftCardType == "char"){

    this.nationalFlags.forEach((nationalFlag, index) => {
      const gridGap = (gridPosition, maxGridPosition) => {
        return gridPosition > 0 && gridPosition < maxGridPosition ? GAP * gridPosition : 0;
      }

      const column = index % gridSize.maxColumn;
      const row    = Math.floor(index / gridSize.maxColumn);

      const localStartPositionX = column * imageSize.width + imageSize.width / 2 + gridGap(column, gridSize.maxColumn) + GLOBAL_START_POSITION_X;
      const localStartPositionY = row * imageSize.height + imageSize.height / 2 + gridGap(row, gridSize.maxRow) + GLOBAL_START_POSITION_Y;
      
      const nationalFlagComponent = this.add
        .sprite(localStartPositionX, localStartPositionY, CARD_BACK_SIDE_IMAGE_KEY)
        .setDisplaySize(imageSize.width, imageSize.height)
        .setInteractive({
          cursor: 'pointer'
        });
      nationalFlagComponent.depth = 2;
      let isFinishedFlipAnimation = true;
      nationalFlagComponent.on(
        'pointerdown',
        () =>  {
          if (!isFinishedFlipAnimation || FLIPED_AREA.NATIONAL_FLAG in this.flippedAreas || this.flippedComponents.includes(nationalFlagComponent)) {
            return;
          }

          isFinishedFlipAnimation = false;

          //第二引数 nationalFlag.englishName = imageの名前
          this.flipAnimation(
            nationalFlagComponent,
            nationalFlag.imagePath,
            nationalFlagComponent.scaleX,
            nationalFlagComponent.scaleY,
          )

          this.flippedAreas[FLIPED_AREA.NATIONAL_FLAG] = nationalFlag;
          this.flippedComponents.push(nationalFlagComponent);

          setTimeout(() => isFinishedFlipAnimation = true, ANIMATION_DURATION_FLIP)

          if (!(FLIPED_AREA.NATIONAL_FLAG_KANJI in this.flippedAreas) || !(FLIPED_AREA.NATIONAL_FLAG in this.flippedAreas)) {
            return;
          }

          this.validateNeurastheniaMatch();
        },
        this
      )
    })
  }
  }

  
  createNationalFlagShortKanjiNames = () => {

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
    
    if(this.RightCardType == "img"){
      this.RightCardImg.forEach((RightCardImg,index) => {
      
      const gridGap = (gridPosition, maxGridPosition) => {
        return gridPosition > 0 && gridPosition < maxGridPosition ? GAP * gridPosition : 0;
      }
      console.log("KANA:"+RightCardImg.englishName + "KANA")
      const column = index % gridSize.maxColumn;
      const row    = Math.floor(index / gridSize.maxColumn);

      const localStartPositionX = column * imageSize.width + imageSize.width / 2 + gridGap(column, gridSize.maxColumn) + GLOBAL_START_POSITION_X;
      const localStartPositionY = row * imageSize.height + imageSize.height / 2 + gridGap(row, gridSize.maxRow) + GLOBAL_START_POSITION_Y;
      
      const nationalFlagShortKanjiNameComponent = this.add
        .sprite(localStartPositionX, localStartPositionY, CARD_BACK_SIDE_IMAGE_KEY)
        .setDisplaySize(imageSize.width, imageSize.height)
        .setInteractive({
          cursor: 'pointer'
        });
        nationalFlagShortKanjiNameComponent.depth = 2;

      let isFinishedFlipAnimation = true;
      nationalFlagShortKanjiNameComponent.on(
        'pointerdown',
        () =>  {
          if (!isFinishedFlipAnimation || FLIPED_AREA.NATIONAL_FLAG_KANJI in this.flippedAreas || this.flippedComponents.includes(nationalFlagShortKanjiNameComponent)) {
            return;
          }
          
          isFinishedFlipAnimation = false;
          
          this.flipAnimation(
            nationalFlagShortKanjiNameComponent,
            RightCardImg.englishName + "KANA",
            nationalFlagShortKanjiNameComponent.scaleX,
            nationalFlagShortKanjiNameComponent.scaleY,
          )

          this.flippedAreas[FLIPED_AREA.NATIONAL_FLAG_KANJI] = RightCardImg.shortKanjiName;
          
          this.flippedComponents.push(nationalFlagShortKanjiNameComponent);
          setTimeout(() => isFinishedFlipAnimation = true, ANIMATION_DURATION_FLIP)

          if (!(FLIPED_AREA.NATIONAL_FLAG_KANJI in this.flippedAreas) || !(FLIPED_AREA.NATIONAL_FLAG in this.flippedAreas)) {
            return;
          }

          this.validateNeurastheniaMatch();
        },
        this
      )
    })
    }else if(this.RightCardType == "char"){
      
        this.nationalFlagShortKanjiNames.forEach((nationalFlagShortKanjiName, index) => {
      const gridGap = (gridPosition, maxGridPosition) => {
        return gridPosition > 0 && gridPosition < maxGridPosition ? GAP * gridPosition : 0;
      }

      const column = index % gridSize.maxColumn;
      const row    = Math.floor(index / gridSize.maxColumn);

      const localStartPositionX = column * imageSize.width + imageSize.width / 2 + gridGap(column, gridSize.maxColumn) + GLOBAL_START_POSITION_X;
      const localStartPositionY = row * imageSize.height + imageSize.height / 2 + gridGap(row, gridSize.maxRow) + GLOBAL_START_POSITION_Y;
      
      const nationalFlagShortKanjiNameComponent = this.add
        .sprite(localStartPositionX, localStartPositionY, CARD_BACK_SIDE_IMAGE_KEY)
        .setDisplaySize(imageSize.width, imageSize.height)
        .setInteractive({
          cursor: 'pointer'
        });
        nationalFlagShortKanjiNameComponent.depth = 2;

      let isFinishedFlipAnimation = true;
      nationalFlagShortKanjiNameComponent.on(
        'pointerdown',
        () =>  {
          if (!isFinishedFlipAnimation || FLIPED_AREA.NATIONAL_FLAG_KANJI in this.flippedAreas || this.flippedComponents.includes(nationalFlagShortKanjiNameComponent)) {
            return;
          }

          isFinishedFlipAnimation = false;
          console.log(nationalFlagShortKanjiName)
          this.flipAnimation(
            nationalFlagShortKanjiNameComponent,
            nationalFlagShortKanjiName,
            nationalFlagShortKanjiNameComponent.scaleX,
            nationalFlagShortKanjiNameComponent.scaleY,
          )
          this.flippedAreas[FLIPED_AREA.NATIONAL_FLAG_KANJI] = nationalFlagShortKanjiName;
          this.flippedComponents.push(nationalFlagShortKanjiNameComponent);
          setTimeout(() => isFinishedFlipAnimation = true, ANIMATION_DURATION_FLIP)

          if (!(FLIPED_AREA.NATIONAL_FLAG_KANJI in this.flippedAreas) || !(FLIPED_AREA.NATIONAL_FLAG in this.flippedAreas)) {
            return;
          }

          this.validateNeurastheniaMatch();
        },
        this
      )
    })
  }
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
    return `${this.maxTryCount - this.triedCount}`;
  }

  currentTryCount = () => {
    return `${this.triedCount + 1}回目`;
  }

  NowPlayer_Text = () => {
    return this.Now_PlayerName = this.triedCount % 2 == 0 ? "プレイヤー1の番" : "プレイヤー2の番";
  }

  Player1NowPoint = () => {
    return this.Player1PointCounter;
  }

  Player2NowPoint = () => {
    return this.Player2PointCounter;
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
      });
      
      this.TryLimitComponent = this.add.text(number1Object.width
        , 0, this.TryCount(), {
        color: "#D53F3F",
        fontSize: "100px",
      });
  
      const text2Object = this.add.text(number1Object.width + this.TryLimitComponent.width + 10
        , 0, "回", {
        color: COLOR_WHITE.toString(),
        fontSize: "100px",
      }).setPadding(4, 4, 4, 4)
  
      const container = this.add.container(0, 70, [
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
    this.add.image( 250, 80,"LeftPattern").setScale(0.3, 0.3)
    .setOrigin(0.5, 0.5);

    //右模様
    this.add.image( 770, 130,"RightPattern").setScale(0.3, 0.3)
    .setOrigin(0.5, 0.5).setAngle(180);
  
  }
   

  createPlayer1PointBack = () => {
    const BLACK_POS_X = this.game.canvas.width / 8 - 50;
    const GRAY_POS_X = this.game.canvas.width / 8 - 45;
    const NAME_BACK_X = this.game.canvas.width / 8 - 45;

    let graphics = this.add.graphics();
    graphics.fillStyle(0X000000, 1).fillRect(BLACK_POS_X + 50, 25,260, 190);

    if(this.Now_PlayerName =="プレイヤー1の番"){
      graphics.fillStyle(0X00FF7F, 1).fillRect(NAME_BACK_X + 50, 30, 250, 45);
      graphics.fillStyle(0X00FF7F, 1).fillRect(GRAY_POS_X + 50, 80,250, 130);
    }else{
      graphics.fillStyle(0X696969, 1).fillRect(NAME_BACK_X + 50, 30, 250, 45);
      graphics.fillStyle(0X696969, 1).fillRect(GRAY_POS_X + 50, 80,250, 130);
    }
  }

  createPlayer2PointBack = () => {
    const BLACK_POS_X = this.game.canvas.width * 0.76 - 30;
    const NAME_BACK_X = this.game.canvas.width * 0.76 - 25;
    const GRAY_POS_X = this.game.canvas.width * 0.76 - 25;

    let graphics = this.add.graphics();
    graphics.fillStyle(0X000000, 1).fillRect(BLACK_POS_X - 110, 25, 260, 190);

    if(this.Now_PlayerName =="プレイヤー2の番"){
      graphics.fillStyle(0X00FF7F, 1).fillRect(NAME_BACK_X - 110, 30, 250, 45);
      graphics.fillStyle(0X00FF7F, 1).fillRect(GRAY_POS_X - 110, 80, 250, 130);
    }else{
      graphics.fillStyle(0X696969, 1).fillRect(NAME_BACK_X - 110, 30, 250, 45);
      graphics.fillStyle(0X696969, 1).fillRect(GRAY_POS_X - 110, 80, 250, 130);
    }
  }

  createNowPlayerNameText = () =>{
    this.Now_PlayerComponent = this.add
          .text(
            this.game.canvas.width / 2 - 160,
            50,
            this.Now_PlayerName,
            {
              color: COLOR_LIGHT_BLACK.toString(),
              fontSize: '40px',
             
            }
          )
          .setOrigin(0, 0).setPadding(4, 4, 4, 4).setStroke("black",1);
  }

  createPleyerNameText = () => {

          this.add
          .text(
            this.game.canvas.width / 8 - 45 + 75,
            40,
            "プレイヤー１",
            {
              color: COLOR_LIGHT_BLACK.toString(),
              fontSize: '30px',
             
            }
          )
          .setOrigin(0, 0).setPadding(4, 4, 4, 4).setStroke("black",1);

          this.add
          .text(
            this.game.canvas.width * 0.76 - 100,
            40,
            "プレイヤー２",
            {
              color: COLOR_LIGHT_BLACK.toString(),
              fontSize: '30px',
             
            }
          )
          .setOrigin(0, 0).setPadding(4, 4, 4, 4).setStroke("black",1);
  }

  Player1PointCountText = () => {
    
    this.Player1PointComponent =
    this.add
    .text(
      130 + 75,
      75,
      (this.Player1PointCounter.toString()),
      {
        color: COLOR_LIGHT_BLACK.toString(),
        fontSize: '155px',
      }
    )
    .setOrigin(0, 0).setPadding(0, 4, 0, 0).setStroke("black",1.3);
    
  }

  Player2PointCountText = () => {
    this.Player2PointComponent = 
    this.add
          .text(
            800 - 75,
            75,
            (this.Player2PointCounter.toString()),
            {
              color: COLOR_LIGHT_BLACK.toString(),
              fontSize: '155px',          
            }
          )
          .setOrigin(0, 0).setPadding(0, 4, 0, 0).setStroke("black",1);
  }
  

  PlayerPointAdd = () => {
    if(this.triedCount % 2 == 0){
      this.Player1PointCounter++;
    }else{
      this.Player2PointCounter++;
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
   * 
   * @param {InitResultSceneData} data 
   */
  goToResultScene = (data) => {
    this.scene.start('MemoryRuselt',{
        isWon:data.isWon,
        level:this.gameConfig.level,
        MaxCount:this.maxTryCount,
        TriedCount:this.triedCount,
        mode:this.prevSceneData.mode,
        p1point:this.Player1PointCounter,
        p2point:this.Player2PointCounter
      }
    );
  }
  
  validateNeurastheniaMatch = () => {
    const nationalFlag = this.flippedAreas[FLIPED_AREA.NATIONAL_FLAG];
    const nationalFlagShortKanjiName = this.flippedAreas[FLIPED_AREA.NATIONAL_FLAG_KANJI];

    console.log("左カード:" + nationalFlag.shortKanjiName);
    console.log("右カード:" + nationalFlagShortKanjiName);
    //nationalFlagShortKanjiName.shortKanjiName

    this.consoleLogForDebug(this.flippedAreas);
    this.consoleLogForDebug(this.flippedComponents);

   //nationalFlagShortKanjiName.shortKanjiName
    if (nationalFlag.shortKanjiName === nationalFlagShortKanjiName) {

      console.log("左カードOK:" + nationalFlag.shortKanjiName);
      console.log("右カードOK:" + nationalFlagShortKanjiName);

      setTimeout(() => {
        if(this.prevSceneData.mode == "versus"){
          this.PlayerPointAdd();
        }

        if (this.isFlippedAll()) {
          this.goToResultScene({isWon: true});
        }

        this.triedCount++;

        this.initFlippedArea();
        this.refreshCounter();
        
      }, ANIMATION_DURATION_FLIP * 2);
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
          flippedComponent.scaleX,
          flippedComponent.scaleY,
        )
      }, ANIMATION_DURATION_FLIP);
    });

      setTimeout(() => {
        this.triedCount++;
        if(this.prevSceneData.mode === "practice"){
          if (this.isGameOver()) {
            this.goToResultScene({isWon: false});
          }
        }

        this.initFlippedArea();
        this.refreshCounter();
        
      }, ANIMATION_DURATION_FLIP * 2);

    this.flippedComponents = this.flippedComponents.slice(0, this.flippedComponents.length - 2)
  }

  refreshCounter = () => {
    if(this.prevSceneData.mode == "practice"){
      this.TryLimitComponent.setText(this.TryCount());
    }else if(this.prevSceneData.mode == "versus"){
        this.NowPlayer_Text();
      
      this.Player1PointComponent.setText((this.Player1NowPoint().toString()));
      this.Player2PointComponent.setText((this.Player2NowPoint().toString()));

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
    
    console.log(contents);
  }
}