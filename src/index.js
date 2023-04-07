import Phaser from 'phaser';
import './css/main.css';
import Game from './scenes/Game';
import Boot from './scenes/Boot';
import PreLoader from './scenes/PreLoader';
import titleScene from './scenes/TitleScene';
import instructions from './scenes/InstructionsScene';
import gameover from './scenes/GameOver';
import playAgain from './scenes/playAgain';
import ScoreScene from './scenes/ScoreScene';


window.onload = () => {
  const config = {
    type: Phaser.AUTO,
    parent: 'divId',
    width: 1250,
    height: 725,
    scale: {
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        //debug: true,
      },
    },
    dom: {
      createContainer: true,
    },
    // eslint-disable-next-line max-len
    scene: [Boot, PreLoader, titleScene, instructions, ScoreScene, Game, gameover, playAgain],
  };

  // eslint-disable-next-line no-unused-vars
  const game = new Phaser.Game(config);

  window.focus();
};
