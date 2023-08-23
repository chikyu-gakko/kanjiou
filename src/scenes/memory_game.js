import Phaser from "phaser";

import { nationalFlags } from "../data/nationalFlags";
import SoundButton from "../components/sound_button";
import BackGround from "./ui/BackGround";
import { LEVEL1, LEVEL2, LEVEL3 } from "./constants/level";
import { COLOR_LIGHT_BLACK, COLOR_LIGHT_GRAY, COLOR_PALE_GREEN } from "./constants/color";

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

    this.nationalFlags               = [];
    this.nationalFlagShortKanjiNames = [];
    this.nationalFlagsCount          = 0;

    this.gameConfig = {
      level: 0,
    };
    
    this.maxTryCount = 0;
    this.triedCount  = 0;
    this.triedCountComponent = undefined;
    this.tryCountComponent   = undefined;

    this.flippedAreas      = {};
    this.flippedComponents = [];
  }

  preload = () => {
    nationalFlags.forEach((nationalFlag) => {
      this.load.image(nationalFlag.englishName, nationalFlag.imagePath);
    });
    this.load.image(CARD_BACK_SIDE_IMAGE_KEY, 'assets/img/card/3_2_mogran.png');
  }

  /**
   * @typedef {Object} MemoryGameConfig
   * @property {number} level
   * 
   * @param {MemoryGameConfig} data 
   */
  init = (data) => {
    if (DEBUG_MODE) {
      data = {
        level: LEVEL1,
      }
    }

    this.gameConfig = {
      level: data.level
    };
    
    this.maxTryCount                 = this.levelToMaxTryCount(this.gameConfig.level)
    
    this.nationalFlagsCount          = this.levelToNationalFlagsCount(this.gameConfig.level);
    this.nationalFlags               = this.randomlySelectNationalFlags(this.nationalFlagsCount);
    this.nationalFlagShortKanjiNames = this.mixedUpArray(this.nationalFlags.map(({ shortKanjiName }) => shortKanjiName));
    this.createShortKanjiNameTextures();
  }

  create = () => {
    this.createBackGround();
    this.createSoundButton();
    this.createBoundaryLine();
    this.createNationalFlagImages();
    this.createNationalFlagShortKanjiNames();
    this.createTryCountText();
    this.createTriedCountText();
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

    this.nationalFlagShortKanjiNames.forEach((nationalFlagShortKanjiName) => {
      const shortKanjiNameBackground = this.add
        .rectangle(GLOBAL_START_POSITION_X, GLOBAL_START_POSITION_Y, IMAGE_SIZE_WIDTH, IMAGE_SIZE_HEIGHT, COLOR_LIGHT_GRAY.toNumber(), 1)
        .setOrigin(0, 0)
        .setDisplaySize(IMAGE_SIZE_WIDTH, IMAGE_SIZE_HEIGHT);

      const FONT_SIZE = 64;
      const localStartPositionXForText = GLOBAL_START_POSITION_X + IMAGE_SIZE_WIDTH / 2 - FONT_SIZE / 2;
      const localStartPositionYForText = GLOBAL_START_POSITION_Y + IMAGE_SIZE_HEIGHT / 2 - FONT_SIZE / 2;

      const shortKanjiName = this.add
        .text(
          localStartPositionXForText,
          localStartPositionYForText,
          nationalFlagShortKanjiName,
          { color: COLOR_LIGHT_BLACK.toString(), fontSize: `${FONT_SIZE}px` }
        )
        .setOrigin(0, 0)

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

  createBoundaryLine = () => {
    const PADDING_HEIGHT = 64;
    const GLOBAL_START_POSITION_X = this.sys.game.canvas.width / 2;
    const GLOBAL_START_POSITION_Y = 250;
    
    this.add
      .line(
        0,
        GLOBAL_START_POSITION_Y - PADDING_HEIGHT,
        GLOBAL_START_POSITION_X,
        GLOBAL_START_POSITION_Y,
        GLOBAL_START_POSITION_X,
        this.sys.game.canvas.height - PADDING_HEIGHT,
        COLOR_LIGHT_BLACK.toNumber(),
      )
  }

  /**
   * @param {number} count 
   * @returns {NationalFlag[]}
   */
  randomlySelectNationalFlags = (count) => {
    if (count > nationalFlags.length) {
      throw new Error(ERROR_MESSAGE_FOR_NATIONAL_FLAGS_COUNT);
    }

    const result = [];

    while (result.length < count) {
      const randomIndex = Math.floor(Math.random() * nationalFlags.length);
      const randomElement = nationalFlags[randomIndex];
      
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

      let isFinishedFlipAnimation = true;
      nationalFlagComponent.on(
        'pointerdown',
        () =>  {
          if (!isFinishedFlipAnimation || FLIPED_AREA.NATIONAL_FLAG in this.flippedAreas || this.flippedComponents.includes(nationalFlagComponent)) {
            return;
          }

          isFinishedFlipAnimation = false;

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

  leftTryCount = () => {
    return `あと${this.maxTryCount - this.triedCount}回`;
  }

  currentTryCount = () => {
    return `${this.triedCount + 1}回目`;
  }
  
  createTryCountText = () => {
    const GLOBAL_START_POSITION_X = this.sys.game.canvas.width / 2;
    const GLOBAL_START_POSITION_Y = 64;

    this.tryCountComponent = this.add
      .text(
        GLOBAL_START_POSITION_X,
        GLOBAL_START_POSITION_Y,
        this.leftTryCount(),
        {
          color: COLOR_LIGHT_BLACK.toString(),
          fontSize: '64px',
        }
      )
      .setOrigin(.5, 0)
  }
  
  createTriedCountText = () => {
    const GLOBAL_START_POSITION_X = 32;
    const GLOBAL_START_POSITION_Y = 32;

    this.triedCountComponent = this.add
      .text(
        GLOBAL_START_POSITION_X,
        GLOBAL_START_POSITION_Y,
        this.currentTryCount(),
        {
          color: COLOR_LIGHT_BLACK.toString(),
          fontSize: '32px',
        }
      )
      .setOrigin(0, 0)
  }

  /**
   * @typedef {Object} InitResultSceneData
   * @property {boolean} isWon
   * 
   * @param {InitResultSceneData} data 
   */
  goToResultScene = (data) => {
    this.scene.start('memory_game_result', data);
  }
  
  validateNeurastheniaMatch = () => {
    const nationalFlag = this.flippedAreas[FLIPED_AREA.NATIONAL_FLAG];
    const nationalFlagShortKanjiName = this.flippedAreas[FLIPED_AREA.NATIONAL_FLAG_KANJI];
    this.consoleLogForDebug(this.flippedAreas);
    this.consoleLogForDebug(this.flippedComponents);

    if (nationalFlag.shortKanjiName === nationalFlagShortKanjiName) {
      setTimeout(() => {
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
      if (this.isGameOver()) {
        this.goToResultScene({isWon: false});
      }

      this.initFlippedArea();
      this.refreshCounter();
    }, ANIMATION_DURATION_FLIP * 2);

    this.flippedComponents = this.flippedComponents.slice(0, this.flippedComponents.length - 2)
  }

  refreshCounter = () => {
    this.tryCountComponent.setText(this.leftTryCount());
    this.triedCountComponent.setText(this.currentTryCount());
  }

  consoleLogForDebug = (...contents) => {
    if (!DEBUG_MODE) {
      return;
    }
    
    console.log(contents);
  }
}