export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, health, attackDamage, experienceReward, speed) {
        super(scene, x, y, texture, frame);
        this.scene = scene; // Store scene reference

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.health = health;
        this.maxHealth = health;
        this.attackDamage = attackDamage;
        this.experienceReward = experienceReward;
        this.speed = speed;

        this.setCollideWorldBounds(true);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }

    dealDamage() {
        return this.attackDamage;
    }

    die() {
        this.disableBody(true, true); // Disable body and hide

        // Create and play explosion animation at enemy's position
        const explosion = this.scene.add.sprite(this.x, this.y, 'explosion');
        explosion.play('explode');

        // Destroy explosion sprite after animation completes
        explosion.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            explosion.destroy();
        });

        console.log("Enemy defeated!");
        this.scene.events.emit('enemyKilled', this.experienceReward); // Emit event for experience gain
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        // Simple movement: move towards the left
        this.setVelocityX(-this.speed);
    }
}