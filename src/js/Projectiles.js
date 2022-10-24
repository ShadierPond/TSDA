class Projectiles {
  width = 11;
  height = 11;
  posX = 0;
  posY = 0;
  bossDeathTime = 1000;
  speed = 300;
  interval = 0;
  animation = 0;
  frame = 0;
  frameRate = 0.2;
  id = undefined;
  direction = {};
  spritesheet = undefined;

  constructor(game, x, y, direction, id) {
    this.spritesheet = document.getElementById("projectile");
    this.game = game;
    this.id = id;
    this.direction = direction;
    if(direction.up && !direction.left && !direction.right) {
      this.posY = y - 16;
      this.posX = x + 8;
    }
    if(direction.down && !direction.left && !direction.right) {
      this.posY = y + 32;
      this.posX = x + 8;
    }
    if(direction.left && !direction.up && !direction.down) {
      this.posX = x - 16;
      this.posY = y + 16;
    }
    if(direction.right && !direction.up && !direction.down) {
      this.posX = x + 16;
      this.posY = y + 16;
    }
    if(direction.up && direction.left && !direction.right) {
      this.posY = y - 8;
      this.posX = x - 8;
    }
    if(direction.up && direction.right && !direction.left) {
      this.posY = y - 8;
      this.posX = x + 16;
    }
    if(direction.down && direction.left && !direction.right) {
      this.posY = y + 24;
      this.posX = x - 8;
    }
    if(direction.down && direction.right && !direction.left) {
      this.posY = y + 24;
      this.posX = x + 16;
    }
  }

  update(duration) {
    this.move(duration);
    this.animate(duration);
    this.enemyCollision();
    this.bossCollision();
  }

  move(duration) {
    let collide = this.collision(
      this.game.map.MAPS[this.game.level],
      this.game.map.TILE_SIZE,
      this.game.map.BLOCKED_TILES
    );
    if(this.direction.up){
      if(!collide.upLeft && !collide.upRight && !collide.downLeft && !collide.downRight || 
        !collide.upLeft && !collide.upRight && collide.downLeft && collide.downRight) {
        this.posY -= this.speed * duration;
        this.animation = 2;
      }
    }
    if(this.direction.down){
      if(!collide.downLeft && !collide.downRight && !collide.upLeft && !collide.upRight ||
        !collide.downLeft && !collide.downRight && collide.upLeft && collide.upRight) {
        this.posY += this.speed * duration;
        this.animation = 3;
      }
    }
    if(this.direction.left){
      if(!collide.upLeft && !collide.downLeft){
        this.posX -= this.speed * duration;
        this.animation = 1;
      }
    }
    if(this.direction.right){
      if(!collide.upRight && !collide.downRight){
        this.posX += this.speed * duration;
        this.animation = 0;
      }
    }
    if(collide.upLeft || collide.upRight || collide.downLeft || collide.downRight){
      this.game.projectiles.splice(this.game.projectiles.indexOf(this), 1);
    }
  }

  draw(context) {
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
  }

  animate(duration) {
    this.interval += duration;
    if (this.interval > this.frameRate) {
      this.interval = 0;
      this.frame = ++this.frame % 3;
    }
  }

  // Kollisionskontrolle für Tiles blockieren und Sammeln von Items
  collision(map, TILE_SIZE, BLOCKED_TILES) {
    let b = {};
    // Berechnung Spielerposition (damit man der Tilenummer herausfinden kann)
    let spriteLeft   = Math.floor(this.posX / TILE_SIZE);
    let spriteRight  = Math.floor((this.posX + this.width) / TILE_SIZE);
    let spriteDown   = Math.floor((this.posY + this.height) / TILE_SIZE);
    let spriteUp     = Math.floor((this.posY + this.height) / TILE_SIZE);

    // Kollisionskontrolle zum blockieren von Tiles
    b.upLeft = BLOCKED_TILES.indexOf(map[spriteUp][spriteLeft]) >= 0;
    b.upRight = BLOCKED_TILES.indexOf(map[spriteUp][spriteRight]) >= 0;
    b.downLeft = BLOCKED_TILES.indexOf(map[spriteDown][spriteLeft]) >= 0;
    b.downRight = BLOCKED_TILES.indexOf(map[spriteDown][spriteRight]) >= 0;
    return b;
  }
  
  enemyId(element) {
    return element.id;
  }

  enemyCollision() {
    for (let i = this.game.enemies.length - 1; i >= 0; i--) {
      if(this.enemyShot == true) {
        if(this.posX > this.game.enemies[i].posX -32 && this.posX < this.game.enemies[i].posX + 32 && this.posY > this.game.enemies[i].posY -10 && this.posY < this.game.enemies[i].posY +16) {
          this.enemyShot = false;

          let arrayPos = this.game.enemies.indexOf(this.game.enemies[i]);
          this.game.enemies[arrayPos].death();
          this.game.projectiles.splice(this.game.projectiles.indexOf(this), 1);
        }
      } else {
        this.enemyShot = true;
      }
    }
  }

  // Kollisionskontrolle für Boss
  bossCollision() {
    for (let i = this.game.boss.length - 1; i >= 0; i--) {
      if(this.bossShot == true) {
        // löst das 0 hp problem beim boss
        let tempHealth = this.game.boss[i].health - 1;
        if(this.posX > this.game.boss[i].posX && this.posX < this.game.boss[i].posX + 32 && this.posY > this.game.boss[i].posY && this.posY < this.game.boss[i].posY +32) {
          this.bossShot = false;
          this.game.boss[i].isShot = true;
          if(tempHealth == 0) {
            //let arrayPos = this.game.enemies.indexOf(this.game.boss[i]);
            this.game.boss[i].health--;
            this.game.boss[i].death();
            this.game.projectiles.splice(this.game.projectiles.indexOf(this), 1);
          } else {
            this.game.boss[i].health--;
            tempHealth--
            this.game.projectiles.splice(this.game.projectiles.indexOf(this), 1);
          }
        }
      } else {
        this.bossShot = true;
      }
    }
  }
}
