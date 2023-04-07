import Phaser from 'phaser';
import bugfix from '../assets/bugfix.png';
import boot from '../assets/sound effects/boot.wav';

export default class Boot extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload() {
    this.width = this.scale.width;
    this.height = this.scale.height;
    this.load.audio('boot', boot);
    this.load.image('bugfix', bugfix);
    this.sound.pauseOnBlur = false;
  }

  create() {
    // Disables the context menu when you right click to prevent score tampering
    this.input.mouse.disableContextMenu();
    // Added a background image to the boot scene because the font family wasn't loading properly
    this.bg = this.add.sprite(0, 0, 'bugfix').setOrigin(0, 0);
    this.bg.setDisplaySize(this.width, this.height);
    // fadeIn effect to make the transitions nicer
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    // Added a sound effect to the boot scene
    this.bootSound = this.sound.add('boot', { volume: 0.4 });
    this.bootSound.play();
    // Added a click to continue input
    this.input.on('pointerdown', () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.scene.start('preLoader');
    });
  }
}