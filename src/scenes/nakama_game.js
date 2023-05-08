import Phaser from "phaser";
import NakamaContainer from "./ui/NakamaContainer";
import BackGround from "./ui/BackGround";
import SoundButton from "../components/sound_button";
import TimeStopLabel from "./ui/TimerStopLabel.js";

const bgms = [
  ["game_bgm", "assets/audio/timer.mp3"],
  ["correct_se", "assets/audio/correct.mp3"],
  ["but_se", "assets/audio/but_se.mp3"],
];
const images = [
  ["maru", "assets/img/maru.png"],
  ["batu", "assets/img/batu.png"],
  ["correctmogura", "assets/img/fun_mogura2.png"],
  ["mistakemogura", "assets/img/sad_mogura.png"],
  ["tenniscourt", "assets/img/tennis_court.png"],
  ["go", "assets/img/navi_go.png"],
  ["ok", "assets/img/ok.png"],
  ["kotae", "assets/img/kotae.png"],
];

const debugMode = false;
const Level = NakamaContainer.Level;

export default class NakamaGame extends Phaser.Scene {
  constructor() {
    super({ key: "nakama_game", active: debugMode });
    this.nakamaContainer = undefined;
  }

  preload() {
    this.load.path = window.location.href.replace("index.html", "");
    // bgm
    bgms.forEach((bgm) => {
      this.load.audio(bgm[0], bgm[1]);
    });
    images.forEach((image) => {
      this.load.image(image[0], image[1]);
    });
  }

  init(data) {
    this.fontFamily = this.registry.get("fontFamily");
    this.prevSceneData = {
      level: debugMode ? Level[1].name : data.level,
    };
  }

  create() {
    this.createBackGround();
    this.createTennisCourt();
    this.createSoundButton();
    this.startMusic();
    this.nakamaContainer = this.createNakamaContainer();
    this.nakamaContainer.start(this, this.transitionToResult);
    // NOTE: デバッグ用
    // this.add.line(0, 0, 512, 384, 512, 1100, 0x000000);
    // this.createDraggableAreaBg();
    this.createTimeStopLabel();
    this.events.on("resume", (scene, data) => {
      switch (data.status) {
        case "restart":
          this.sound.stopAll();
          this.scene.stop();
          this.scene.start("nakama_game", {
            level: this.prevSceneData.level,
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
          this.scene.start("nakama_game_setting", {
            level: this.prevSceneData.level,
          });
          break;
        default:
      }
    });
  }

  createNakamaContainer = () => {
    return new NakamaContainer(this, 0, 0, this.prevSceneData.level);
  };

  createBackGround = () => {
    new BackGround(this, { color: 0xc9dfa5, alpha: 1 });
  };

  createTennisCourt = () => {
    this.add
      .sprite(512, 384, "tenniscourt")
      .setScale(1.3, 1.3)
      .setOrigin(0.5, 0.47);
  };

  createSoundButton = () => {
    new SoundButton(this, 70, 700, 40);
  };

  startMusic = () => {
    this.sound.play("game_bgm", { loop: true });
  };

  transitionToResult = () => {
    this.sound.stopAll();
    this.scene.start("nakama_game_result", {
      level: this.prevSceneData.level,
      questions: this.nakamaContainer.questionsCounter,
      numberOfCorrected: this.nakamaContainer.correctedCounter,
    });
  };

  createDraggableAreaBg = () => {
    const areaBg = this.add.graphics();
    areaBg.fillStyle(0xffffff, 0.5).fillRect(0, 200, 1024, 400);
  };

  createTimeStopLabel = () => {
    const timeStopLabel = new TimeStopLabel(this, 775, 672, "一時停止", {
      color: "#333333",
      fontSize: "32px",
      fontFamily: this.fontFamily,
    });
    timeStopLabel.setInteractive().on("pointerdown", () => {
      this.scene.pause();
      this.scene.launch("nakama_pause_menu");
    });
  };
}
