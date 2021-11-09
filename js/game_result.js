export default class GameResult extends Phaser.Scene {
  constructor() {
    super({ key: "game_result", actisve: false });
  }

  preload() {
    // メニュー画面に出てくる画像のロード
    this.load.path = window.location.href.replace("index.html","");

    this.load.image("sound", "img/sound.png");
    this.load.image("bg", "img/bg.png");
    this.load.image("cloud", "img/game_cloud.png");
    this.load.image("tree", "assets/animation/tree.png");

    // bgm
    this.load.audio("ending", "audio/ending.mp3");

    // 花火GIF
    this.load.image("fire1", "assets/animation/fireFlower/fire1.png");
    this.load.image("fire2", "assets/animation/fireFlower/fire2.png");
    this.load.image("fire3", "assets/animation/fireFlower/fire3.png");
    this.load.image("fire4", "assets/animation/fireFlower/fire4.png");
    this.load.image("fire5", "assets/animation/fireFlower/fire5.png");
    this.load.image("fire6", "assets/animation/fireFlower/fire6.png");

    // もぐらんGIF
    this.load.image("mogura1", "assets/animation/mogura2/moguraAnim2_01.png");
    this.load.image("mogura2", "assets/animation/mogura2/moguraAnim2_02.png");
    this.load.image("mogura3", "assets/animation/mogura2/moguraAnim2_03.png");
    this.load.image("mogura4", "assets/animation/mogura2/moguraAnim2_04.png");
    this.load.image("mogura5", "assets/animation/mogura2/moguraAnim2_05.png");
    this.load.image("mogura6", "assets/animation/mogura2/moguraAnim2_06.png");
    this.load.image("mogura7", "assets/animation/mogura2/moguraAnim2_07.png");
    this.load.image("mogura8", "assets/animation/mogura2/moguraAnim2_08.png");
    this.load.image("mogura9", "assets/animation/mogura2/moguraAnim2_09.png");
    this.load.image("mogura10", "assets/animation/mogura2/moguraAnim2_10.png");
    this.load.image("mogura11", "assets/animation/mogura2/moguraAnim2_11.png");
    this.load.image("mogura12", "assets/animation/mogura2/moguraAnim2_12.png");
    this.load.image("mogura13", "assets/animation/mogura2/moguraAnim2_13.png");
    this.load.image("mogura14", "assets/animation/mogura2/moguraAnim2_14.png");
    this.load.image("mogura15", "assets/animation/mogura2/moguraAnim2_15.png");
    this.load.image("mogura16", "assets/animation/mogura2/moguraAnim2_16.png");
    this.load.image("mogura17", "assets/animation/mogura2/moguraAnim2_17.png");
    this.load.image("mogura18", "assets/animation/mogura2/moguraAnim2_18.png");
    this.load.image("mogura19", "assets/animation/mogura2/moguraAnim2_19.png");
    this.load.image("mogura20", "assets/animation/mogura2/moguraAnim2_20.png");
    this.load.image("mogura21", "assets/animation/mogura2/moguraAnim2_21.png");
    this.load.image("mogura22", "assets/animation/mogura2/moguraAnim2_22.png");
    this.load.image("mogura23", "assets/animation/mogura2/moguraAnim2_23.png");
    this.load.image("mogura24", "assets/animation/mogura2/moguraAnim2_24.png");
    this.load.image("mogura25", "assets/animation/mogura2/moguraAnim2_25.png");
    this.load.image("mogura26", "assets/animation/mogura2/moguraAnim2_26.png");
    this.load.image("mogura27", "assets/animation/mogura2/moguraAnim2_27.png");
    this.load.image("mogura28", "assets/animation/mogura2/moguraAnim2_28.png");
    this.load.image("mogura29", "assets/animation/mogura2/moguraAnim2_29.png");
    this.load.image("mogura30", "assets/animation/mogura2/moguraAnim2_30.png");
    this.load.image("mogura31", "assets/animation/mogura2/moguraAnim2_31.png");
    this.load.image("mogura32", "assets/animation/mogura2/moguraAnim2_32.png");
    this.load.image("mogura33", "assets/animation/mogura2/moguraAnim2_33.png");
    this.load.image("mogura34", "assets/animation/mogura2/moguraAnim2_34.png");
    this.load.image("mogura35", "assets/animation/mogura2/moguraAnim2_35.png");
    this.load.image("mogura36", "assets/animation/mogura2/moguraAnim2_36.png");
    this.load.image("mogura37", "assets/animation/mogura2/moguraAnim2_37.png");
    this.load.image("mogura38", "assets/animation/mogura2/moguraAnim2_38.png");
    this.load.image("mogura39", "assets/animation/mogura2/moguraAnim2_39.png");
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
      key: "mogura",
      frames: [
        { key: "mogura1", duration: 100 },
        { key: "mogura2", duration: 100 },
        { key: "mogura3", duration: 100 },
        { key: "mogura4", duration: 100 },
        { key: "mogura5", duration: 100 },
        { key: "mogura6", duration: 100 },
        { key: "mogura7", duration: 100 },
        { key: "mogura8", duration: 100 },
        { key: "mogura9", duration: 100 },
        { key: "mogura10", duration: 100 },
        { key: "mogura11", duration: 100 },
        { key: "mogura12", duration: 100 },
        { key: "mogura13", duration: 100 },
        { key: "mogura14", duration: 100 },
        { key: "mogura15", duration: 100 },
        { key: "mogura16", duration: 100 },
        { key: "mogura17", duration: 100 },
        { key: "mogura18", duration: 100 },
        { key: "mogura19", duration: 100 },
        { key: "mogura20", duration: 100 },
        { key: "mogura21", duration: 100 },
        { key: "mogura22", duration: 100 },
        { key: "mogura23", duration: 100 },
        { key: "mogura24", duration: 100 },
        { key: "mogura25", duration: 100 },
        { key: "mogura26", duration: 100 },
        { key: "mogura27", duration: 100 },
        { key: "mogura28", duration: 100 },
        { key: "mogura29", duration: 100 },
        { key: "mogura30", duration: 100 },
        { key: "mogura31", duration: 100 },
        { key: "mogura32", duration: 100 },
        { key: "mogura33", duration: 100 },
        { key: "mogura34", duration: 100 },
        { key: "mogura35", duration: 100 },
        { key: "mogura36", duration: 100 },
        { key: "mogura37", duration: 100 },
        { key: "mogura38", duration: 100 },
        { key: "mogura39", duration: 1000 },
      ],
      frameRate: 24,
      repeat: -1,
    });

    const mogura = this.add.sprite(400, 400, "mogura1");
    mogura.setOrigin(0, 0).play("mogura").depth = 4;
  }
}
