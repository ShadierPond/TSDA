class BossProjectiles {
    width = 11;
    height = 11;
    posX = 0;
    posY = 0;
    speed = 125;
    shootInterval = 0.2;
    interval = 0;
    animation = 0;
    frame = 0;
    frameRate = 0.2;
    id = undefined;
    direction = {};
    spritesheet = undefined;
    distance = 0;
    alpha = 0;
    playerX = 0;
    playerY = 0;
    angle = 0;
    radiant = 0 ;
    versatzX = 0;
    versatzY = 0;

    constructor(game, x, y, direction, id) {
        this.spritesheet = document.getElementById("projectile");
        this.game = game;
        this.id = id;
        this.playerX = this.game.player.posX;
        this.playerY = this.game.player.posY;
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
        let dX = this.posX - (this.game.player.posX + (this.game.player.WIDTH / 2));
        let dY = this.posY - (this.game.player.posY + (this.game.player.HEIGHT / 2));
        this.radiant = Math.atan(dY / dX) + (Math.PI / 2);
        // wenn Spieler links, dann die hälfte der kreis versetzen nach links
        if(dX > 0) {
        this.versatzX = Math.cos(this.radiant + (Math.PI/2));
        this.versatzY = Math.sin(this.radiant + (Math.PI/2));
        }
        // wenn Spieler rechts, dann die hälfte der kreis versetzen nach rechts
        if(dX < 0) {
            this.versatzX = Math.cos(this.radiant - (Math.PI/2));
            this.versatzY = Math.sin(this.radiant - (Math.PI/2));
        }
    }

    update(duration) {
        this.move(duration);
        this.animate(duration);
        this.playerCollision();
    }

    move(duration) {
        let collide = this.collision(
            this.game.map.MAPS[this.game.level],
            this.game.map.TILE_SIZE,
            this.game.map.BLOCKED_TILES
        );

        this.posX += this.versatzX * this.speed * duration;
        this.posY += this.versatzY * this.speed * duration;

        if(collide.upLeft || collide.upRight || collide.downLeft || collide.downRight){
            this.game.bossProjectiles.splice(this.game.bossProjectiles.indexOf(this), 1);
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

    playerCollision() {
        // Wenn die Projektile den Spieler treffen, stirbt er bzw. das Spiel wird beendet 
        if(!this.game.player.playerDead &&
          this.posX > this.game.player.posX &&
          this.posX < this.game.player.posX + this.game.player.WIDTH &&
          this.posY > this.game.player.posY  &&
          this.posY < this.game.player.posY + (this.game.player.HEIGHT / 2)
          ) {
          this.game.player.death("projectileCollision");
        }
      }
}