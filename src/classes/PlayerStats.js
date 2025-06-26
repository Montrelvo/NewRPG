export class PlayerStats {
    constructor() {
        this.attack = 10;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.maxShield = 50;
        this.shield = this.maxShield;
        this.experience = 0;
        this.level = 1;
        this.experienceToNextLevel = 100;
    }

    takeDamage(amount) {
        if (this.shield > 0) {
            this.shield -= amount;
            if (this.shield < 0) {
                this.health += this.shield; // Reduce health by the remaining damage
                this.shield = 0;
            }
        } else {
            this.health -= amount;
        }

        if (this.health < 0) {
            this.health = 0;
            // Trigger game over or player death event
            console.log("Player defeated!");
        }
    }

    gainExperience(amount) {
        this.experience += amount;
        if (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5); // Increase XP needed for next level
        this.maxHealth += 20;
        this.health = this.maxHealth; // Fully heal on level up
        this.maxShield += 10;
        this.shield = this.maxShield; // Fully recharge shield on level up
        this.attack += 2;
        console.log(`Player leveled up to level ${this.level}!`);
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    rechargeShield(amount) {
        this.shield = Math.min(this.maxShield, this.shield + amount);
    }
}