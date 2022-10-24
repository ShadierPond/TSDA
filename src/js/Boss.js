class Boss {
    spritesheet;
    // Gegnerposition
    posX = 0;
    posY = 0;
    game;
    health = 5;
    maxHealth = this.health;
    isShot= false;
    bulletCycle = 5;
    // Gegnergröße
    width = 32;
    height = 32;
    // Animationseigenschaften
    interval = 0;
    animation = 4;
    frame = 0;
    frameRate = 0.20;
    frameZahl = 4;
    // zufalleigenschaften
    random = 0;
    lastTime = undefined;
    lastShot = undefined;
    isInViewport = false;
    playerNearby = false;
    playerDistance = 3;
    detection = 2;
    coolDown = 10;
    shootInterval = 0;
    shootFrameRate = 0.2;
    // virtuelle Methode für die Umdrehung des Gegners
    direction = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    constructor(game, x, y) {
      this.game = game;
      this.posX = x;
      this.posY = y;
      this.spritesheet = document.getElementById("boss");
      this.shadow = document.getElementById("shadow");
    }

    update(duration, playerX, playerY) {
      this.shoot(duration);
      this.move(duration);
      this.playerCollision(playerX, playerY)
      this.isInViewport = this.getIsInViewport(this.posX, this.posY, playerX, playerY);
      this.isInViewport && this.animate(duration);
    }
  
    move() {
      if(!this.bossDead) {
        let now = performance.now();
        if (this.lastTime === undefined) {
            this.random = Math.ceil(Math.random() * 4);
            this.coolDown = 10;
            this.lastTime = now;
        }
        this.diff = (now - this.lastTime) / (5 * 1000);
        if (this.diff > 1) {
            this.random = Math.ceil(Math.random() * 4);
            this.coolDown = 10;
            this.diff = 0;
            this.lastTime = now;
        }


        if (!this.playerNearby) {


          if (this.random == 1) {
            this.random = 0;
            Object.keys(this.direction).forEach(i => this.direction[i] = false);
            this.direction.right = true;
          }
          if (this.random == 2) {
            this.random = 0;
            Object.keys(this.direction).forEach(i => this.direction[i] = false);
            this.direction.left = true;
          }
          if (this.random == 3) {
            this.random = 0;
            Object.keys(this.direction).forEach(i => this.direction[i] = false);
            this.direction.down = true;
          }
          if (this.random == 4) {
            this.random = 0;
            Object.keys(this.direction).forEach(i => this.direction[i] = false);
            this.direction.up = true;
          }

          if (this.direction.up) {
            if(
              (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE < this.playerDistance &&
              (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE > 0 &&
              (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE > -this.detection &&
              (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE < this.detection
              ) {
                this.playerDistance = 5;
                this.detection = 4;
                this.playerNearby = true;
            } else {
                this.playerNearby = false;
                this.playerDistance = 3;
            }
          }

          if (this.direction.down) {
            if(
              (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE > -this.playerDistance &&
              (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE < 0 &&
              (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE > -this.detection &&
              (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE < this.detection
              ) {
                this.playerDistance = 5;
                this.detection = 4;
                this.playerNearby = true;
            } else {
              this.playerNearby = false;
              this.playerDistance = 3;
            }
          }

          if (this.direction.left) {
            if (
              (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE < this.playerDistance &&
              (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE > 0 &&
              (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE > -this.detection &&
              (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE < this.detection
            ) {
              this.playerDistance = 5;
              this.detection = 2;
              this.playerNearby = true;
            } else {
              this.playerNearby = false;
              this.playerDistance = 3;
            }
          }

          if (this.direction.right) {
            if (
              (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE > -this.playerDistance &&
              (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE < 0 &&
              (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE > -this.detection &&
              (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE < this.detection
            ) {
              this.playerDistance = 5;
              this.detection = 2;
              this.isFollowing = true;
            } else {
              this.playerNearby = false;
              this.playerDistance = 3;
            }
          }
        }

        if(this.playerNearby) {
          if(this.health > 1) {
            if(this.posX > this.game.player.posX) {
              this.direction.left = true;
              this.direction.right = false;
            }
            if(this.posX < this.game.player.posX){
              this.direction.left = false;
              this.direction.right = true;
            }

            if(this.posY > this.game.player.posY) {
              this.direction.up = true;
              this.direction.down = true;
            } if(this.posY < this.game.player.posY) {
              this.direction.up = false;
              this.direction.down = true;
            }
          }
       }
      }
    }


    animate(duration) {
      this.interval += duration;
      if (this.interval > this.frameRate) {
        this.interval = 0;
        this.frame = ++this.frame % this.frameZahl;
      }
      if(!this.bossDead) {
      if(this.direction.up) {
        this.animation = 5;
      }
      if(this.direction.down) {
        this.animation = 4;
      }
      if(this.direction.left) {
        this.animation = 6;
      }
      if(this.direction.right) {
        this.animation = 7;
      }
    }
    }
  
    draw(context) {
      if (this.isInViewport) {
        context.drawImage(
          this.shadow,
          0,
          0,
          this.width,
          this.height,
          this.posX,
          this.posY + 2,
          this.width,
          this.height
        );
        context.drawImage(
          this.spritesheet,
          this.frame * this.width,
          this.animation * this.height,
          this.width,
          this.height,
          this.posX,
          this.posY,
          this.width,
          this.height
        );
        // Healthbar Boss
        context.font = "8px Dogica";
        context.fillStyle = "red";
        context.fillText("HP: " + this.health + "/" + this.maxHealth, this.posX - 5, this.posY - 10);
      }
    }

    getIsInViewport(x, y, playerX, playerY) {
      let canvasWidth = this.game.canvas.width;
      let canvasHeight = this.game.canvas.height;

      return (
        x > playerX - (canvasWidth + this.width / 2) / 2 &&
        x < playerX + (canvasWidth + this.width / 2) / 2 &&
        y > playerY - (canvasHeight + this.height / 2) / 2 &&
        y < playerY + (canvasHeight + this.height / 2) / 2
      );
    }

    playerCollision(playerX, playerY) {
      // Wenn der Spieler mit einem Gegner/Boss kollidiert, stirbt er bzw. wird das Spiel beendet
      if(!this.game.player.playerDead && !this.bossDead &&
        playerX > this.posX - 20  &&
        playerX < this.posX + 20 &&
        playerY > this.posY - 16  &&
        playerY < this.posY + 16
        ) {
        this.game.player.death("enemyCollision");
      }
    }

    shoot(duration) {
      if(this.playerNearby && !this.game.player.playerDead && !this.bossDead || this.isShot && !this.game.player.playerDead && !this.bossDead) {
        this.shootInterval += duration;
        if (this.shootInterval > this.shootFrameRate) {
          this.shootInterval = 0;
          if(this.coolDown >= 0) {
            this.game.bossProjectiles.push(
              new BossProjectiles(
                this.game,
                this.posX,
                this.posY,
                this.direction,
                this.game.bossProjectiles.length
              )
            );
            this.coolDown--;
          }
        }
      }
    }

    death() {
      if(!this.bossDead) {
        this.bossDead = true;
        this.frame = 0;
        this.frameRate = 0.5;
        if(this.direction.up) this.animation = 1;
        if(this.direction.down) this.animation = 0;
        if(this.direction.left) this.animation = 2;
        if(this.direction.right) this.animation = 3;
        if(this.frame == 0) {
          setTimeout(() => {
            this.game.boss.splice(this.game.boss.indexOf(this), 1);
          }, 1000);
        }
      }
    }
  }