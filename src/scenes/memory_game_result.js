import Phaser from "phaser";
import CameraFadeIn from "./ui/CameraFadeIn";
import SettingButton from "../components/setting_button";
import SoundButton from "../components/sound_button";

const debugMode = false;
const dataForDebugging = {
  level: "level1",
  numberOfCorrected: 30,
  questions: 10,
};

export default class MemoryGameResult extends Phaser.Scene {
  constructor() {
    super({ key: "MemoryRuselt", active: debugMode });
    this.fontFamily = undefined;
    this.prevSceneData = undefined;
  }

  preload() {
    // メニュー画面に出てくる画像のロード
    this.load.path = window.location.href.replace("index.html", "");

    this.load.image("sound", "assets/img/sound.png");
    this.load.image("bg", "assets/img/bg.png");
    this.load.image("cloud", "assets/img/game_cloud.png");
    this.load.image("tree", "assets/animation/tree.png");
    this.load.image("mogura-upper-body", "assets/img/mogura.png");
    this.load.image("fukidashi", "assets/img/fukidashi.png");
    this.load.image("clown", "assets/img/clown.png");

    // bgm
    this.load.audio("ending", "assets/audio/ending.mp3");

    this.load.html("nameForm", "../../assets/html/form.html");
    // 花火GIF
    for (let i = 1; i <= 6; i += 1)
      this.load.image(`fire${i}`, `assets/animation/fireFlower/fire${i}.png`);

    // もぐらんGIF
    for (let i = 1; i <= 36; i += 1) {
      const fn = String(i).padStart(2, "0");
      this.load.image(
        `moguraAnim${i}`,
        `assets/animation/mogura2/moguraAnim2_${fn}.png`
      );
    }
  }

  init(data) {
    this.prevSceneData = {
      level: data.level,
      isWon:data.isWon,
      MaxCount:data.MaxCount,
      TriedCount:data.TriedCount,
      mode:data.mode,
      p1point:data.p1point,
      p2point:data.p2point
    };
    if (debugMode) this.prevSceneData = dataForDebugging;
    this.fontFamily = this.registry.get("fontFamily");
  }
  create() {
    this.startCameraFadeIn();
    this.soundButton = new SoundButton(this, 70, 700, 40);
    this.soundButton.depth = 3;

    // リザルト表示
    const gameResultFontStyle = {
      color: "#32b65e",
      fontFamily: "SemiBold",
      fontSize: "64px",
      stroke: "#DFD1B5",
      strokeThickness: 4,
    };

    this.backTopButton = this.createBackTopButton();
    this.backGameSetButton = this.createBackGameSetButton();
    this.retryGameButton = this.createRetryGameButton();
    
    if(this.prevSceneData.mode == "practice"){
      if(this.prevSceneData.isWon){
        // ゲームクリア
        this.add
          .text(
            this.game.canvas.width / 2,
            150,
            `GAME CLEAR !!!`,
            gameResultFontStyle
          )
          .setOrigin(0.5, 0);
          this.displayResultDetails();
        }else{
          // ゲームオーバー
          this.add
          .text(
            this.game.canvas.width / 2,
            200,
            `GAME OVER !!!`,
            gameResultFontStyle
          )
          .setOrigin(0.5, 0);
        }
        this.displayGameClearGraphics();
    }else if(this.prevSceneData.mode == "versus"){
      let VSresult = "";
      if(this.prevSceneData.p1point > this.prevSceneData.p2point){
        VSresult = "プレイヤー1の勝ち!"
      }else if(this.prevSceneData.p1point < this.prevSceneData.p2point){
        VSresult = "プレイヤー2の勝ち!"
      }else{
        VSresult = "引き分け!"
      }
      this.add
        .text(
          this.game.canvas.width / 2,
          150,
          VSresult,
          gameResultFontStyle
        )
        .setOrigin(0.5, 0);

        this.add
        .text(
          this.game.canvas.width / 2,
          250,
          this.prevSceneData.p1point+" - "+this.prevSceneData.p2point,
          gameResultFontStyle
        )
        .setOrigin(0.5, 0);
        this.displayGameClearGraphics();
      }
  }

  startCameraFadeIn = () => {
    new CameraFadeIn(this);
  };

  createBackTopButton = () => {
    const backTopButton = new SettingButton(
      this,
      57,
      362,
      265,
      72,
      "トップへ戻る",
      24,
      this.fontFamily
    );
    backTopButton.buttonGraphic.on(
      "pointerdown",
      () => {
        this.scene.start("game_menu");
      },
      this
    );
    return backTopButton;
  };

  createBackGameSetButton = () => {
    const backGameSetButton = new SettingButton(
      this,
      377,
      362,
      265,
      72,
      "ゲーム設定に戻る",
      24,
      this.fontFamily
    );
    backGameSetButton.buttonGraphic.on(
      "pointerdown",
      () => {
        this.scene.start("MemoryModeSetting");
      },
      this
    );
    return backGameSetButton;
  };

  createRetryGameButton = () => {
    const retryGameButton = new SettingButton(
      this,
      697,
      362,
      265,
      72,
      "もう一度プレイする",
      24,
      this.fontFamily
    );
    retryGameButton.buttonGraphic.on(
      "pointerdown",
      () => {
        this.scene.start("memory_game",
          {
            level:this.prevSceneData.level,
            mode:this.prevSceneData.mode
          }
        );
      },
      this
    );
    return retryGameButton;
  };

  displayResultDetails() {

    const number1Object = this.add.text(0, 0, this.prevSceneData.TriedCount, {
      color: "#D53F3F",
      fontFamily: this.fontFamily,
      fontSize: "64px",
    });
    const text1Object = this.add.text(
      number1Object.width,
      0,
      "/",
      {
        color: "#333333",
        fontFamily: this.fontFamily,
        fontSize: "64px",
      }
    );
    const number2Object = this.add.text(text1Object.width + number1Object.width
      , 0, 
      this.prevSceneData.MaxCount, {
      color: "#D53F3F",
      fontFamily: this.fontFamily,
      fontSize: "64px",
    });

    const text2Object = this.add.text(text1Object.width + number1Object.width + number2Object.width + 10
      , 22, "手でクリア!", {
      color: "#333333",
      fontFamily: this.fontFamily,
      fontSize: "32px",
    });

    const container = this.add.container(0, 230, [
      number1Object,
      text1Object,
      number2Object,
      text2Object
    ]);
    container.setSize(
      number1Object.width + text1Object.width + number2Object.width + text2Object.width,
      number1Object.height
    );
    container.setX(this.game.canvas.width / 2 - container.width / 2);
  }

  displayGameClearGraphics() {
    // 背景
    this.add.graphics().fillStyle(0xebfdff, 1).fillRect(0, 0, 1024, 768).depth =
      -1;

    // 雲2つ
    this.add.image(100, 100, "cloud");
    this.add.image(900, 120, "cloud");

    // 木
    this.add.image(900, 470, "tree").depth = -1;

    // 地面
    this.add.image(510, 682, "bg");
    
    if(this.prevSceneData.isWon){
      // bgm
      this.sound.play("ending");

      // 花火
      this.anims.create({
        key: "fireFlower",
        frames: [
          { key: "fire1", duration: 300 },
          { key: "fire2", duration: 200 },
          { key: "fire3", duration: 200 },
          { key: "fire4", duration: 200 },
          { key: "fire5", duration: 200 },
          { key: "fire6", duration: 200 },
        ],
        frameRate: 24,
        repeat: -1,
      });
      this.add.sprite(115, 350, "fire1").setOrigin(0, 1).play("fireFlower");
      this.add.sprite(650, 350, "fire1").setOrigin(0, 1).play("fireFlower");

      // 仮もぐらんGIF
      this.anims.create({
        key: "moguraAnimation2",
        frames: [
          { key: "moguraAnim1", duration: 100 },
          { key: "moguraAnim2", duration: 100 },
          { key: "moguraAnim3", duration: 100 },
          { key: "moguraAnim4", duration: 100 },
          { key: "moguraAnim5", duration: 100 },
          { key: "moguraAnim6", duration: 100 },
          { key: "moguraAnim7", duration: 100 },
          { key: "moguraAnim8", duration: 100 },
          { key: "moguraAnim9", duration: 100 },
          { key: "moguraAnim10", duration: 100 },
          { key: "moguraAnim11", duration: 100 },
          { key: "moguraAnim12", duration: 100 },
          { key: "moguraAnim13", duration: 100 },
          { key: "moguraAnim14", duration: 100 },
          { key: "moguraAnim15", duration: 100 },
          { key: "moguraAnim16", duration: 100 },
          { key: "moguraAnim17", duration: 100 },
          { key: "moguraAnim18", duration: 100 },
          { key: "moguraAnim19", duration: 100 },
          { key: "moguraAnim20", duration: 100 },
          { key: "moguraAnim21", duration: 100 },
          { key: "moguraAnim22", duration: 100 },
          { key: "moguraAnim23", duration: 100 },
          { key: "moguraAnim24", duration: 100 },
          { key: "moguraAnim25", duration: 100 },
          { key: "moguraAnim26", duration: 100 },
          { key: "moguraAnim27", duration: 100 },
          { key: "moguraAnim28", duration: 100 },
          { key: "moguraAnim29", duration: 100 },
          { key: "moguraAnim30", duration: 100 },
          { key: "moguraAnim31", duration: 100 },
          { key: "moguraAnim32", duration: 100 },
          { key: "moguraAnim33", duration: 100 },
          { key: "moguraAnim34", duration: 100 },
          { key: "moguraAnim35", duration: 100 },
          { key: "moguraAnim36", duration: 100 },
          { key: "moguraAnim23", duration: 100 },
          { key: "moguraAnim24", duration: 100 },
          { key: "moguraAnim25", duration: 100 },
        ],
        frameRate: 24,
        repeat: -1,
      });
      this.add
        .sprite(260, 400, "moguraAnim1")
        .setOrigin(0, 0)
        .setSize(400, 290.8)
        .play("moguraAnimation2");
      this.add
        .sprite(360, 400, "moguraAnim1")
        .setOrigin(0, 0)
        .setSize(400, 290.8)
        .play("moguraAnimation2");
      this.add
        .sprite(460, 400, "moguraAnim1")
        .setOrigin(0, 0)
        .setSize(400, 290.8)
        .play("moguraAnimation2");
    }
  }
}
