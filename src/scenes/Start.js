import { PlayerStats } from '../classes/PlayerStats.js';
import { Enemy } from '../classes/Enemy.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/space.png');
        this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('enemyShip', 'assets/spaceship.png'); // Re-using spaceship for enemy for now

        //  The ship sprite is CC0 from https://ansimuz.itch.io - check out his other work!
        this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
    }

    create() {
        this.playerStats = new PlayerStats();
        console.log('Player Stats:', this.playerStats);

        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        const explosion = this.add.sprite(640, 200, 'explosion');

        const ship = this.add.sprite(640, 360, 'ship');

        ship.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
            frameRate: 15,
            repeat: -1
        });

        ship.play('fly');

        explosion.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 15 }), // Assuming 16 frames for explosion
            frameRate: 20,
            repeat: -1
        });

        explosion.play('explode');

        // Enemy Group
        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true
        });

        // Spawn a few enemies for testing
        this.spawnEnemy(200, 100);
        this.spawnEnemy(1000, 100);
        this.spawnEnemy(640, 500);

        // Listen for enemy killed event
        this.events.on('enemyKilled', this.handleEnemyKilled, this);
    }

    update() {
        this.background.tilePositionX += 2;
    }

    spawnEnemy(x, y) {
        const enemy = this.enemies.get(x, y, 'enemyShip', 0, 50, 5, 20, 100); // health, attack, xp, speed
        if (enemy) {
            enemy.setActive(true);
            enemy.setVisible(true);
            enemy.body.enable = true;
            enemy.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100)); // Random initial velocity
        }
    }

    handleEnemyKilled(experienceReward) {
        this.playerStats.gainExperience(experienceReward);
        console.log(`Player gained ${experienceReward} XP. Current XP: ${this.playerStats.experience}, Level: ${this.playerStats.level}`);
    }
    
}
