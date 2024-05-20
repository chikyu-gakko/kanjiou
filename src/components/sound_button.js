import Phaser from 'phaser'

export default class SoundButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, radius) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setSize(radius * 2, radius * 2);

    // 音声アイコン枠描画
    this.soundCircle = scene.add
      .graphics()
      .fillStyle(0x333333, 1)
      .fillCircle(0, 0, radius)
      .setInteractive(
        new Phaser.Geom.Circle(0, 0, radius),
        Phaser.Geom.Circle.Contains
      );
      ;
      
    // 音声アイコン
    this.soundIcon = scene.add.image(0, 0, "sound");
    this.muteIcon = scene.add.image(0, 0, "mute");
    this.soundIcon.setVisible(!scene.sound.mute);
    this.muteIcon.setVisible(scene.sound.mute);

    

    this.soundCircle.on("pointerdown", () => {
      const isMute = !scene.sound.mute;
      scene.sound.setMute(isMute);
      this.soundIcon.setVisible(!isMute);
      this.muteIcon.setVisible(isMute);
    });


    this.add([this.soundCircle, this.soundIcon, this.muteIcon]);
  }
}
