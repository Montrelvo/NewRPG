import { PlayerStats } from '../classes/PlayerStats.js';
import { Enemy } from '../classes/Enemy.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/space.png');
        this.load.image('background1', 'assets/background 1.png');
        this.load.image('background2', 'assets/background 2.png');
        this.load.image('background3', 'assets/background 3.png');
        this.load.image('background4', 'assets/background 4.png');
        this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('enemyShip', 'assets/Enemy Ship.png');

        //  The ship sprite is CC0 from https://ansimuz.itch.io - check out his other work!
        this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
    }

    create() {
        this.playerStats = new PlayerStats();
        console.log('Player Stats:', this.playerStats);

        this.backgrounds = ['background', 'background1', 'background2', 'background3', 'background4'];
        this.currentBackgroundIndex = 0;
        this.backgroundChangeTimer = 0;
        this.backgroundChangeDelay = 5000; // 5 seconds

        this.background = this.add.tileSprite(640, 360, 1280, 720, this.backgrounds[this.currentBackgroundIndex]);

        const ship = this.add.sprite(300, 360, 'ship'); // Move player ship to the left side

        ship.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
            frameRate: 15,
            repeat: -1
        });

        ship.play('fly');

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 15 }), // Assuming 16 frames for explosion
            frameRate: 20,
            repeat: 0 // Play once
        });

        // Enemy Group
        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true
        });

        // Spawn a few enemies for testing
        this.spawnEnemy(900, 100);
        this.spawnEnemy(1100, 300);
        this.spawnEnemy(800, 500);

        // Listen for enemy killed event
        this.events.on('enemyKilled', this.handleEnemyKilled, this);
    }

    update(time, delta) {
        this.background.tilePositionX += 2;

        this.backgroundChangeTimer += delta;
        if (this.backgroundChangeTimer >= this.backgroundChangeDelay) {
            this.currentBackgroundIndex = (this.currentBackgroundIndex + 1) % this.backgrounds.length;
            this.background.setTexture(this.backgrounds[this.currentBackgroundIndex]);
            this.backgroundChangeTimer = 0;
        }
    }

    spawnEnemy(x, y) {
        const enemy = this.enemies.get(x, y, 'enemyShip', 0, 50, 5, 20, 100); // health, attack, xp, speed
        if (enemy) {
            enemy.scene = this; // Pass the scene reference to the enemy
            enemy.setActive(true);
            enemy.setVisible(true);
            enemy.body.enable = true;
            // enemy.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100)); // Random initial velocity - removed as movement is now handled in Enemy.js
        }
    }

    handleEnemyKilled(experienceReward) {
        this.playerStats.gainExperience(experienceReward);
        console.log(`Player gained ${experienceReward} XP. Current XP: ${this.playerStats.experience}, Level: ${this.playerStats.level}`);
    }
    
}
