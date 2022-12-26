import NakamaContainer from "./ui/NakamaContainer";
import BackGround from "./ui/BackGround";
import SoundButton from "../components/sound_button";

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
    this.createSoundButton();
    this.startMusic();
    this.nakamaContainer = this.createNakamaContainer();
    this.nakamaContainer.start(this);
    this.add.line(0, 0, 512, 384, 512, 1100, 0x000000);
  }

  createNakamaContainer = () => {
    return new NakamaContainer(this, 0, 0, this.prevSceneData.level);
  };

  createBackGround = () => {
    new BackGround(this, { color: 0xeaeaea, alpha: 1 });
  };

  createSoundButton = () => {
    new SoundButton(this, 70, 700, 40);
  };

  startMusic = () => {
    this.sound.play("game_bgm", { loop: true });
  };
}
