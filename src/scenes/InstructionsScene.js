import Phaser from 'phaser';

export default class Instructions extends Phaser.Scene {
  constructor() {
    super('instructions');
  }

  preload() {
    this.width = this.scale.width;
    this.height = this.scale.height;
  }

  create() {
    this.cameras.main.fadeIn(1000, 255, 255, 255);

    this.bg = this.add.sprite(0, 0, 'instructions_bg').setOrigin(0, 0);
    this.bg.setDisplaySize(this.width, this.height);

    const topIns = this.make.text({
      x: this.width / 2,
      y: 180,
      text: "My love I am scared I know not how deep in this woods I have been taken but whatever you face please find me, save me and bring me back to you",
      style: {
        fontSize: '32px',
        fill: '#000000',
        fontFamily: 'Neucha, monospace',
        align: 'center',
        wordWrap: { width: this.width - 250, useAdvancedWrap: true},
      },
    });
    topIns.setOrigin(0.5, 0.5);

    const title = this.make.text({
      x: this.width / 2,
      y: 280,
      text: "Remember the things you need to do to survive",
      style: {
        fontSize: '32px',
        fill: '#000000',
        fontFamily: 'Neucha, monospace',
        align: 'center',
        wordWrap: { width: this.width - 300, useAdvancedWrap: true },
      },
    });
    title.setOrigin(0.5, 0.5);

    const nextLine2 = this.make.text({
      x: this.width / 2,
      y: 330,
      text: "To jump over the obstacles press 'W' or 'SPACE'",
      style: {
        fontSize: '32px',
        fill: '#000000',
        fontFamily: 'Neucha, monospace',
        align: 'center',
        wordWrap: { width: this.width - 300, useAdvancedWrap: true },
      },
    });
    nextLine2.setOrigin(0.5, 0.5);

    const nextLine3 = this.make.text({
      x: this.width / 2,
      y: 380,
      text: "To kill the monsters press 'A' or 'LEFT CLICK' the mouse button",
      style: {
        fontSize: '32px',
        fill: '#000000',
        fontFamily: 'Neucha, monospace',
        align: 'center',
        wordWrap: { width: this.width - 300 },
      },
    });
    nextLine3.setOrigin(0.5, 0.5);

    const nextLine4 = this.make.text({
      x: this.width / 2,
      y: 430,
      text: "To drop faster press 'D' or 'RIGHT CLICK' the mouse button",
      style: {
        fontSize: '32px',
        fill: '#000000',
        fontFamily: 'Neucha, monospace',
        align: 'center',
        wordWrap: { width: this.width - 300, useAdvancedWrap: true },
      },
    });
    nextLine4.setOrigin(0.5, 0.5);

    const cont = this.make.text({
      x: this.width / 2,
      y: 600,
      text: "Press 'ENTER' to continue",
      style: {
        fontSize: '45px',
        fill: '#000000',
        fontFamily: 'Headliner, monospace',
        align: 'center',
        wordWrap: { width: this.width - 300, useAdvancedWrap: true },
      },
    });
    cont.setOrigin(0.5, 0.5);

    ['A', 'D', 'SPACE', 'ENTER'].forEach(key => {
      const keyP = this.input.keyboard.addKey(key);
      keyP.on('down', () => {
        this.cameras.main.fadeOut(2000, 255, 255, 255);
        this.scene.start('game-start');
      });
    });
  }
}