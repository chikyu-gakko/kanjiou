import Phaser from "phaser";

const HOW_TO_PLAY = `裏向きの左右のカードをペアにするゲームだよ。漢字と読み方、
文字とイラストをタッチして、早くペアにしてね。記憶力が大切だよ。
一人で遊ぶこともできるし、誰かと対戦することもできるよ。`;

export default class memory_how_to_play extends Phaser.Scene {
  constructor() {
    super({
      key: "memory_how_to_play",
      active: false
    });
  }

  init() {
    this.fontFamily = this.registry.get("fontFamily");
  }

  preload() {
    this.load.path = window.location.href.replace("index.html", "");

    // もぐらんボタン
    this.load.image("funMoguraImg", "assets/img/fun_mogura.png");

    // サウンドアイコン
    this.load.image("sound", "assets/img/sound.png");
    this.load.image("mute", "assets/img/mute.png");

    // ミニゲーム中bgm
    this.load.audio("correct_se", "assets/audio/correct.mp3");
    this.load.audio("but_se", "assets/audio/but_se.mp3");

    this.load.image("maru", "assets/img/maru.png");
    this.load.image("batu", "assets/img/batu.png");
    this.load.image("correctmogura", "assets/img/fun_mogura2.png");
    this.load.image("mistakemogura", "assets/img/sad_mogura.png");

    // 遊び方画像
    this.load.image("memory_how_to_play", "assets/img/memory_howtoplay.png");
  }

  create() {
    // 画面描画（大）
    this.add.graphics().fillStyle(0xffffff, 1).fillRect(121, 37, 788, 694);

    // 画面描画（大）
    this.add.graphics().fillStyle(0xeaeaea, 1).fillRect(231, 82, 561, 319);
    this.add.sprite(511, 242, "memory_how_to_play").setScale(0.3, 0.3);

    this.add
      .text(520, 468, HOW_TO_PLAY, {
        fontSize: "24px",
        color: "#333333",
        fontFamily: this.fontFamily,
      })
      .setOrigin(0.5, 0);

    // 「わかった」ボタン
    this.add
      .graphics()
      .lineStyle(2, 0x645246)
      .fillStyle(0x32b65e, 1)
      .fillRoundedRect(331, 615, 368, 80, 40)
      .strokePath()
      .setInteractive(
        new Phaser.Geom.Rectangle(331, 615, 368, 80),
        Phaser.Geom.Rectangle.Contains
      )
      .on(
        "pointerdown",
        () => {
          this.scene.start("MemoryModeSetting");
        },
        this
      );

    this.add.text(453, 635, "わかった！", {
      fontSize: "32px",
      color: "#FFFFFF",
      fontFamily: this.fontFamily,
    });

    // もぐら
    this.add.sprite(400, 650, "funMoguraImg");
  }
}