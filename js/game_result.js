import SoundButton from "./sound_button.js";

export default class GameResult extends Phaser.Scene {
  constructor() {
    super({ key: "game_result", active: false });
  }

  preload() {
    // メニュー画面に出てくる画像のロード
    this.load.path = window.location.href.replace("index.html", "");

    this.load.image("sound", "img/sound.png");
    this.load.image("bg", "img/bg.png");
    this.load.image("cloud", "img/game_cloud.png");
    this.load.image("tree", "assets/animation/tree.png");

    // bgm
    this.load.audio("ending", "audio/ending.mp3");

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
    this.mode = data.mode;
    this.timer = data.time;
    this.answers = data.answers;
    this.fontFamily = this.registry.get("fontFamily");
  }

  create() {
    this.cameras.main.fadeIn(2000);
    this.add.graphics().fillStyle(0xebfdff, 1).fillRect(0, 0, 1024, 768);

    // 画像表示
    // 雲2つ
    this.add.image(100, 100, "cloud");
    this.add.image(900, 120, "cloud");

    // 木
    this.add.image(900, 470, "tree");

    // 地面
    const bgImage = this.add.image(510, 682, "bg");
    bgImage.depth = 2;

    this.soundButton = new SoundButton(this, 70, 700, 40);
    this.soundButton.depth = 3;

    // bgm
    const endingBgm = this.sound.add("ending");
    endingBgm.allowMultiple = false;
    endingBgm.play();

    // リザルト表示
    const gameResultFontStyle = {
      color: "#32b65e",
      fontFamily: "SemiBold",
      fontSize: "64px",
      stroke: "#DFD1B5",
      strokeThickness: 4,
    };

    if (this.mode === "timeLimit" && this.timer === 60) {
      // ゲームオーバー
      this.add
        .text(this.game.canvas.width / 2, 84, `GAME OVER`, gameResultFontStyle)
        .setOrigin(0.5, 0);

      this.add
        .text(
          this.game.canvas.width / 2,
          230,
          `クリアした問題数:${this.answers}問`,
          {
            color: "#333333",
            fontFamily: this.fontFamily,
            fontSize: "32px",
          }
        )
        .setOrigin(0.5, 0);
    } else {
      // ゲームクリア
      this.add
        .text(
          this.game.canvas.width / 2,
          84,
          `GAME CLEAR !!!`,
          gameResultFontStyle
        )
        .setOrigin(0.5, 0);
      this.displayResultDetails();
    }

    const backTopButton = this.add.graphics();

    backTopButton
      .lineStyle(5, 0x645246)
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(57, 332, 265, 72, 35)
      .strokePath()
      .setInteractive(
        new Phaser.Geom.Rectangle(57, 332, 265, 72),
        Phaser.Geom.Rectangle.Contains
      ).depth = 2;

    backTopButton.on(
      "pointerdown",
      () => {
        this.scene.start("game_menu");
      },
      this
    );

    const backTopText = this.add.text(115, 355, "トップへ戻る", {
      fontSize: "24px",
      fontFamily: this.fontFamily,
      color: "#333333",
    });

    backTopText.setPadding(4).depth = 3;

    // ゲーム設定に戻るボタン
    const backGameSetButton = this.add.graphics();

    backGameSetButton
      .lineStyle(5, 0x645246)
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(377, 332, 265, 72, 35)
      .strokePath()
      .setInteractive(
        new Phaser.Geom.Rectangle(377, 332, 265, 72),
        Phaser.Geom.Rectangle.Contains
      ).depth = 2;

    backGameSetButton.on(
      "pointerdown",
      () => {
        this.scene.start("game_setting");
      },
      this
    );

    const backGameSetText = this.add.text(415, 355, "ゲーム設定に戻る", {
      fontSize: "24px",
      fontFamily: this.fontFamily,
      color: "#333333",
    });

    backGameSetText.setPadding(4).depth = 3;

    // もう一度プレイするボタン
    const retryGameButton = this.add.graphics();

    retryGameButton
      .lineStyle(5, 0x645246)
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(697, 332, 265, 72, 35)
      .strokePath()
      .setInteractive(
        new Phaser.Geom.Rectangle(697, 332, 265, 72),
        Phaser.Geom.Rectangle.Contains
      ).depth = 2;

    retryGameButton.on(
      "pointerdown",
      () => {
        this.scene.start("hitsuji_game");
      },
      this
    );

    const retryGameText = this.add.text(725, 355, "もう一度プレイする", {
      fontSize: "24px",
      fontFamily: this.fontFamily,
      color: "#333333",
    });

    retryGameText.setPadding(4).depth = 3;

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

    const fireFlower1 = this.add.sprite(115, 350, "fire1");
    fireFlower1.setOrigin(0, 1).play("fireFlower").depth = 1;

    const fireFlower2 = this.add.sprite(650, 350, "fire1");
    fireFlower2.setOrigin(0, 1).play("fireFlower").depth = 1;

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

    const mogura1 = this.add.sprite(260, 400, "moguraAnim1");
    mogura1.setOrigin(0, 0).play("moguraAnimation2").depth = 4;

    const mogura2 = this.add.sprite(360, 400, "moguraAnim1");
    mogura2.setOrigin(0, 0).play("moguraAnimation2").depth = 4;

    const mogura3 = this.add.sprite(460, 400, "moguraAnim1");
    mogura3.setOrigin(0, 0).play("moguraAnimation2").depth = 4;
  }

  displayResultDetails() {
    const text1 = (() => {
      switch (this.mode) {
        case "timeLimit":
          return "残り時間：";
        case "timeAttack":
          return "かかった時間：";
        case "suddenDeath":
          return "クリアした問題数：";
        default:
          return "";
      }
    })();
    const number = (() => {
      switch (this.mode) {
        case "timeLimit":
          return 60 - this.timer;
        case "timeAttack":
          return this.timer;
        case "suddenDeath":
          return this.answers;
        default:
          return "";
      }
    })();
    const text2 = this.mode === "suddenDeath" ? " 問" : " 秒";

    const text1Object = this.add.text(0, 22, text1, {
      color: "#333333",
      fontFamily: this.fontFamily,
      fontSize: "32px",
    });
    const numberObject = this.add.text(text1Object.width, 0, number, {
      color: "#D53F3F",
      fontFamily: this.fontFamily,
      fontSize: "64px",
    });
    const text2Object = this.add.text(
      text1Object.width + numberObject.width,
      22,
      text2,
      {
        color: "#333333",
        fontFamily: this.fontFamily,
        fontSize: "32px",
      }
    );

    const container = this.add.container(0, 195, [
      text1Object,
      numberObject,
      text2Object,
    ]);
    container.setSize(
      text1Object.width + numberObject.width + text2Object.width,
      numberObject.height
    );
    container.setX(this.game.canvas.width / 2 - container.width / 2);
  }
}
