import Phaser from 'phaser';
import createAligned from '../javascript/createAligned';
import gameOptions from '../options/gameConfig';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game-start'); // Call the constructor of the parent class Phaser.Scene and pass the string 'game-start' as the scene key.
  }

  preload() {
    this.width = this.scale.width; // Get the width of the game canvas
    this.height = this.scale.height; // Get the height of the game canvas
  }

  create() {
    // Fades in the main camera with a duration of 1000ms and RGB color values of (255, 255, 255)
    this.cameras.main.fadeIn(1000, 255, 255, 255); 
    // Adds a game music sound with a volume of 0.25 and sets it to loop indefinitely
    this.gameMusic = this.sound.add('gameMusic', { volume: 0.25, loop: true }); 
    this.gameMusic.play(); // Plays the game music
    this.alive = true; // Sets a boolean variable 'alive' to true
    this.skeletonAlive = true; // Sets a boolean variable 'skeletonAlive' to true
    this.playerJumps = 0; // Sets the number of player jumps to 0
    this.playerDrops = 0; // Sets the number of player drops to 0
    this.platformAdded = 0; // Sets the number of platforms added to 0
    this.spikeAdded = 0; // Sets the number of spikes added to 0
    this.kills = 0; // Sets the number of kills to 0
    this.score = 0; // Sets the score to 0
    this.scoreSpeed = gameOptions.scoreSpeed; // Sets the score speed to the value of 'scoreSpeed'
    
    const bgh = this.textures.get('background').getSourceImage().height; // Gets the height of the 'background' texture image
    // Adds a tile sprite to the game with position (0, this.height) and size (this.width, bgh), using the 'background' texture
    this.add.tileSprite(0, this.height, this.width, bgh, 'background')
      .setOrigin(0, 1); // Sets the origin of the tile sprite to the top-left corner (0, 1) to align it to the bottom of the screen

    // Creates and aligns the background sprites using 'createAligned' function, and assigns variables
    this.bg1 = createAligned(this, -23, 'bgTree_1', true); 
    this.bg2 = createAligned(this, 100, 'lights_1', false);
    this.bg3 = createAligned(this, -53, 'bgTree_2', true); 
    this.bg4 = createAligned(this, -75, 'bgTree_3', true); 
    this.bg5 = createAligned(this, 100, 'lights_2', false); 
    this.bg6 = createAligned(this, -45, 'bgTree_4', true); 
    this.bg7 = createAligned(this, 0, 'upTree', true); 
    this.bg8 = createAligned(this, 10, 'floor', true, -250);

    this.bg8 = this.physics.add.existing(this.bg8); // Adds the floor sprite to the physics system as an existing object
    this.bg8.body.setImmovable(); // Sets the body of floor to be immovable
    this.bg8.body.setSize(this.width, 58); // Sets the size of floor body to match the width of the game and a height of 55
    
    this.scoreText = this.make.text({ // Creates a text object for displaying the score
      x: this.width - 160, // Sets the x-coordinate of the text
      y: 40, // Sets the y-coordinate of the text
      text: 'SCORE: 0  |  KILLS: 0', // Sets the initial text content
      style: {
        fontSize: '42px', // Sets the font size
        fill: '#ffffff', // Sets the font color
        fontFamily: 'Monogram, monospace', // Sets the font family
      },
    });

    this.otherScoreText = this.make.text({ // Creates a text object for displaying the score
      x: this.width - 160, // Sets the x-coordinate of the text
      y: 80, // Sets the y-coordinate of the text
      text: 'BEST SCORE: 0  |  MOST KILLS: 0', // Sets the initial text content
      style: {
        fontSize: '26px', // Sets the font size
        fill: '#ffffff', // Sets the font color
        fontFamily: 'Monogram, monospace', // Sets the font family
      },
    });

    // Add an event to update the score at a given delay using the time module
    this.scoreCounter = this.time.addEvent({
      delay: this.scoreSpeed, // Delay between each update in milliseconds
      callback: () => { // Callback function to update the score
        this.score += 1; // Increment the score by 1
      },
      callbackScope: this, // Set the scope of the callback function to the current object
      loop: true, // Set the event to loop indefinitely
    });

    // Add a player sprite with physics enabled at the specified position and with the specified texture
    this.player = this.physics.add.sprite(gameOptions.playerPositionX, gameOptions.playerPositionY, 'player')
      .setOrigin(0.5, 1) // Set the origin of the player to the center-bottom of the sprite
      .setScale(1.5) // Set the player's scale
      .setDepth(1); // Set the player's depth to 1 to ensure it is always on top of other sprites

    this.player.setGravityY(gameOptions.playerGravity); // Set the player's gravity on the Y-axis using the game options

    // Add a collider between the player and the floor
    this.physics.add.collider(this.player, this.bg8, () => {
      this.platformTouching = false; // Set the platformTouching flag to false
      if (!this.player.anims.isPlaying && this.alive) { // If player animation is not playing and the player is alive
        this.player.setTexture('player'); // Set the player's texture to 'player'
        this.player.anims.play('run', true); // Play the 'run' animation with looping
      }
    });

    // Add an overlap event between the player and the floor
    this.physics.add.overlap(this.player, this.bg8, () => {
      this.player.setPosition(200, this.height - 104); // Set the player's position to a specified coordinate when overlapping occurs
    });

    // Add keyboard input keys and bind event listeners to them
    const keys = this.input.keyboard.addKeys({
      space: 'SPACE', // Bind space key to 'SPACE' event
      a: 'A', // Bind 'a' key to 'A' event
      d: 'D', // Bind 'd' key to 'D' event
      w: 'W', // Bind 'w' key to 'W' event
    });

    // Bind event listeners to the keys for specific events
    keys.space.on('down', this.jump, this); // Call 'jump' method when space key is pressed down
    keys.w.on('down', this.jump, this); // Call 'jump' method when 'w' key is pressed down
    keys.a.on('down', this.attack, this); // Call 'attack' method when 'a' key is pressed down
    keys.d.on('down', this.instaDrop, this); // Call 'instaDrop' method when 'd' key is pressed down


    // Add event listener for pointerdown event
    this.input.on('pointerdown', (pointer) => {
      // Check if player is alive
      if (this.alive) {
        if (pointer.rightButtonDown()) {
          // If right click is pressed, call instaDrop() function
          this.instaDrop();
        } else if (pointer.leftButtonDown() && this.player.y > 650) {
          // If left click is pressed, call attack() function
          this.attack();
        }
      }
    }, this);

    // Create a group for platforms with a remove callback function to move platform to platformPool
    this.platformGroup = this.add.group({
      removeCallback: (platform) => {
        platform.scene.platformPool.add(platform);
      },
    });

    // Create a group for platformPool with a remove callback function to move platform to platformGroup
    this.platformPool = this.add.group({
      removeCallback: (platform) => {
        platform.scene.platformGroup.add(platform);
      },
    });

    // Generate random width and height for initial platform
    const randomPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
    const randomPlatformHeight = Phaser.Math.Between(gameOptions.platformInitial[0], gameOptions.platformInitial[1]);

    // Add initial platform to the game
    this.addPlatform(this.width, randomPlatformHeight, randomPlatformWidth);

    // Add collider between player and platformGroup with a callback function
    // to set player velocity and play animation when overlapping
    this.physics.add.collider(this.player, this.platformGroup, () => {
      this.platformTouching = true;
      this.player.setVelocityX(gameOptions.platformSpeed);
      if (!this.player.anims.isPlaying && this.alive) {
        this.player.setTexture('player');
        this.player.anims.play('run', true);
      }
    }, null, this);

    // Create a group for spikes with a remove callback function to move spike to spikePool
    this.spikeGroup = this.add.group({
      removeCallback: (spike) => {
        spike.scene.spikePool.add(spike);
      },
    });

    // Create a group for spikePool with a remove callback function to move spike to spikeGroup
    this.spikePool = this.add.group({
      removeCallback: (spike) => {
        spike.scene.spikeGroup.add(spike);
      },
    });

    // Add time event to spawn spikes periodically
    this.spikeFloor = this.time.addEvent({
      delay: gameOptions.spikeSpawnRate,
      callback: () => {
        this.spawnSpike();
      },
      callbackScope: this,
      loop: true,
    });

    // Create a group for floor spikes
    this.floorSpikeGroup = this.add.group();

    // Add a collider between player and floor spike group
    this.floorSpikeCollider = this.physics.add.collider(this.player, this.floorSpikeGroup, () => {
      // Set player status to dead
      this.alive = false;
      // Set player texture to dead
      this.player.setTexture('player_dead');
      // Play dead animation for player and offset players texture difference between player and player_dead
      this.player.anims.play('dead', true);
      this.player.setSize(this.player.width, this.player.height - 1);
      // Play death sound effect
      this.sound.play('death_sound', { volume: 0.25 });
      // Execute outro function
      this.outro();
    }, null, this);

    // Create a time event for spawning skeletons
    this.skeletonSpawner = this.time.addEvent({
      delay: gameOptions.skeletonSpawnRate,
      callback: () => {
        this.spawnSkeleton();
      },
      callbackScope: this,
      loop: true,
    });

    // Create a group for skeletons
    this.skeletonGroup = this.add.group();

    // Add a collider between player and skeleton group
    this.skeletonCollider = this.physics.add.collider(this.player, this.skeletonGroup, () => {
      // Check if player is alive, skeleton is alive, and player is not in attack animation
      if (this.alive && this.skeletonAlive && this.player.anims.getName() !== 'attack') {
        // Set player status to dead
        this.alive = false;
        // Set player texture to dead
        this.player.setTexture('player_dead');
        // Play dead animation for player and offset texture differences between player and player_dead
        this.player.anims.play('dead', true);
        this.player.setSize(this.player.width, this.player.height - 1);
        // Play death sound effect
        this.sound.play('death_sound', { volume: 0.25 });
        // Execute outro function
        this.outro();
      }
    }, null, this);
  }

  update() {
    // Set the player's x-coordinate to a predefined position
    this.player.x = gameOptions.playerPositionX;
  
    // Reset the player's horizontal velocity to 0
    this.player.setVelocityX(0);
  
    if (this.alive) {
      // Update the score bonus
      this.scoreBonus();
  
      // Check for overlap between the player and the platforms (collision detection)
      this.platformOverlap();
  
      // Check for overlap between the player and the skeletons (collision detection)
      if (this.skeletonGroup.getLength()) {
        this.skeletonGroup.getChildren().forEach(skeleton => {
          // Add overlap collider between player and skeleton
          this.skeletonOverlap = this.physics.add.overlap(this.player, skeleton, () => {
            // Check if the player is in attack animation, then play death animation for skeleton
            if (this.player.anims.getName() === 'attack') {
              this.skeletonAlive = false;
              skeleton.anims.playReverse('skeleton_death');
            }
          });
  
          // Remove the overlap collider if skeleton is in death animation
          if (skeleton.anims.getName() === 'skeleton_death') {
            this.physics.world.removeCollider(this.skeletonOverlap);
          }
        });
      }
  
      // Update the background parallax effect
      this.backgroundParallax();
  
      // Update the score text
      const bestScore = localStorage.getItem('bestScore');
      const mostKills = localStorage.getItem('mostKills');
      this.scoreText.setText(`SCORE: ${this.score}  |  KILLS: ${this.kills}`);
      this.scoreText.x = this.width - this.scoreText.width - 50;
      this.otherScoreText.setText(`BEST SCORE: ${bestScore || 0}  |  MOST KILLS: ${mostKills || 0}`);
      this.otherScoreText.x = this.width - this.otherScoreText.width - 50;
  
      // Remove objects that are out of screen
      this.objectRemove();
  
      // Spawn platforms
      this.platformSpawner();
    } else {
      // Execute actions after player dies
      this.theAfterLife();
    }
  }  

  jump() {
    // Check if the player is alive and is touching the ground or has remaining jumps
    if ((this.alive) && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps))) {
      // If the player is touching the ground, reset the number of jumps
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
      }
  
      // Apply vertical velocity to the player to make them jump
      this.player.setVelocityY(gameOptions.jumpForce * -1);
  
      // Play the 'jump' animation on the player
      this.player.anims.play('jump', true);
  
      // Increment the jump counter
      this.playerJumps += 1;
    }
  }  

  attack() {
    // Set player's texture to 'player_attack'
    this.player.setTexture('player_attack');
    // Set player's hitbox size to match its width and height
    this.player.setSize(this.player.width, this.player.height);
    // Play 'attack' animation on player with looping enabled
    this.player.anims.play('attack', true);
  
    // Event listener for animation completion
    this.player.on('animationcomplete', () => {
      // Reset player's texture to 'player'
      this.player.setTexture('player');
      // Reset player's hitbox size to match its width and height
      this.player.setSize(this.player.width, this.player.height);

      // Check player's position and play 'run' animation if conditions are met
      if (this.player.y < gameOptions.playerPositionY && this.player.y > 620 && this.alive) {
        this.player.y = gameOptions.playerPositionY;
        this.player.play('run');
      }
    });
  }  

  instaDrop() {
    // Check if player is alive and not touching the ground or if player has available drops
    if ((this.alive) && (!this.player.body.touching.down || (this.playerDrops > 0 && this.playerJumps < gameOptions.drops))) {
      // If player is touching the ground, reset playerDrops counter to 0
      if (this.player.body.touching.down) {
        this.playerDrops = 0;
      }
      // Set player's vertical velocity to the specified drop force
      this.player.setVelocityY(gameOptions.dropForce);
      // Increment playerDrops counter by 1
      this.playerDrops += 1;
    }
  }
  
  addPlatform(posX, posY, platformWidth) {
    // Increment the platformAdded counter
    this.platformAdded += 1;
    
    let platform;
    
    // Check if there is an available platform in the platformPool
    if (this.platformPool.getLength()) {
      // If so, get the first platform from the platformPool
      platform = this.platformPool.getFirst();
      // Set the position, activity, and visibility of the platform
      platform.x = posX;
      platform.y = posY;
      platform.active = true;
      platform.visible = true;
      // Remove the platform from the platformPool
      this.platformPool.remove(platform);
      // Set the display width and tile scale of the platform based on the given platformWidth
      platform.displayWidth = platformWidth;
      platform.tileScaleX = 1 / platform.scaleX;
    } else {
      // If there is no available platform in the platformPool, create a new tileSprite platform
      platform = this.add.tileSprite(posX, posY, platformWidth, 50, 'platform');
      // Add physics to the platform
      this.physics.add.existing(platform);
      // Set the platform as immovable
      platform.body.setImmovable();
      // Set the velocity of the platform based on the platformSpeed
      platform.body.setVelocityX(gameOptions.platformSpeed * -1);
      // Set the body size of the platform, leaving out 10 pixels from the height
      platform.body.setSize(platform.body.width, platform.body.height - 20);
      // Add the platform to the platformGroup
      this.platformGroup.add(platform);
    }
  
    // Set the nextPlatformDistance to a random value within the spawnRange defined in gameOptions
    this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
  }

  platformSpawner() {
    // Initialize the minimum distance to be the width of the game screen
    let minDistance = this.width;
  
    // Iterate through each platform in the `platformGroup`
    this.platformGroup.getChildren().forEach(platform => {
      // Calculate the distance between the minimum distance and the platform's x position
      const platformDistance = minDistance - platform.x - platform.displayWidth / 2;
  
      // Update the minimum distance if the calculated platform distance is less than the current minimum distance
      if (platformDistance < minDistance) {
        minDistance = platformDistance;
      }
  
      // Check if the platform has moved past the left edge of the game screen
      if (platform.x < -platform.displayWidth / 2) {
        // Kill and hide the platform, removing it from the game world
        this.platformGroup.killAndHide(platform);
        // Remove the platform from the `platformGroup`
        this.platformGroup.remove(platform);
      }
    }, this);
  
    // Check if the minimum distance between platforms is greater than the `nextPlatformDistance`
    if (minDistance > this.nextPlatformDistance) {
      // Calculate the width of the next platform based on the platformSizeRange
      const nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
  
      let platformRandomHeight;
      // If no platform has been added yet, set the platform random height based on the initial range
      if (this.platformAdded === 0) {
        platformRandomHeight = Phaser.Math.Between(gameOptions.platformInitial[0], gameOptions.platformInitial[1]);
      } else {
        // Otherwise, set the platform random height based on the height range
        platformRandomHeight = Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
      }
  
      // Add a new platform to the game world with a position at the right edge of the game screen plus half of the next platform's width, and the calculated random height
      this.addPlatform(this.width + nextPlatformWidth / 2, platformRandomHeight, nextPlatformWidth);
    }
  }
  
  spawnSpike() {
    // Increment the `spikeAdded` counter by 1
    this.spikeAdded += 1;
  
    // Get the height of the 'spike' texture
    const h = this.textures.get('spike').getSourceImage().height;
  
    // Create a new tileSprite for the floor spike, positioned at the right edge of the game screen, at the player's position Y, with a width and a random scaling factor
    const floorSpike = this.add.tileSprite(this.width, gameOptions.playerPositionY + 4, gameOptions.spikeWidth * Phaser.Math.Between(gameOptions.spikeScaleRange[0], gameOptions.spikeScaleRange[1]), h, 'spike');
  
    // Add physics to the floor spike to enable collision
    this.physics.add.existing(floorSpike);
  
    // Set the floor spike to be immovable, meaning it won't be affected by collisions or physics forces
    floorSpike.body.setImmovable();
  
    // Set the horizontal velocity of the floor spike to move towards the left
    floorSpike.body.setVelocityX(gameOptions.platformSpeed * -1);
  
    // Add the floor spike tileSprite to the `floorSpikeGroup`
    this.floorSpikeGroup.add(floorSpike);
  }

  spawnSkeleton() {
    // Set the `skeletonAlive` flag to true, indicating that a skeleton is spawned and alive
    this.skeletonAlive = true;
  
    // Create a new sprite for the skeleton, positioned at the right edge of the game screen
    const skeleton = this.physics.add.sprite(this.width, gameOptions.playerPositionY - 8, 'skeleton_walk')
      .setScale(2.5);
  
    // Set the horizontal velocity of the skeleton to move towards the left
    skeleton.setVelocityX(gameOptions.platformSpeed * -1 - 50);
  
    // Play the 'skeleton_walking' animation in reverse, to show skeleton is moving towards the left
    skeleton.anims.playReverse('skeleton_walking');
  
    // Set the skeleton to be immovable, meaning it won't be affected by collisions or physics forces
    skeleton.setImmovable();
  
    // Add the skeleton sprite to the `skeletonGroup`
    this.skeletonGroup.add(skeleton);
  }

  scoreBonus() {
    // Check if the player is running on a platform
    if (this.player.body.touching.down && this.platformTouching) {
      // If so, set the delay of the score counter to a lower value (increasing the score gained)
      this.scoreCounter.delay = gameOptions.scoreSpeed - 200;
    } else {
      // If not, set the delay of the score counter to the default value
      this.scoreCounter.delay = gameOptions.scoreSpeed;
    }
  }

  platformOverlap() {
    // Check if the platform group has any platforms
    if (this.platformGroup.getLength()) {
      // Loop through each platform in the platform group
      this.platformGroup.getChildren().forEach(platform => {
        // Calculate the Y position of the platform's top edge
        const platformPosY = platform.body.y - platform.body.height + 10.5;
  
        // Add overlap callback for top collisions
        this.physics.add.overlap(this.player, platform, () => {
          // Check if the player's bottom edge is at the same height as the platform's top edge
          if (this.player.body.bottom === platformPosY - 5) {
            // When the player overlaps with the platform from the top and is at the same height,
            // set the player's Y position to be just above the platform
            this.player.y = platformPosY - this.player.body.height + 20;
          }
        });
      });
    }
  }

  backgroundParallax() {
    // Array of background sprites
    const bgs = [this.bg1, this.bg2, this.bg3, this.bg4, this.bg5, this.bg6, this.bg7, this.bg8];
    // Array of factors for parallax effect for each background sprite
    const fact = [1.45, 1.5, 1.65, 1.75, 1.85, 2.1, 3.55, 5.1];
  
    // (Scrolling speed) Update the tile position of each background sprite based on their respective factors
    bgs.forEach((bg, index) => {
      bg.tilePositionX += fact[index];
    });
  }
  
  objectRemove() {
    // Loop through each child object (spike) in spikeGroup
    this.spikeGroup.getChildren().forEach(spike => {
      // Check if the spike's x-coordinate is less than the negative half of its display width
      if (spike.x < -spike.displayWidth / 2) {
        // Mark the spike as killed and hidden
        this.spikeGroup.killAndHide(spike);
        // Remove the spike from the group
        this.spikeGroup.remove(spike);
      }
    }, this);
  
    // Loop through each child object (spike) in floorSpikeGroup
    this.floorSpikeGroup.getChildren().forEach(spike => {
      // Check if the spike's x-coordinate is less than the negative half of its display width
      if (spike.x < -spike.displayWidth / 2) {
        // Remove the spike from the group
        this.floorSpikeGroup.remove(spike);
        // Destroy the spike object
        spike.destroy();
      }
    }, this);
  
    // Loop through each child object (skeleton) in skeletonGroup
    this.skeletonGroup.getChildren().forEach(skeleton => {
      // Check if the skeleton's x-coordinate is less than the negative half of its display width
      // and if its animation name is 'skeleton_death'
      if (skeleton.x < -skeleton.displayWidth / 2 && skeleton.anims.getName() === 'skeleton_death') {
        // Increment the kills counter by 1 and add 100 to score
        this.kills += 1;
        // Remove the skeleton from the group
        this.skeletonGroup.remove(skeleton);
        // Destroy the skeleton object
        skeleton.destroy();
      }
      // If the above condition is not met, check if the skeleton's x-coordinate is less than the negative half of its display width
      else if (skeleton.x < -skeleton.displayWidth / 2) {
        // Remove the skeleton from the group
        this.skeletonGroup.remove(skeleton);
        // Destroy the skeleton object
        skeleton.destroy();
      }
    }, this);
  }
  
  theAfterLife() {
    // Stop the game music
    this.gameMusic.stop();
  
    // Pause the score counter, skeleton spawner, and spike floor
    this.scoreCounter.paused = true;
    this.skeletonSpawner.paused = true;
    this.spikeFloor.paused = true;
  
    // Set the velocity of all platforms in the platform group to 0
    this.platformGroup.getChildren().forEach(platform => {
      platform.body.setVelocityX(0);
    });
  
    // Set the velocity of all spikes in the spike group to 0
    this.spikeGroup.getChildren().forEach(spike => {
      spike.setVelocityX(0);
    });
  
    // Set the velocity of all spikes in the floor spike group to 0
    this.floorSpikeGroup.getChildren().forEach(spike => {
      spike.body.setVelocityX(0);
    });
  
    // Set the velocity of all skeletons in the skeleton group to -50, except for skeletons in the 'skeleton_death' animation
    this.skeletonGroup.getChildren().forEach(skeleton => {
      skeleton.body.setVelocityX(-50);
  
      // Set the velocity of skeletons in the 'skeleton_death' animation to 0
      if (skeleton.anims.getName() === 'skeleton_death') {
        skeleton.body.setVelocityX(0);
      }
    });
  
    // Remove all keyboard input listeners
    this.input.keyboard.removeAllKeys();
  
    // Remove colliders
    this.physics.world.removeCollider(this.spikeCollider);
    this.physics.world.removeCollider(this.floorSpikeCollider);
    this.physics.world.removeCollider(this.skeletonCollider);
    this.physics.world.removeCollider(this.skeletonOverlap);

    // Establishes best score and kills
    const bestScoreText = localStorage.getItem('bestScore');
    const mostKillsText = localStorage.getItem('mostKills');
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);
    const mostKills = mostKillsText && parseInt(mostKillsText, 10);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem('bestScore', this.score);
    }
    if (!mostKills || this.kills > mostKills) {
      localStorage.setItem('mostKills', this.kills);
    }

    // Delayed callback to set the player texture to 'player_dead' after 1 second
    this.time.delayedCall(1000, () => {
      this.player.setTexture('player_dead', 7);
      this.player.setSize(this.player.width, this.player.height - 1);
    });
  }
  
  outro() {
    // Delayed callback to fade out the main camera after 3 seconds
    this.time.delayedCall(3000, () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
    });
  
    // Once the fade out is complete, start the 'game-over' scene with score and kills as params
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('game-over', { score: this.score, kills: this.kills });
    });
  } 
}