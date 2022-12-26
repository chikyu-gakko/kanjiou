import { nakamalist } from "../../nakamalist";

export default class NakamaContainer extends Phaser.GameObjects.Container {
  static Level = {
    1: {
      name: "level1",
      text: "レベル1",
    },
  };
  static Category = {
    key: "category",
    value: "value",
    data: {
      Level: {
        name: "level",
        text: "レベル",
      },
    },
  };

  /**
   * @param {Phaser.Scene} scene Phaser.Scene
   * @param {number} x number
   * @param {number} y number
   * @param {string} level string
   */
  constructor(scene, x, y, level) {
    super(scene, x, y);
    scene.add.existing(this);
    switch (level) {
      case NakamaContainer.Level[1].name:
        this.problems = nakamalist[NakamaContainer.Level[1].text];
        break;
      default:
      // throw `${level} does not exist in nakamalist`;
    }
    this.counter = 0;
  }

  /**
   * @param {Phaser.Scene} scene
   */
  start = (scene) => {
    const [leftSideObjs, rightSideObjs] = this.createObjs(scene);
    scene.add
      .text(500, 600, "OK", {
        fontSize: "32px",
        color: "#000000",
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.check(scene, leftSideObjs, rightSideObjs);
      });
  };

  /**
   * @param {Phaser.Scene} scene
   * @returns {[Phaser.GameObjects.Text[], Phaser.GameObjects.Text[]]}
   */
  createObjs = (scene) => {
    const leftSide = {
      title: this.problems[this.counter][1],
      chars: this.problems[this.counter][2],
      x: 400,
      y: 700,
      width: 100,
      height: 100,
    };
    const rightSide = {
      title: this.problems[this.counter][3],
      chars: this.problems[this.counter][4],
      x: 30,
      y: 30,
      width: 100,
      height: 100,
    };
    console.log(leftSide.chars);
    console.log(rightSide.chars);

    scene.add.text(150, 30, leftSide.title, {
      color: "#333333",
      fontSize: "40px",
      fontFamily: scene.registry.get("fontFamily"),
    });
    scene.add.text(670, 30, rightSide.title, {
      color: "#333333",
      fontSize: "40px",
      fontFamily: scene.registry.get("fontFamily"),
    });

    const leftSideObjs = leftSide.chars.map((e) => {
      const x = Math.floor(Math.random() * (924 - 100)) + 100;
      const y = Math.floor(Math.random() * (668 - 100)) + 100;
      const obj = scene.add.text(x, y, e[0], {
        color: "#333333",
        fontSize: "50px",
        fontFamily: scene.registry.get("fontFamily"),
      });
      return obj
        .setInteractive({ draggable: true })
        .on("dragstart", (pointer, dragX, dragY) => { })
        .on("drag", (pointer, dragX, dragY) => {
          console.log(dragX, dragY);
          obj.setPosition(dragX, dragY);
        })
        .on("dragend", (pointer, dragX, dragY, dropped) => { });
    });
    const rightSideObjs = rightSide.chars.map((e) => {
      const x = Math.floor(Math.random() * (924 - 100)) + 100;
      const y = Math.floor(Math.random() * (668 - 100)) + 100;
      const obj = scene.add.text(x, y, e[0], {
        color: "#333333",
        fontSize: "50px",
        fontFamily: scene.registry.get("fontFamily"),
      });
      return obj
        .setInteractive({ draggable: true })
        .on("dragstart", (pointer, dragX, dragY) => { })
        .on("drag", (pointer, dragX, dragY) => {
          console.log(dragX, dragY);
          obj.setPosition(dragX, dragY);
        })
        .on("dragend", (pointer, dragX, dragY, dropped) => { });
    });

    return [leftSideObjs, rightSideObjs];
  };

  /**
   * @param {Phaser.Scene} scene
   * @param {Phaser.GameObjects.Text[]} rightSideObjs
   * @param {Phaser.GameObjects.Text[]} leftSideObjs
   */
  check = (scene, rightSideObjs, leftSideObjs) => {
    const threshouldX = 497;
    console.log("ok");
    leftSideObjs.forEach((e) => {
      console.log(e.x, e.y);
      if (e.x < threshouldX) {
        const batu = scene.add.sprite(e.x, e.y, "batu");
        batu.setScale(0.1);
      } else {
        const maru = scene.add.sprite(e.x, e.y, "maru");
        maru.setScale(0.1);
      }
    });
    rightSideObjs.forEach((e) => {
      console.log(e.x, e.y);
      if (threshouldX < e.x) {
        const batu = scene.add.sprite(e.x, e.y, "batu");
        batu.setScale(0.1);
      } else {
        const maru = scene.add.sprite(e.x, e.y, "maru");
        maru.setScale(0.1);
      }
    });
  };
}
