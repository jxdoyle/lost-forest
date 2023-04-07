import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  init(data) {
    this.score = data.score;
    this.kills = data.kills;
  }

  preload() {
    this.width = this.scale.width;
    this.height = this.scale.height;
  }

  create() {
    const gameOver = this.sound.add('gameover', { volume: 0.5 });
    gameOver.play();

    this.cameras.main.fadeIn(1000, 0, 0, 0);

    const title = this.make.text({
      x: this.width / 2,
      y: this.height / 2,
      text: 'GAME OVER',
      style: {
        fontSize: '150px',
        fill: '#ffffff',
        fontFamily: 'Headliner, monospace',
      },
    });
    title.setOrigin(0.5, 0.5);

    const score = this.make.text({
      x: this.width / 2,
      y: this.height / 2 + title.height / 2 + 40,
      text: `SCORE: ${this.score}  |  KILLS: ${this.kills}`,
      style: {
        fontSize: '40px',
        fill: '#ffffff',
        fontFamily: 'Monogram, monospace',
      },
    });
    score.setOrigin(0.5, 0.5);

    title.y -= title.height / 2;
    score.y -= title.height / 2;

    this.ending = this.sound.add('ending', { volume: 0.25, loop: true });

    this.time.delayedCall(3000, () => {
      this.ending.play();
      this.cameras.main.fadeOut(1000, 0, 0, 0);
    });

    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('play-again', { song: this.ending, score: this.score, kills: this.kills });
    });
  }
}