import Phaser from 'phaser';
import createAligned from '../javascript/createAligned';

export default class ScoreScene extends Phaser.Scene {
  constructor() {
    super('score-scene');
  }

  init(data) {
    this.menuSong = data.song;
  }

  preload() {
    this.width = this.scale.width;
    this.height = this.scale.height;
  }

  create() {
    this.cameras.main.fadeIn(1000, 255, 255, 255);

    this.scene.pauseOnBlur = false;

    const bgh = this.textures.get('background').getSourceImage().height;

    this.add.tileSprite(0, this.height, this.width, bgh, 'background')
      .setOrigin(0, 1).setScrollFactor(0);

    this.bg1 = createAligned(this, -23, 'bgTree_1', true);
    this.bg2 = createAligned(this, 100, 'lights_1', false);
    this.bg3 = createAligned(this, -53, 'bgTree_2', true);
    this.bg4 = createAligned(this, -75, 'bgTree_3', true);
    this.bg5 = createAligned(this, 100, 'lights_2', false);
    this.bg6 = createAligned(this, -45, 'bgTree_4', true);
    this.bg7 = createAligned(this, 0, 'upTree', true);
    this.bg8 = createAligned(this, 10, 'floor', true, -250);

    this.player = this.add.sprite(200, this.height - 95, 'player_run');
    this.player.anims.play('run');
    this.player.setScale(1.5);

    const bestScoreText = localStorage.getItem('bestScore');
    const mostKillsText = localStorage.getItem('mostKills');

    const title = this.make.text({
      x: this.width / 2,
      y: this.height / 2 - 180,
      text: `BEST SCORE: ${bestScoreText || 0}\nMOST KILLS: ${mostKillsText || 0}`,
      style: {
        fontSize: '80px',
        fill: '#ffffff',
        fontFamily: 'Headliner, monospace',
        align: 'center',
      },
    });
    title.setOrigin(0.5, 0.5);

    this.exitBtn = this.add.image(this.width / 2, this.height / 2 + 220, 'exit_red').setInteractive({ useHandCursor: true }).setOrigin(0.5, 0.5)
      .on('pointerdown', () => this.exitIsPressed())
      .on('pointerup', () => {
        this.exitNotPressed();
        this.exit();
      });
  }

  exit() {
    this.menuSong.stop();
    this.cameras.main.fadeOut(2000, 255, 255, 255);
    this.scene.start('title-screen');
  }

  update() {
    const bgs = [this.bg1, this.bg2, this.bg3, this.bg4, this.bg5, this.bg6, this.bg7, this.bg8];
    const fact = [1.45, 1.5, 1.65, 1.75, 1.85, 2.1, 3.55, 5.1];

    bgs.forEach((bg, index) => {
      bg.tilePositionX += fact[index];
    });
  }

  exitIsPressed() {
    this.exitBtn.setTexture('exitPressed');
  }
  exitNotPressed() {
    this.exitBtn.setTexture('exit_red');
  }
}