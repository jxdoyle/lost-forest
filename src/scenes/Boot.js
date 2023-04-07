import Phaser from 'phaser';
import loadFont from '../javascript/fontLoader';
import boot from '../assets/sound effects/boot.wav';
import headliner from '../assets/font/HeadlinerNo.45.ttf';

export default class Boot extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload() {
    this.width = this.scale.width;
    this.height = this.scale.height;
    loadFont('Headliner', headliner);
    this.load.audio('boot', boot);
    this.sound.pauseOnBlur = false;
  }

  create() {
    this.bootSound = this.sound.add('boot', { volume: 0.4 });
    this.bootSound.play();

    const title = this.make.text({
      x: this.width / 2,
      y: this.height / 2,
      text: 'LOST FOREST',
      style: {
        fontSize: '150px',
        fill: '#ffffff',
        fontFamily: 'Headliner, monospace',
      },
    });
    title.setOrigin(0.5, 0.5);

    this.cameras.main.fadeIn(1000, 0, 0, 0);

    const cont = this.make.text({
      x: this.width / 2 - 10,
      y: 500,
      text: "Press 'ENTER' to continue",
      style: {
        fontSize: '35px',
        fill: '#ffffff',
        fontFamily: 'Headliner, monospace',
        align: 'justify',
        wordWrap: { width: this.width - 255, useAdvancedWrap: true },
      },
    });
    cont.setOrigin(0.5, 0.5);

    const keyP = this.input.keyboard.addKey('ENTER');
    keyP.on('down', () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.scene.start('preLoader');
    });
  }
}