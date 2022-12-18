import SoundButton from "../components/sound_button.js";
import SettingButton from "../components/setting_button.js";
import { getRank, putRanking } from "../api/rank.js";

import CameraFadeIn from "./ui/CameraFadeIn.js";

export default class GameResult extends Phaser.Scene {
  constructor() {
    super({ key: "game_result", active: true });
    this.backTopButton = undefined;
    this.backGameSetButton = undefined;
    this.retryGameButton = undefined;
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
    this.mode = data.mode;
    this.timer = data.time;
    // this.timer = 30; // develop
    this.ranking = data.ranking;
    this.modalVisible = data.modalVisible;
    this.rankingRegistered = data.rankingRegistered;
    this.answers = data.answers;
    this.sizeY = data.sizeY;
    this.sizeX = data.sizeX;
    this.schoolYear = data.schoolYear;
    this.fontFamily = this.registry.get("fontFamily");
  }

  create() {
    this.startCameraFadeIn();
    this.createSoundButton();

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
    this.createRankingPageButton();

    (async () => {
      // const rankData = await getRank(60 - this.timer);
      const rankData = await getRank(60 - 1);
      if (rankData.rank <= 100 && !this.rankingRegistered) {
        if (this.modalVisible) {
          this.rankingModal(rankData.rank);
        }
        // ランキング登録ボタン
        const rankingButton = new SettingButton(
          this,
          697,
          660,
          265,
          72,
          "ランキング登録",
          24,
          this.fontFamily,
          0x32b65e,
          "#ffffff"
        );
        rankingButton.buttonGraphic.on(
          "pointerdown",
          () => {
            this.rankingModal(rankData.rank);
          },
          this
        );
        rankingButton.depth = 2;

        // ランクイン時に表示する
        this.add
          .text(
            this.game.canvas.width / 1.24,
            630,
            `\\ TOP 100位にランクイン /`,
            {
              color: "#ffffff",
              fontFamily: "SemiBold",
              fontSize: "14px",
            }
          )
          .setOrigin(0.5, 0).depth = 2;
      }
    })();

    if (this.mode === "timeLimit" && this.timer === 60) {
      // ゲームオーバー
      this.backTopButton.setY(136);
      this.backGameSetButton.setY(136);
      this.retryGameButton.setY(136);

      this.displayGameOverGraphics();
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
      this.displayGameClearGraphics();
    }
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

    // bgm
    const endingBgm = this.sound.add("ending");
    endingBgm.allowMultiple = false;
    endingBgm.play();

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
      .play("moguraAnimation2");
    this.add
      .sprite(360, 400, "moguraAnim1")
      .setOrigin(0, 0)
      .play("moguraAnimation2");
    this.add
      .sprite(460, 400, "moguraAnim1")
      .setOrigin(0, 0)
      .play("moguraAnimation2");
  }

  displayGameOverGraphics() {
    this.add.graphics().fillStyle(0x232d58, 1).fillRect(0, 0, 1024, 768).depth =
      -1;
    this.add.image(436, 305, "mogura-upper-body").setOrigin(0, 0);
    this.add.image(512, 685, "bg");

    const fukidashiImage = this.add
      .image(0, 0, "fukidashi")
      .setDisplaySize(516, 116)
      .setOrigin(0, 0);
    const text1 = this.add.text(48, 29, "あともう少し！", {
      fontFamily: this.fontFamily,
      fontSize: 34,
      color: "#32B65E",
    });
    const text2 = this.add.text(286, 36, "次も頑張ろう！", {
      color: "#333333",
      fontFamily: this.fontFamily,
      fontSize: 26,
    });
    this.add.container(220, 310, [fukidashiImage, text1, text2]);
  }

  async rankingModal(rank) {
    let rankText = this.add.text(560, 305, "?", {
      fontFamily: this.fontFamily,
      fontSize: "30px",
      color: "#333333",
    });
    rankText.depth = 5;

    try {
      rankText.destroy();
      rankText = this.add.text(540, 305, rank, {
        fontFamily: "sans-serif",
        fontSize: "64px",
        color: "#AA9311",
      });
      rankText.depth = 5;
    } catch (e) {
      // rankText.destroy();
      // rankText = this.add.text(560, 305, e.message, {
      //   fontFamily: this.fontFamily,
      //   fontSize: "30px",
      //   color: "#333333",
      // });
      // rankText.depth = 5;
    }

    const rankingBg = this.add.graphics();
    rankingBg
      .fillStyle(0x333333, 0.5)
      .fillRect(0, 0, 1024, 768)
      .setInteractive(
        new Phaser.Geom.Rectangle(0, 0, 1024, 768),
        Phaser.Geom.Rectangle.Contains
      ).depth = 3;

    const rankingMenuBox = this.add.graphics();
    rankingMenuBox
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(296, 234, 432, 367, 14).depth = 4;
    // .fillRoundedRect(312, 234, 400, 300, 10).depth = 4;

    // 1024 / 2 - モーダルの横幅 / 2

    this.add.image(560, 280, "clown").setDepth(5);

    const rankMessageText = this.add
      .text(377, 340, "あなたの順位 　　    位", {
        fontFamily: "sans-serif",
        fontSize: "24px",
        color: "#333333",
      })
      .setDepth(5);

    const nameForm = this.add.dom(512, 450).createFromCache("nameForm");

    // スコア送信ボタン
    const submitButton = new SettingButton(
      this,
      330,
      500,
      368,
      72,
      "登録する",
      32,
      "sans-serif",
      0x32b65e,
      "#ffffff"
    );

    // 名前検証テキスト
    const validationMessageText = this.add
      .text(296, 350, "記号なし8文字以内で入力してください", {
        fontFamily: this.fontFamily,
        fontSize: "14px",
        color: "#d53f3f",
      })
      .setDepth(5)
      .setVisible(false);

    const annotationText = this.add
      .text(330, 390, "8文字以内", {
        fontFamily: "sans-serif",
        fontSize: "14px",
        color: "#999999",
      })
      .setDepth(5);

    const celebrationText = this.add
      .text(290, 150, "ランキング入りおめでとう！", {
        fontFamily: this.fontFamily,
        fontSize: "36px",
        color: "#FFFFFF",
      })
      .setDepth(5);

    const httpStatusMessage = this.add
      .text(420, 400, "登録に成功しました", {
        fontFamily: this.fontFamily,
        fontSize: "20px",
        color: "#333333",
      })
      .setDepth(5)
      .setVisible(false);

    submitButton.buttonGraphic.on(
      "pointerdown",
      () => {
        const name = nameForm.getChildByName("name");
        let text = "ゲスト";
        const reg = new RegExp(/^.{1,8}$/);
        if (reg.test(name.value)) {
          validationMessageText.setVisible(false);
          annotationText.setVisible(true);
          text = name.value;
        } else {
          annotationText.setVisible(false);
          validationMessageText.setVisible(true);
          return;
        }
        putRanking(this.timer, text)
          .then(() => {
            this.rankingRegistered = true;
            const status = "登録に成功しました";
            httpStatusMessage.setText(status);
            httpStatusMessage.setVisible(true);
            rankText.destroy();
            rankMessageText.destroy();
            validationMessageText.destroy();
            annotationText.destroy();
            celebrationText.destroy();
            nameForm.destroy();
            submitButton.destroy();
          })
          .catch(() => {
            const status = "登録に失敗しました";
            // const status = e.message; // debug
            httpStatusMessage.setText(status);
            httpStatusMessage.setVisible(true);
            rankText.destroy();
            rankMessageText.destroy();
            validationMessageText.destroy();
            annotationText.destroy();
            celebrationText.destroy();
            nameForm.destroy();
            submitButton.destroy();
          });
      },
      this
    );
    submitButton.depth = 6;

    const crossButton = this.add.text(685, 246, "✖", {
      fontSize: "32px",
      fill: "#333333",
    });
    crossButton.setInteractive().on(
      "pointerdown",
      () => {
        this.scene.start("game_result", {
          time: this.timer,
          ranking: false,
          modalVisible: false,
          rankingRegistered: this.rankingRegistered,
          answers: this.answerCounter,
          mode: this.mode,
          schoolYear: this.schoolYear,
          sizeX: this.sizeX,
          sizeY: this.sizeY,
        });
        validationMessageText.setVisible(false);
        httpStatusMessage.setVisible(false);
        rankText.destroy();
        rankingBg.destroy();
        rankingMenuBox.destroy();
        rankMessageText.destroy();
        nameForm.destroy();
        submitButton.destroy();
        crossButton.destroy();
      },
      this
    ).depth = 6;
  }

  startCameraFadeIn = () => {
    new CameraFadeIn(this);
  };

  createSoundButton = () => {
    const soundButton = new SoundButton(this, 70, 700, 40);
    soundButton.depth = 3;
  };

  createBackTopButton = () => {
    const backTopButton = new SettingButton(
      this,
      57,
      332,
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
      332,
      265,
      72,
      "ゲーム設定に戻る",
      24,
      this.fontFamily
    );
    backGameSetButton.buttonGraphic.on(
      "pointerdown",
      () => {
        this.scene.start("game_setting", {
          mode: this.mode,
          sizeX: this.sizeX,
          sizeY: this.sizeY,
          schoolYear: this.schoolYear,
        });
      },
      this
    );
    return backGameSetButton;
  };

  createRetryGameButton = () => {
    const retryGameButton = new SettingButton(
      this,
      697,
      332,
      265,
      72,
      "もう一度プレイする",
      24,
      this.fontFamily
    );
    retryGameButton.buttonGraphic.on(
      "pointerdown",
      () => {
        this.scene.start("hitsuji_game", {
          mode: this.mode,
          sizeX: this.sizeX,
          sizeY: this.sizeY,
          schoolYear: this.schoolYear,
        });
      },
      this
    );
    return retryGameButton;
  };

  createRankingPageButton = () => {
    const rankingPageButton = new SettingButton(
      this,
      697,
      470,
      265,
      72,
      "ランキング",
      24,
      this.fontFamily
    );
    rankingPageButton.buttonGraphic.on(
      "pointerdown",
      () => {
        this.scene.start("hitsuji_ranking");
      },
      this
    ).depth = 8;
  };
}
