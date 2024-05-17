import Phaser from "phaser";
import BackGround from "./ui/BackGround";
import SoundButton from "../components/sound_button";
import TimeStopLabel from "./ui/TimerStopLabel.js";
import NakamaGameStrokeCountContainer from "./ui/NakamaStrokeCountContainer";

const BGMS = {
  GAME_BGM: 'assets/audio/timer.mp3',
};
const SES = {
  CORRECT_SE: 'assets/audio/correct.mp3',
  BUT_SE: 'assets/audio/but_se.mp3',
}
const IMAGES = {
  MARU: 'assets/img/maru.png',
  BATU: 'assets/img/batu.png',
  CORRECT_MOGURA: 'assets/img/fun_mogura2.png',
  MISTAKE_MOGURA: 'assets/img/sad_mogura.png',
  TANNIS_COURT: 'assets/img/tennis_court.png',
  GO: 'assets/img/navi_go.png',
  OK: 'assets/img/ok.png',
  KOTAE: 'assets/img/kotae.png',
};

export default class NakamaGameStrokeCount extends Phaser.Scene {
  constructor() {
    super({ key: "nakama_game_stroke_count", active: false });
    this.nakamaGameStrokeCountContainer = undefined;
    this.level                          = undefined;
  }

  preload() {
    this.load.path = window.location.href.replace("index.html", "");
    const loadAudioCommand = ([name, path]) => {
      this.load.audio(name, path);
    }
    const loadImageCommand = ([name, path]) => {
      this.load.image(name, path);
    }
    
    Object.entries(BGMS).forEach(loadAudioCommand);
    Object.entries(SES).forEach(loadAudioCommand);
    Object.entries(IMAGES).forEach(loadImageCommand);
  }

  init(data) {
    this.fontFamily = this.registry.get("fontFamily");
    this.level = data.level;
  }

  create() {
    this.createBackGround();
    this.createTennisCourt();
    this.createSoundButton();
    this.startMusic();
    this.nakamaGameStrokeCountContainer = this.createNakamaGameStrokeCountContainer();
    this.nakamaGameStrokeCountContainer.start(this, this.transitionToResult);
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
            level: this.level,
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
            level: this.level,
          });
          break;
        default:
      }
    });
  }

  createNakamaGameStrokeCountContainer = () => {
    return new NakamaGameStrokeCountContainer(this, 0, 0, this.level);
  };

  createBackGround = () => {
    new BackGround(this, { color: 0xc9dfa5, alpha: 1 });
  };

  createTennisCourt = () => {
    this.add
      .sprite(512, 384, "TANNIS_COURT")
      .setScale(1.3, 1.3)
      .setOrigin(0.5, 0.47);
  };

  createSoundButton = () => {
    new SoundButton(this, 70, 700, 40);
  };

  startMusic = () => {
    this.sound.play("GAME_BGM", { loop: true });
  };

  transitionToResult = () => {
    this.sound.stopAll();
    this.scene.start("nakama_game_result", {
      level: this.level,
      questions: this.nakamaGameStrokeCountContainer.questionsCounter,
      numberOfCorrected: this.nakamaGameStrokeCountContainer.correctedCounter,
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
