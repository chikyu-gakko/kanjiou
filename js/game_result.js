export default class GameResult extends Phaser.Scene {
  constructor() {
    super({ key: "game_result", actisve: false });
  }

  preload() {
    // メニュー画面に出てくる画像のロード

    this.load.image("sound", "../img/sound.png");
    this.load.image("bg", "../img/bg.png");
    this.load.image("cloud", "../img/game_cloud.png");
    this.load.image("tree", "../assets/animation/tree.png");

    // bgm
    this.load.audio("ending", "../audio/ending.mp3");

    // 花火GIF
    this.load.image("fire1", "../img/fire1.png");
    this.load.image("fire2", "../img/fire2.png");
    this.load.image("fire3", "../img/fire3.png");
    this.load.image("fire4", "../img/fire4.png");
    this.load.image("fire5", "../img/fire5.png");
    this.load.image("fire6", "../img/fire6.png");

    // もぐらん仮GIF
    this.load.image("shiba1", "../img/shiba1.png");
    this.load.image("shiba2", "../img/shiba2.png");
    this.load.image("shiba3", "../img/shiba3.png");
    this.load.image("shiba4", "../img/shiba4.png");
  }

  init(data) {
    this.timer = data.time;
    this.answers = data.answers;
  }

  create() {
    this.cameras.main.fadeIn(2000);

    // 画像表示
    // 雲2つ
    const cloud1 = this.add.image(100, 100, "cloud");
    cloud1.depth = 1;
    const cloud3 = this.add.image(900, 120, "cloud");
    cloud3.depth = 1;

    // 木
    this.depth = 0;
    const tree = this.add.image(900, 470, "tree");
    tree.depth = 1;

    // 地面
    const bgImage = this.add.image(510, 682, "bg");
    bgImage.depth = bgImage.y;
    bgImage.depth = 2;

    // 背景描画
    const bgGameMenu = this.add.graphics();
    bgGameMenu.fillStyle(0xebfdff, 1).fillRect(0, 0, 1024, 768);

    // 音声アイコン枠描画
    const soundCircle = this.add.graphics();
    soundCircle.fillStyle(0x333333, 1).fillCircle(70, 700, 40).depth = 3;

    // 音声アイコン
    const soundIcon = this.add.sprite(70, 700, "sound");
    soundIcon.setInteractive().depth = 4;

    // リザルト表示

    // bgm
    const endingBgm = this.sound.add("ending");
    endingBgm.allowMultiple = false;
    endingBgm.play();

    // クリアメッセージ
    this.add.text(270, 84, `GAME CLEAR !!!`, {
      fill: 0x32b65e,
      fontFamily: "SemiBold",
      fontSize: "64px",
    });
    // .setOrigin(0.5, 0);

    // 正解数
    this.add.text(350, 230, `クリアした問題数:${this.answers}問`, {
      fill: 0x333333,
      fontFamily: "Arial",
      fontSize: "32px",
    });
    // .setOrigin(0.5, 0);

    const backTopButton = this.add.graphics();

    backTopButton
      .lineStyle(5, 0x645246)
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(57, 332, 265, 72, 35)
      .strokePath()
      .setInteractive(
        new Phaser.Geom.Rectangle(57, 332, 272, 72),
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
      fill: "#333333",
    });

    backTopText.setPadding(4).depth = 3;

    // ゲーム設定に戻るボタン
    const backGameSetButton = this.add.graphics();

    backGameSetButton
      .lineStyle(5, 0x645246)
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(697, 332, 265, 72, 35)
      .strokePath()
      .setInteractive(
        new Phaser.Geom.Rectangle(697, 332, 265, 72),
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
      fill: "#333333",
    });

    backGameSetText.setPadding(4).depth = 3;

    // もう一度プレイするボタン
    const retryGameButton = this.add.graphics();

    retryGameButton
      .lineStyle(5, 0x645246)
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(377, 332, 265, 72, 35)
      .strokePath()
      .setInteractive(
        new Phaser.Geom.Rectangle(377, 332, 265, 72),
        Phaser.Geom.Rectangle.Contains
      ).depth = 2;

    retryGameButton.on(
      "pointerdown",
      () => {
        this.scene.start("Hituji_game");
      },
      this
    );

    const retryGameText = this.add.text(725, 355, "もう一度プレイする", {
      fontSize: "24px",
      fill: "#333333",
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
      key: "shiba",
      frames: [
        { key: "shiba1", duration: 100 },
        { key: "shiba2", duration: 100 },
        { key: "shiba3", duration: 100 },
        { key: "shiba4", duration: 100 },
      ],
      frameRate: 24,
      repeat: -1,
    });

    const shiba = this.add.sprite(360, 400, "shiba1");
    shiba.setOrigin(0, 0).play("shiba").depth = 4;
  }
}
