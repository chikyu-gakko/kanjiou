export default class SettingButton extends Phaser.GameObjects.Container {
  constructor(
    scene,
    x,
    y,
    width,
    height,
    text,
    fontSize,
    fontFamily = "Arial",
    fillColor = 0xffffff,
    textColor = "#333333"
  ) {
    super(scene, x, y);

    this.scene = scene;
    this.scene.add.existing(this);
    this.setSize(width, height);
    this.setData("value", text);

    this.buttonText = scene.add
      .text(width / 2, height / 2, text, {
        fontSize,
        color: textColor,
        fontFamily,
      })
      .setOrigin(0.5);

    this.buttonGraphic = scene.add
      .graphics()
      .lineStyle(2, 0x645246)
      .fillStyle(fillColor, 1)
      .fillRoundedRect(0, 0, width, height, Math.ceil(height / 2))
      .strokePath()
      .setInteractive(
        new Phaser.Geom.Rectangle(0, 0, width, height),
        Phaser.Geom.Rectangle.Contains
      );

    this.add([this.buttonGraphic, this.buttonText]);
  }

  changeSelected() {
    this.buttonText.setStyle({
      color: "#ffffff",
    });
    this.buttonGraphic
      .lineStyle(2, 0x645246)
      .fillStyle(0x32b65e, 1)
      .fillRoundedRect(
        0,
        0,
        this.width,
        this.height,
        Math.ceil(this.height / 2)
      )
      .strokePath();
  }

  changeUnselected() {
    this.buttonText.setStyle({
      color: "#333333",
    });
    this.buttonGraphic
      .lineStyle(2, 0x645246)
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(
        0,
        0,
        this.width,
        this.height,
        Math.ceil(this.height / 2)
      )
      .strokePath();
  }

  changeChallengeButton() {
    this.buttonText.setStyle({
      color: "#ffffff",
    });
    this.buttonGraphic
      .lineStyle(2, 0xda999b)
      .fillStyle(0xb63237, 1)
      .fillRoundedRect(
        0,
        0,
        this.width,
        this.height,
        Math.ceil(this.height / 2)
      )
      .strokePath();
  }
}
