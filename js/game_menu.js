export default class GameMenu extends Phaser.Scene {
  constructor() {
    super({ key: "game_menu", active: false });
  }

  preload() {
    // メニュー画面に出てくる画像のロード
    this.load.image("sound", "../img/sound.png");
    this.load.image("cloud", "../img/game_cloud.png");
    this.load.image("top_mogura", "../img/mogura.png");
    this.load.image("mogura", "../img/min_mogura.png");

    this.load.image("tree1", "../assets/animation/tree_1.png");
    this.load.image("tree2", "../assets/animation/tree_2.png");
    this.load.image("tree3", "../assets/animation/tree_3.png");
    this.load.image("tree4", "../assets/animation/tree_4.png");
    this.load.image("tree5", "../assets/animation/tree_5.png");
    this.load.image("tree6", "../assets/animation/tree_6.png");
    this.load.image("tree7", "../assets/animation/tree_7.png");

    this.load.image("ground1", "../assets/animation/soil_1.png");
    this.load.image("ground2", "../assets/animation/soil_2.png");
    this.load.image("ground3", "../assets/animation/soil_3.png");
    this.load.image("ground4", "../assets/animation/soil_4.png");
    this.load.image("ground5", "../assets/animation/soil_5.png");
    this.load.image("ground6", "../assets/animation/soil_6.png");
    this.load.image("ground7", "../assets/animation/soil_7.png");

    this.load.image("shiba1", "../assets/animation/frame-01.png");
    this.load.image("shiba2", "../assets/animation/frame-02.png");
    this.load.image("shiba3", "../assets/animation/frame-03.png");
    this.load.image("shiba4", "../assets/animation/frame-04.png");

    // bgm
    this.load.audio("top_bgm", "../audio/top.mp3");
    // SE
    this.load.audio("mode_decide_se", "../audio/mode_decide.mp3");
  }

  create() {
    this.cameras.main.fadeIn(1000);
    this.cameras.main.once("camerafadeincomplete", () => {
      setTimeout(() => {
        this.groundAnim();
      }, 2000);
      setTimeout(() => {
        this.treeAnim();
      }, 3000);
      setTimeout(() => {
        this.cloudAnim();
      }, 4000);
      setTimeout(() => {
        this.moguraAnim();
      }, 5000);
      setTimeout(() => {
        this.gameMenuFade();
      }, 8000);
    });

    // 画像表示

    // 背景描画
    const bgGameMenu = this.add.graphics();
    bgGameMenu.fillStyle(0xebfdff, 1).fillRect(0, 0, 1024, 768);

    setTimeout(() => {
      this.gameBgm.play();
    }, 9000);
    // 音楽
    this.gameBgm = this.sound.add("top_bgm");
    this.gameBgm.allowMultiple = false;
    this.gameBgm.setLoop(true);
    let soundStatus = 1;

    // 音声アイコン枠描画
    const soundCircle = this.add.graphics();
    soundCircle
      .fillStyle(0x333333, 1)
      .fillCircle(70, 700, 40)
      .setInteractive(
        new Phaser.Geom.Circle(70, 700, 30),
        Phaser.Geom.Circle.Contains
      ).depth = 3;

    // 音声アイコン
    const soundIcon = this.add.sprite(70, 700, "sound");
    soundIcon.depth = 4;

    soundCircle.on(
      "pointerdown",
      () => {
        if (soundStatus === 0) {
          this.gameBgm.play();
          soundStatus = 1;
        } else if (soundStatus === 1) {
          this.gameBgm.stop();
          soundStatus = 0;
        }
      },
      this
    );
  }

  groundAnim() {
    // 地面
    this.anims.create({
      key: "ground",
      frames: [
        { key: "ground1", duration: 10 },
        { key: "ground2", duration: 20 },
        { key: "ground3", duration: 30 },
        { key: "ground4", duration: 40 },
        { key: "ground5", duration: 50 },
        { key: "ground6", duration: 60 },
        { key: "ground7", duration: 1000 },
      ],
      frameRate: 24,
    });

    const ground = this.add.sprite(0, 768, "ground1");
    ground.setOrigin(0, 1).play("ground").depth = 2;
  }

  treeAnim() {
    // 木
    this.anims.create({
      key: "tree",
      frames: [
        { key: "tree1", duration: 10 },
        { key: "tree2", duration: 20 },
        { key: "tree3", duration: 30 },
        { key: "tree4", duration: 40 },
        { key: "tree5", duration: 50 },
        { key: "tree6", duration: 60 },
        { key: "tree7", duration: 1000 },
      ],
      frameRate: 24,
    });

    const tree = this.add.sprite(900, 610, "tree1");
    tree.setOrigin(0.5, 1).play("tree").depth = 3;
  }

  cloudAnim() {
    // 雲３つ
    const cloud1 = this.add.image(100, -100, "cloud");
    cloud1.depth = 1;

    const cloud2 = this.add.image(540, -100, "cloud");
    cloud2.depth = 100;

    const cloud3 = this.add.image(900, -100, "cloud");
    cloud3.depth = 50;

    setTimeout(() => {
      this.doropAnim(cloud1);
    }, 2000);
    setTimeout(() => {
      this.doropAnim(cloud2);
    }, 1000);
    setTimeout(() => {
      this.doropAnim(cloud3);
    }, 500);
  }

  // 落ちるアニメーション
  doropAnim(doropItem) {
    this.tweens.add({
      targets: [doropItem],
      props: {
        y: { value: 100 + doropItem.depth, duration: 1500, ease: "Power2" },
      },
      delay: 1000,
    });
  }

  // (仮)Gif
  moguraAnim() {
    this.anims.create({
      key: "shiba",
      frames: [
        { key: "shiba1", duration: 100 },
        { key: "shiba2", duration: 70 },
        { key: "shiba3", duration: 10 },
        { key: "shiba4", duration: 10 },
      ],
      frameRate: 24,
      repeat: 1,
    });

    const shiba = this.add.sprite(544, 335, "shiba1");
    shiba.setOrigin(0, 0).play("shiba").depth = 4;
  }

  gameMenuFade() {
    // ゲームメニューボタン

    // 決定SE
    const modeDecideSe = this.sound.add("mode_decide_se");

    // 羊の中に～ボタン/テキスト
    const fndDiffButton = this.add.graphics();

    fndDiffButton
      .lineStyle(5, 0x645246)
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(30, 100, 350, 90, 45)
      .strokePath()
      .setInteractive(
        new Phaser.Geom.Rectangle(30, 100, 350, 90),
        Phaser.Geom.Rectangle.Contains
      ).depth = 2;

    fndDiffButton.on(
      "pointerdown",
      () => {
        this.gameBgm.stop();
        modeDecideSe.play();
        this.scene.start("game_setting");
      },
      this
    );

    const fndDiffText = this.add.text(70, 130, "羊の中に犬が一匹", {
      fontSize: "32px",
      fill: "#333333",
    });

    fndDiffText
      .setPadding(4)
      .depth = 3;

    // 作成中にする
    // 多言語
    const mnyLngButton = this.add.graphics();
    mnyLngButton
      .lineStyle(5, 0x645246)
      .fillStyle(0x32b65e, 1)
      .fillRoundedRect(30, 230, 350, 90, 45)
      .setInteractive(
        new Phaser.Geom.Rectangle(30, 230, 350, 90),
        Phaser.Geom.Rectangle.Contains
      )
      .strokePath().depth = 2;

    const mnyLngText = this.add.text(150, 260, "作成中", {
      fontSize: "32px",
      fill: "#ffffff",
    });

    mnyLngText.setPadding(4).depth = 2;

    // 神経衰弱
    const memoryGmButton = this.add.graphics();
    memoryGmButton
      .lineStyle(5, 0x645246)
      .fillStyle(0x32b65e, 1)
      .fillRoundedRect(30, 360, 350, 90, 45)
      .setInteractive(
        new Phaser.Geom.Rectangle(30, 360, 350, 90),
        Phaser.Geom.Rectangle.Contains
      )
      .strokePath().depth = 2;

    const memoryText = this.add.text(150, 390, "作成中", {
      fontSize: "32px",
      fill: "#ffffff",
    });

    memoryText.setPadding(4).depth = 2;

    // 仲間で集まれ
    const tgtherFriendButton = this.add.graphics();
    tgtherFriendButton
      .lineStyle(5, 0x645246)
      .fillStyle(0x32b65e, 1)
      .fillRoundedRect(30, 490, 350, 90, 45)
      .setInteractive(
        new Phaser.Geom.Rectangle(30, 490, 350, 90),
        Phaser.Geom.Rectangle.Contains
      )
      .strokePath().depth = 2;

    const tgtherText = this.add.text(150, 520, "作成中", {
      fontSize: "32px",
      fill: "#ffffff",
    });

    tgtherText.setPadding(4).depth = 2;
  }
}
