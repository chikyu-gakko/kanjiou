import SoundButton from "./sound_button.js";

export default class GameMenu extends Phaser.Scene {
  constructor() {
    super({ key: "game_menu", active: false });
  }

  preload() {
    // メニュー画面に出てくる画像のロード
    this.load.path = window.location.href.replace("index.html", "");
    // bgm
    this.load.audio("top_bgm", "audio/top.mp3");
    // SE
    this.load.audio("mode_decide_se", "audio/mode_decide.mp3");

    this.load.image("sound", "img/sound.png");
    this.load.image("mute", "img/mute.png");
    this.load.image("cloud", "img/game_cloud.png");
    this.load.image("top_mogura", "img/lay_mogura.png");
    // 木
    this.load.image("tree1", "assets/animation/tree/tree_1.png");
    this.load.image("tree2", "assets/animation/tree/tree_2.png");
    this.load.image("tree3", "assets/animation/tree/tree_3.png");
    this.load.image("tree4", "assets/animation/tree/tree_4.png");
    this.load.image("tree5", "assets/animation/tree/tree_5.png");
    this.load.image("tree6", "assets/animation/tree/tree_6.png");
    this.load.image("tree7", "assets/animation/tree/tree_7.png");

    // 地面
    this.load.image("ground1", "assets/animation/soil/soil_1.png");
    this.load.image("ground2", "assets/animation/soil/soil_2.png");
    this.load.image("ground3", "assets/animation/soil/soil_3.png");
    this.load.image("ground4", "assets/animation/soil/soil_4.png");
    this.load.image("ground5", "assets/animation/soil/soil_5.png");
    this.load.image("ground6", "assets/animation/soil/soil_6.png");
    this.load.image("ground7", "assets/animation/soil/soil_7.png");

    // もぐら
    this.load.image("mogura1", "assets/animation/mogura/moguraAnim01.png");
    this.load.image("mogura2", "assets/animation/mogura/moguraAnim02.png");
    this.load.image("mogura3", "assets/animation/mogura/moguraAnim03.png");
    this.load.image("mogura4", "assets/animation/mogura/moguraAnim04.png");
    this.load.image("mogura5", "assets/animation/mogura/moguraAnim05.png");
    this.load.image("mogura6", "assets/animation/mogura/moguraAnim06.png");
    this.load.image("mogura7", "assets/animation/mogura/moguraAnim07.png");
    this.load.image("mogura8", "assets/animation/mogura/moguraAnim08.png");
    this.load.image("mogura9", "assets/animation/mogura/moguraAnim09.png");
    this.load.image("mogura10", "assets/animation/mogura/moguraAnim10.png");
    this.load.image("mogura11", "assets/animation/mogura/moguraAnim11.png");
    this.load.image("mogura12", "assets/animation/mogura/moguraAnim12.png");
    this.load.image("mogura13", "assets/animation/mogura/moguraAnim13.png");
    this.load.image("mogura14", "assets/animation/mogura/moguraAnim14.png");
    this.load.image("mogura15", "assets/animation/mogura/moguraAnim15.png");
    this.load.image("mogura16", "assets/animation/mogura/moguraAnim16.png");
    this.load.image("mogura17", "assets/animation/mogura/moguraAnim17.png");
    this.load.image("mogura18", "assets/animation/mogura/moguraAnim18.png");
    this.load.image("mogura19", "assets/animation/mogura/moguraAnim19.png");
    this.load.image("mogura20", "assets/animation/mogura/moguraAnim20.png");
    this.load.image("mogura21", "assets/animation/mogura/moguraAnim21.png");
    this.load.image("mogura22", "assets/animation/mogura/moguraAnim22.png");
    this.load.image("mogura23", "assets/animation/mogura/moguraAnim23.png");
    this.load.image("mogura24", "assets/animation/mogura/moguraAnim24.png");
    this.load.image("mogura25", "assets/animation/mogura/moguraAnim25.png");
    this.load.image("mogura26", "assets/animation/mogura/moguraAnim26.png");
    this.load.image("mogura27", "assets/animation/mogura/moguraAnim27.png");
    this.load.image("mogura28", "assets/animation/mogura/moguraAnim28.png");
    this.load.image("mogura29", "assets/animation/mogura/moguraAnim29.png");
    this.load.image("mogura30", "assets/animation/mogura/moguraAnim30.png");
    this.load.image("mogura31", "assets/animation/mogura/moguraAnim31.png");
    this.load.image("mogura32", "assets/animation/mogura/moguraAnim32.png");
    this.load.image("mogura33", "assets/animation/mogura/moguraAnim33.png");
    this.load.image("mogura34", "assets/animation/mogura/moguraAnim34.png");
    this.load.image("mogura35", "assets/animation/mogura/moguraAnim35.png");
    this.load.image("mogura36", "assets/animation/mogura/moguraAnim36.png");
    this.load.image("mogura37", "assets/animation/mogura/moguraAnim37.png");
  }

  init() {
    this.fontFamily = this.registry.get("fontFamily");
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

    // 音楽
    if (this.sound.get("top_bgm") === null) {
      this.sound.add("top_bgm");
      this.sound.play("top_bgm", {
        loop: true,
        delay: 9,
      });
    }

    this.soundButton = new SoundButton(this, 70, 700, 40);
    this.soundButton.depth = 3;
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
    ground.setOrigin(0, 1).play("ground").depth = 1;
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
    tree.setOrigin(0.5, 1).play("tree");
  }

  cloudAnim() {
    // 雲３つ
    const cloud1 = this.add.image(100, -100, "cloud");

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

  moguraAnim() {
    // mogura
    this.anims.create({
      key: "mogura",
      frames: [
        { key: "mogura1", duration: 20 },
        { key: "mogura2", duration: 20 },
        { key: "mogura3", duration: 20 },
        { key: "mogura4", duration: 20 },
        { key: "mogura5", duration: 20 },
        { key: "mogura6", duration: 20 },
        { key: "mogura7", duration: 20 },
        { key: "mogura8", duration: 20 },
        { key: "mogura9", duration: 20 },
        { key: "mogura10", duration: 20 },
        { key: "mogura11", duration: 20 },
        { key: "mogura12", duration: 20 },
        { key: "mogura13", duration: 20 },
        { key: "mogura14", duration: 20 },
        { key: "mogura15", duration: 20 },
        { key: "mogura16", duration: 20 },
        { key: "mogura17", duration: 20 },
        { key: "mogura18", duration: 20 },
        { key: "mogura19", duration: 20 },
        { key: "mogura20", duration: 20 },
        { key: "mogura21", duration: 20 },
        { key: "mogura22", duration: 20 },
        { key: "mogura23", duration: 20 },
        { key: "mogura24", duration: 20 },
        { key: "mogura25", duration: 20 },
        { key: "mogura26", duration: 20 },
        { key: "mogura27", duration: 20 },
        { key: "mogura28", duration: 20 },
        { key: "mogura29", duration: 20 },
        { key: "mogura30", duration: 20 },
        { key: "mogura31", duration: 20 },
        { key: "mogura32", duration: 20 },
        { key: "mogura33", duration: 20 },
        { key: "mogura34", duration: 20 },
        { key: "mogura35", duration: 20 },
        { key: "mogura36", duration: 20 },
        { key: "mogura37", duration: 1000 },
      ],
      frameRate: 24,
    });

    const mogura = this.add.sprite(800, 675, "mogura1");
    mogura.setOrigin(0.5, 1).play("mogura");
  }

  gameMenuFade() {
    // ゲームメニューボタン

    // 決定SE
    const modeDecideSe = this.sound.add("mode_decide_se");

    // 羊の中に～ボタン/テキスト
    const fndDiffButton = this.add.graphics();
    fndDiffButton
      .lineStyle(2, 0x645246)
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(30, 100, 350, 90, 45)
      .strokePath()
      .setInteractive(
        new Phaser.Geom.Rectangle(30, 100, 350, 90),
        Phaser.Geom.Rectangle.Contains
      );

    fndDiffButton.on(
      "pointerdown",
      () => {
        modeDecideSe.play();
        this.scene.start("game_setting");
      },
      this
    );

    this.add.text(70, 130, "羊の中に犬が一匹", {
      fontSize: "32px",
      fontFamily: this.fontFamily,
      fill: "#333333",
    });

    // 作成中にする
    // 多言語
    const mnyLngButton = this.add.graphics();
    mnyLngButton
      .lineStyle(2, 0x645246)
      .fillStyle(0x32b65e, 1)
      .fillRoundedRect(30, 230, 350, 90, 45)
      .setInteractive(
        new Phaser.Geom.Rectangle(30, 230, 350, 90),
        Phaser.Geom.Rectangle.Contains
      )
      .strokePath();

    this.add.text(150, 260, "作成中", {
      fontSize: "32px",
      fontFamily: this.fontFamily,
      fill: "#ffffff",
    });

    // 神経衰弱
    const memoryGmButton = this.add.graphics();
    memoryGmButton
      .lineStyle(2, 0x645246)
      .fillStyle(0x32b65e, 1)
      .fillRoundedRect(30, 360, 350, 90, 45)
      .setInteractive(
        new Phaser.Geom.Rectangle(30, 360, 350, 90),
        Phaser.Geom.Rectangle.Contains
      )
      .strokePath();

    this.add.text(150, 390, "作成中", {
      fontSize: "32px",
      fontFamily: this.fontFamily,
      fill: "#ffffff",
    });

    // 仲間で集まれ
    const tgtherFriendButton = this.add.graphics();
    tgtherFriendButton
      .lineStyle(2, 0x645246)
      .fillStyle(0x32b65e, 1)
      .fillRoundedRect(30, 490, 350, 90, 45)
      .setInteractive(
        new Phaser.Geom.Rectangle(30, 490, 350, 90),
        Phaser.Geom.Rectangle.Contains
      )
      .strokePath();

    this.add.text(150, 520, "作成中", {
      fontSize: "32px",
      fontFamily: this.fontFamily,
      fill: "#ffffff",
    });

    // 作成中の横モグラ
    this.add.image(95, 275, "top_mogura");
    this.add.image(95, 400, "top_mogura");
    this.add.image(95, 531, "top_mogura");
  }
}
