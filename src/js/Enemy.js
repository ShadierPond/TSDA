class Enemy {
  game;
  spritesheet;
  id;
  // Gegnergröße
  WIDTH = 32;
  HEIGHT = 32;
  // Geschwindigkeitseigenschaften
  SPEED = 40;
  FOLLOW_SPEED_MODIFIER = 2.4; // modifiziert geschwindigkeit wenn gegner dem spieler folgt
  currentSpeed = 40;

  followDistance = 3; // verfolgungsdistanz
  detection = 1; // sichtbereich des Gegners
  // Gegnerposition
  posX = 0;
  posY = 0;

  // Animationseigenschaften
  interval = 0;
  animation = 4;
  frame = 0;
  frameRate = 0.2;
  frameZahl = 4;
  // verfolgungschecker
  isFollowing = false;
  // zufalleigenschaften
  random = 0;
  lastTime = undefined;
  isInViewport = false; // Flag um Gegner nur zu zeichnen wenn er im Viewport ist
  // Objekt für die virtuelle Bewegung des Gegners
  controls = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  

  constructor(game, x, y, id) {
    this.game = game;
    this.id = id;
    this.posX = x;
    this.posY = y;
    this.spritesheet = document.getElementById("Enemy");
    this.shadow = document.getElementById("shadow");
  }

  update(duration, playerX, playerY) {
    this.move(duration);
    this.playerCollision(playerX, playerY)
    this.isInViewport = this.getIsInViewport(this.posX, this.posY, playerX, playerY);
    this.isInViewport && this.animate(duration);
  }

  move(duration) {
    let collide = this.collision(
      this.game.map.MAPS[this.game.level],
      this.game.map.TILE_SIZE,
      this.game.map.BLOCKED_TILES
    );

    if(!this.enemyDead) {
      //Spielerverfolgung 
      if (this.controls.up) {
        if(
          (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE < this.followDistance &&
          (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE > 0 &&
          (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE > -this.detection &&
          (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE < this.detection
          ) {
            Object.keys(this.controls).forEach(i => this.controls[i] = false);
            this.controls.up = true;
            this.currentSpeed = this.SPEED * this.FOLLOW_SPEED_MODIFIER;
            this.followDistance = 5;
            this.detection = 2;
            this.isFollowing = true;
        } else {
            this.isFollowing = false;
            this.currentSpeed = this.SPEED;
            this.followDistance = 3;
            this.detection = 1;
        }
      }

      if (this.controls.down) {
        if(
          (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE > -this.followDistance &&
          (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE < 0 &&
          (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE > -this.detection &&
          (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE < this.detection
          ) {
            Object.keys(this.controls).forEach(i => this.controls[i] = false);
            this.controls.down = true;
            this.currentSpeed = this.SPEED * this.FOLLOW_SPEED_MODIFIER;
            this.followDistance = 5;
            this.detection = 2;
            this.isFollowing = true;
        } else {
          this.currentSpeed = this.SPEED;
          this.isFollowing = false;
          this.followDistance = 3;
          this.detection = 1;
        }
      }

      if (this.controls.left) {
        if (
          (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE < this.followDistance &&
          (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE > 0 &&
          (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE > -this.detection &&
          (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE < this.detection
        ) {
          Object.keys(this.controls).forEach(i => this.controls[i] = false);
          this.controls.left = true;
          this.currentSpeed = this.SPEED * this.FOLLOW_SPEED_MODIFIER;
          this.followDistance = 5;
          this.detection = 2;
          this.isFollowing = true;
        } else {
          this.currentSpeed = this.SPEED;
          this.isFollowing = false;
          this.followDistance = 3;
          this.detection = 1;
        }
      }

    if (this.controls.right) {
      if (
        (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE > -this.followDistance &&
        (this.posX - this.game.player.posX) / this.game.map.TILE_SIZE < 0 &&
        (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE > -this.detection &&
        (this.posY - this.game.player.posY) / this.game.map.TILE_SIZE < this.detection
      ) {
        Object.keys(this.controls).forEach(i => this.controls[i] = false);
        this.controls.right = true;
        this.currentSpeed = this.SPEED * this.FOLLOW_SPEED_MODIFIER;
        this.followDistance = 5;
        this.detection = 2;
        this.isFollowing = true;
      } else {
        this.currentSpeed = this.SPEED;
        this.isFollowing = false;
        this.followDistance = 3;
        this.detection = 1;
      }
    }

  if (this.isFollowing == false) {
      let now = performance.now();
      if (this.lastTime === undefined) {
        this.random = Math.ceil(Math.random() * 4);
        this.lastTime = now;
      }
      this.diff = (now - this.lastTime) / (3 * 1000);
      if (this.diff > 1) {
        this.random = Math.ceil(Math.random() * 4);
        this.diff = 0;
        this.lastTime = now;
      }

      if (this.random == 1) {
        this.random = 0;
        this.animation = 6;
        Object.keys(this.controls).forEach(i => this.controls[i] = false);
        this.controls.right = true;
      }
      if (this.random == 2) {
        this.random = 0;
        this.animation = 7;
        Object.keys(this.controls).forEach(i => this.controls[i] = false);
        this.controls.left = true;
      }
      if (this.random == 3) {
        this.random = 0;
        this.animation = 4;
        Object.keys(this.controls).forEach(i => this.controls[i] = false);
        this.controls.down = true;
      }
      if (this.random == 4) {
        this.random = 0;
        this.animation = 5;
        Object.keys(this.controls).forEach(i => this.controls[i] = false);
        this.controls.up = true;
      }
    }

      if (this.controls.up) {
        if (
          (collide.upLeft && collide.downLeft && !collide.upRight) ||
          (collide.upRight && collide.downRight && !collide.upLeft) ||
          (!collide.upLeft && !collide.upRight)
        ) {
          this.posY -= duration * this.currentSpeed;
        } else {
          this.animation = 4;
          Object.keys(this.controls).forEach(i => this.controls[i] = false);
          this.controls.down = true;
          
        }
      }

      if (this.controls.down) {
        if (
          (collide.upLeft && collide.downLeft && !collide.downRight) ||
          (collide.upRight && collide.downRight && !collide.downLeft) ||
          (!collide.downRight && !collide.downLeft)
        ) {
          this.posY += this.currentSpeed * duration;
        } else {
          this.animation = 5;
          Object.keys(this.controls).forEach(i => this.controls[i] = false);
          this.controls.up = true;
        }
      }

      if (this.controls.left) {
        if (
          (collide.upLeft && collide.upRight && !collide.downLeft) ||
          (collide.downLeft && collide.downRight && !collide.upLeft) ||
          (!collide.upLeft && !collide.downLeft)
        ) {
          this.posX -= this.currentSpeed * duration;
        } else {
          this.animation = 6;
          Object.keys(this.controls).forEach(i => this.controls[i] = false);
          this.controls.right = true;
        }
      }

      if (this.controls.right) {
        if (
          (collide.upLeft && collide.upRight && !collide.downRight) ||
          (collide.downLeft && collide.downRight && !collide.upRight) ||
          (!collide.upRight && !collide.downRight)
        ) {
          this.posX += this.currentSpeed * duration;
        } else {
          this.animation = 7;
          Object.keys(this.controls).forEach(i => this.controls[i] = false);
          this.controls.left = true;
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
  }

  draw(context) {
    if (this.isInViewport) {
      // Gegner wird bei bewegung nicht unscharf
      context.imageSmoothingEnabled = false;
      context.drawImage(
        this.shadow,
        0,
        0,
        this.WIDTH,
        this.HEIGHT,
        this.posX,
        this.posY + 2,
        this.WIDTH,
        this.HEIGHT
      );
      //context.fillText(this.id, this.posX, this.posY - 10);
      context.drawImage(
        this.spritesheet,
        this.frame * this.WIDTH,
        this.animation * this.HEIGHT,
        this.WIDTH,
        this.HEIGHT,
        this.posX,
        this.posY,
        this.WIDTH,
        this.HEIGHT
      );
    }
  }

  getIsInViewport(x, y, playerX, playerY) {
    let canvasWidth = this.game.canvas.width;
    let canvasHeight = this.game.canvas.height;

    return (
      x > playerX - (canvasWidth + this.WIDTH / 2) / 2 &&
      x < playerX + (canvasWidth + this.WIDTH / 2) / 2 &&
      y > playerY - (canvasHeight + this.HEIGHT / 2) / 2 &&
      y < playerY + (canvasHeight + this.HEIGHT / 2) / 2
    );
  }

  // Kollisionskontrolle für Tiles blockieren und Sammeln von Items
  collision(map, TILE_SIZE, BLOCKED_TILES) {
    let b = {};
    // Berechnung Spielerposition (damit man der Tilenummer herausfinden kann)
    let spriteLeft   = Math.floor((this.posX + 2) / TILE_SIZE);
    let spriteDown   = Math.floor((this.posY + this.HEIGHT) / TILE_SIZE);
    let spriteRight  = Math.floor((this.posX + (this.WIDTH - 2)) / TILE_SIZE);
    let spriteUp     = Math.floor((this.posY + this.HEIGHT / 1.2) / TILE_SIZE);

    // Kollisionskontrolle zum blockieren von Tiles
    b.upLeft = BLOCKED_TILES.indexOf(map[spriteUp][spriteLeft]) >= 0;
    b.upRight = BLOCKED_TILES.indexOf(map[spriteUp][spriteRight]) >= 0;
    b.downLeft = BLOCKED_TILES.indexOf(map[spriteDown][spriteLeft]) >= 0;
    b.downRight = BLOCKED_TILES.indexOf(map[spriteDown][spriteRight]) >= 0;
    return b;
  }

  playerCollision(playerX, playerY) {
    // beim Kollision mit jedem Gegner, wird das Spiel beendet
    if(!this.game.player.playerDead && !this.enemyDead &&
      playerX > this.posX - 20  &&
      playerX < this.posX + 20 &&
      playerY > this.posY - 16  &&
      playerY < this.posY + 16
      ) {
      this.game.player.death("enemyCollision");
    }
  }

  death() {
      
    if(!this.enemyDead) {
      this.enemyDead = true;
      this.frame = 0;
      this.frameRate = 0.5;
      this.frameZahl = 3;
      if(this.controls.up) {
        this.animation = 1;
      } else if(this.controls.down) {
        this.animation = 0;
      } else if(this.controls.left) {
        this.animation = 2;
      } else if(this.controls.right) {
        this.animation = 3;
      }
      Object.keys(this.controls).forEach(i => this.controls[i] = false);
      //this.animation = 4;

      if(this.frame = 2) {
        setTimeout(() => {
          this.game.enemies.splice(this.game.enemies.indexOf(this), 1);
        }, 300);
      }
    }
  }
}