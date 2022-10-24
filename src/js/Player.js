class Player {
  // Eigenschaften eines Spielers:
  game;
  spritesheet;
  spotlight;
  posX;
  posY;

  // Konstanten
  WIDTH = 32;
  HEIGHT = 32;
  SPEED = 100;
  DIAGONAL_SPEED_MODIFIER = 0.8; // Geschwindigkeitskontrolle beim diagonal laufen
  
  // Stats des Spielers
  oxygen = 10;
  overheat = 0;
  platesActivated = 0;

  // Eigenschaften für Animation
  interval = 0;
  animation = 6;
  frame = 0;
  frameZahl = 4;
  frameRate = 0.2;

  //
  spriteLeft = 0;
  spriteRight = 0;
  spriteUp = 0;
  spriteDown = 0;

  keyBlocked = false; // Flag um unendliches Schießen zu verhindern
  playerDead = false;
  reason = "";

  // Objekt für Steuerung
  controls = {
    up: false,
    down: false,
    left: false,
    right: false,
    action: false,
    shoot: false,
  };
  direction = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  // Konstruktor-Methode wird bei Erzeugung ausgeführt:
  constructor(game, x, y) {
    this.game = game; // Spielklasse wird in die Eigenschaft game geschrieben
    this.posX = x; // Startposition wird gesetzt
    this.posY = y; // Startposition wird gesetzt
    this.spritesheet = document.getElementById("player"); // Spritesheet wird geladen
    this.shadow = document.getElementById("shadow"); // Grafik für Schatten wird geladen
    this.spotlight = document.getElementById("spotlight"); // Zugriff auf Spotlight um Spieler herum

    this.keyInputListener = this.handleControls.bind(this) // notwendig um in Eventlistener zugriff auf Eigenschaften zu haben
    addEventListener("keydown", this.keyInputListener);  // Tastatur-Ereignisse werden abgefangen
    addEventListener("keyup", this.keyInputListener);
  }

  // Position der Spieler wird gesetzt
  setPos(x, y) {
    this.posX = x;
    this.posY = y;
  }

  // Sauerstoff wird abgezogen bis es keine mehr gibt, dann wird das Spiel beendet
  decreaseOxygen(amount = 1) {
    if (this.oxygen - amount > 0) {
      this.oxygen = this.oxygen - amount;
    } else {
      this.death("suffocated");
    }
  }

  // Methode wird unendlich abgerufen.
  update(duration) {
    this.animate(duration);
    this.move(duration);
    
    this.checkInteractionWithTile();
  }

  // Spieler wird bewegt
  move(duration) {
    // Kollision wird gefragt (ob es irgendwo kollision gibt)
    let collide = this.collision(
      this.game.map.MAPS[this.game.level],
      this.game.map.TILE_SIZE,
      this.game.map.BLOCKED_TILES
    );

    // Wenn oben gedrückt wird, dann nach oben bewegen (auch wennn seitlich blockiert wird) und richtung auf oben setzen
    if (this.controls.up && !this.controls.down && !this.controls.left && !this.controls.right) {
      if (
        (collide.upLeft && collide.downLeft && !collide.upRight) ||
        (collide.upRight && collide.downRight && !collide.upLeft) ||
        (!collide.upLeft && !collide.upRight)
      )
        this.posY -= duration * this.SPEED;
        this.direction = {
          up: true,
          down: false,
          left: false,
          right: false,
        };
    }
    // Wenn unten gedrückt wird, dann nach unten bewegen (auch wennn seitlich blockiert wird) und richtung auf unten setzen
    if (this.controls.down && !this.controls.up && !this.controls.left && !this.controls.right) {
      if (
        (collide.upLeft && collide.downLeft && !collide.downRight) ||
        (collide.upRight && collide.downRight && !collide.downLeft) ||
        (!collide.downRight && !collide.downLeft)
      )
        this.posY += this.SPEED * duration;
        this.direction = {
          up: false,
          down: true,
          left: false,
          right: false,
        };
    }
    // Wenn links gedrückt wird, dann nach links bewegen (auch wennn von oben oder unten blockiert wird) und richtung auf links setzen
    if (this.controls.left && !this.controls.right && !this.controls.up && !this.controls.down) {
      if (
        (collide.upLeft && collide.upRight && !collide.downLeft) ||
        (collide.downLeft && collide.downRight && !collide.upLeft) ||
        (!collide.upLeft && !collide.downLeft)
      )
        this.posX -= this.SPEED * duration;
        this.direction = {
          up: false,
          down: false,
          left: true,
          right: false,
        };
    }
    // Wenn rechts gedrückt wird, dann nach rechts bewegen (auch wennn von oben oder unten blockiert wird) und richtung auf rechts setzen
    if (this.controls.right && !this.controls.left && !this.controls.up && !this.controls.down) {
      if (
        (collide.upLeft && collide.upRight && !collide.downRight) ||
        (collide.downLeft && collide.downRight && !collide.upRight) ||
        (!collide.upRight && !collide.downRight)
      )
        this.posX += this.SPEED * duration;
        this.direction = {
          up: false,
          down: false,
          left: false,
          right: true,
        };
    }

    // DEBUG OBEN, OBEN RECHTS, OBEN LINKS ------------------------------------------------------------------------------------------------------------------
    // Kollision mit oberen, linken Wand------------------------------------------------------
    if (this.controls.up && this.controls.left && !this.controls.right && !this.controls.down) {
      // damit kann der Spieler oben links (diagonal) laufen wenn es keine kollision vor ihm gibt
      if (
        (!collide.upRight && !collide.upLeft) ||
        (collide.upRight && collide.downRight && !collide.upLeft && !collide.downLeft) ||
        (!collide.upLeft && collide.downLeft && collide.upRight && collide.downRight)
      ) {
        this.posX -= this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.posY -= this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.direction = {
          up: true,
          down: false,
          left: true,
          right: false,
        };
      }
      // debug für oberen wand
      if (
        (collide.upLeft && collide.upRight && !collide.downLeft && !collide.downRight) ||
        (!collide.upLeft && collide.upRight && !collide.downLeft && !collide.downRight)
      ) {
        this.posX -= this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.direction = {
          up: false,
          down: false,
          left: true,
          right: false,
        };
      }
      // debug für linken wand (oben links)
      if (
        (collide.upLeft && collide.downLeft && !collide.upRight && !collide.downRight) ||
        (!collide.upLeft && collide.downLeft && !collide.upRight && !collide.downRight)
      ) {
        this.posY -= this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.direction = {
          up: true,
          down: false,
          left: false,
          right: false,
        };
      }
    }
    // Kollision mit oberen, rechten Wand------------------------------------------------------
    if (this.controls.up && this.controls.right && !this.controls.left && !this.controls.down) {
      // damit kann der Spieler oben rechts (diagonal) laufen wenn es keine kollision vor ihm gibt
      if (
        (!collide.upLeft && !collide.upRight) ||
        (collide.upLeft && !collide.upRight && collide.downLeft && !collide.downRight) ||
        (collide.upLeft && collide.downLeft && !collide.upRight && collide.downRight)
      ) {
        this.posX += this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.posY -= this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.direction = {
          up: true,
          down: false,
          left: false,
          right: true,
        };
      }
      // debug für wenn man oben rechts gleichzwitig läuft
      if (
        (collide.upLeft && collide.upRight && !collide.downLeft && !collide.downRight) ||
        (collide.upLeft && !collide.upRight && !collide.downLeft && !collide.downRight)
      ) {
        this.posX += this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.direction = {
          up: false,
          down: false,
          left: false,
          right: true,
        };
      }

      // debug für rechten wand (oben rechts)
      if (
        (collide.upRight && collide.downRight && !collide.upLeft && !collide.downLeft) ||
        (!collide.upRight && collide.downRight && !collide.upLeft && !collide.downLeft)
      ) {
        this.posY -= this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.direction = {
          up: true,
          down: false,
          left: false,
          right: false,
        };
      }
    }
    // -----------------------------------------------------------------------------------------------------------------------------

    // DEBUG UNTEN, UNTEN RECHTS, UNTEN LINKS ------------------------------------------------------------------------------------------------------------------
    // Kollision mit unteren, linken Wand---------------------------------------------------------------
    if (this.controls.down && this.controls.left && !this.controls.right && !this.controls.up) {
      // damit kann der Spieler unten links (diagonal) laufen wenn es keine kollision vor ihm gibt
      if (
        (!collide.downLeft && !collide.downRight) ||
        (!collide.downLeft && collide.upLeft && collide.downRight && collide.upRight) ||
        (collide.upRight && collide.downRight && !collide.upLeft && !collide.downLeft)
      ) {
        this.posX -= this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.posY += this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.direction = {
          up: false,
          down: true,
          left: true,
          right: false,
        };
      }
      // debug für wenn man unten links gleighzeitig läuft
      if (
        (collide.downLeft && collide.downRight && !collide.upLeft && !collide.upRight) ||
        (!collide.downLeft && collide.downRight && !collide.upLeft && !collide.upRight)
      ) {
        this.posX -= this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.direction = {
          up: false,
          down: false,
          left: true,
          right: false,
        };
      }
      // debug für linken wand (unten links)
      if (
        (collide.downLeft && collide.upLeft && !collide.upRight && !collide.downRight) ||
        (!collide.downLeft && collide.upLeft && !collide.upRight && !collide.downRight)
      ) {
        this.posY += this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.direction = {
          up: false,
          down: true,
          left: false,
          right: false,
        };
      }
    }
    // Kollision mit unteren, rechten Wand---------------------------------------------------------------
    if (this.controls.down && this.controls.right && !this.controls.left) {
      // damit kann der Spieler unten rechts (diagonal) laufen wenn es keine kollision vor ihm gibt
      if (
        (!collide.downRight && !collide.downLeft) ||
        (!collide.downRight && collide.upRight && collide.downLeft && collide.upLeft) ||
        (collide.upLeft && collide.downLeft && !collide.upRight && !collide.downRight)
      ) {
        this.posX += this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.posY += this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.direction = {
          up: false,
          down: true,
          left: false,
          right: true,
        };
      }
      // debug für wenn man unten rechts gleighzeitig läuft
      if (
        (collide.downLeft && collide.downRight && !collide.upLeft && !collide.upRight) ||
        (collide.downLeft && !collide.downRight && !collide.upLeft && !collide.upRight)
      ) {
        this.posX += this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.direction = {
          up: false,
          down: false,
          left: false,
          right: true,
        };
      }
      // debug für rechten wand (unten rechts)
      if (
        (collide.upRight && collide.downRight && !collide.upLeft && !collide.downLeft) ||
        (collide.upRight && !collide.downRight && !collide.upLeft && !collide.downLeft)
      ) {
        this.posY += this.SPEED * this.DIAGONAL_SPEED_MODIFIER * duration;
        this.direction = {
          up: false,
          down: true,
          left: false,
          right: false,
        };
      }
    }
    // Schießen
    if (this.controls.shoot && !this.keyBlocked && this.game.isGameRunning && this.overheat < 5) {
      this.overheat++;
      // Reset overheat cooldown
      this.game.hud.overheatLastTime = performance.now();
      this.keyBlocked = true;
      this.game.soundPlayer.play("shoot");
      this.game.projectiles.push(
        new Projectiles(
          this.game,
          this.posX,
          this.posY,
          this.direction,
          this.game.projectiles.length
        )
      );
    }
  }
    // -----------------------------------------------------------------------------------------------------------------------------


  // Spieler wird animiert
  animate(duration) {
    this.interval += duration;
    if (this.interval > this.frameRate) {
      this.interval = 0;
      this.frame = ++this.frame % this.frameZahl;
  } else {
    if(!this.playerDead){
      if (this.direction.up     && !this.direction.left && !this.direction.right) this.animation = 3;
      if (this.direction.down   && !this.direction.left && !this.direction.right) this.animation = 0;
      if (this.direction.left   && !this.direction.up   && !this.direction.down)  this.animation = 1;
      if (this.direction.right  && !this.direction.up   && !this.direction.down)  this.animation = 2;
      if (this.direction.up     && this.direction.right)  this.animation = 2;
      if (this.direction.down   && this.direction.right)  this.animation = 2;
      if (this.direction.up     && this.direction.left)   this.animation = 1;
      if (this.direction.down   && this.direction.left)   this.animation = 1;
      if (!this.controls.up && !this.controls.down && !this.controls.left && !this.controls.right && this.direction.down)   this.animation = 6;
      if (!this.controls.up && !this.controls.down && !this.controls.left && !this.controls.right && this.direction.up)     this.animation = 5;
      if (!this.controls.up && !this.controls.down && !this.controls.left && !this.controls.right && this.direction.left)   this.animation = 7;
      if (!this.controls.up && !this.controls.down && !this.controls.left && !this.controls.right && this.direction.right)  this.animation = 8;
      if (this.controls.shoot && this.overheat < 5) {
        if(this.direction.up) this.animation = 9;
        if(this.direction.left) this.animation = 11;
        if(this.direction.right) this.animation = 12;
        if(this.direction.down) this.animation = 10;
        return;
      }
    }
  }
    if(this.playerDead){
      if(this.frame == 3) {
        setTimeout(() => {
        this.game.stopLevel(this.reason);
        }, 300);
      }
    }
  }

  // Spieler wird gezeichnet
  draw(context) {
    let canvasX = context.canvas.width / 2 - this.WIDTH / 2;
    let canvasY = context.canvas.height / 2 - this.HEIGHT / 2;    
    context.imageSmoothingEnabled = false; // Spieler wird bei bewegung nicht unscharf

    context.drawImage(
      this.shadow,
      0,
      0,
      this.WIDTH,
      this.HEIGHT,
      canvasX,
      canvasY + 2,
      this.WIDTH,
      this.HEIGHT
    );
    context.drawImage(
      this.spritesheet,
      this.frame * this.WIDTH,
      this.animation * this.HEIGHT,
      this.WIDTH,
      this.HEIGHT,
      canvasX,
      canvasY,
      this.WIDTH,
      this.HEIGHT
    );

    //spotlight zeichnen
    context.globalCompositeOperation = "multiply";
    context.drawImage(this.spotlight, 0, 0, context.canvas.width, context.canvas.height);
    context.globalCompositeOperation = "source-over";
  }

  // Spieler Controls
  handleControls(event) {
    if (!this.controls.shoot) this.keyBlocked = false;

    switch (event.code) {
      case "KeyA":
      case "ArrowLeft":
        this.controls.left = event.type == "keydown";
        break;
      case "KeyD":
      case "ArrowRight":
        this.controls.right = event.type == "keydown";
        break;
      case "KeyW":
      case "ArrowUp":
        this.controls.up = event.type == "keydown";
        break;
      case "KeyS":
      case "ArrowDown":
        this.controls.down = event.type == "keydown";
        break;
      case "Space":
        this.controls.shoot = event.type == "keydown";
        break;
      case "KeyE":
        this.controls.action = event.type == "keydown";
        break;
      default:
        break;
    }
  }

  // Kollisionskontrolle für Tiles blockieren und Sammeln von Items
  collision(map, TILE_SIZE, BLOCKED_TILES) {
    let b = {};
    // Berechnung Spielerposition (damit man der Tilenummer herausfinden kann)
    this.spriteUp = Math.floor((this.posY + this.HEIGHT / 1.5) / TILE_SIZE);
    this.spriteDown = Math.floor((this.posY + this.HEIGHT) / TILE_SIZE);
    this.spriteLeft = Math.floor((this.posX + 2) / TILE_SIZE);
    this.spriteRight = Math.floor((this.posX + (this.WIDTH - 2)) / TILE_SIZE);

    // Kollisionskontrolle zum blockieren von Tiles
    b.upLeft = BLOCKED_TILES.indexOf(map[this.spriteUp][this.spriteLeft]) >= 0;
    b.upRight = BLOCKED_TILES.indexOf(map[this.spriteUp][this.spriteRight]) >= 0;
    b.downLeft = BLOCKED_TILES.indexOf(map[this.spriteDown][this.spriteLeft]) >= 0;
    b.downRight = BLOCKED_TILES.indexOf(map[this.spriteDown][this.spriteRight]) >= 0;

    // Tiles, die der Spieler berührt, wird ausgeschrieben
    b.tileUpLeft = Math.floor(map[this.spriteUp][this.spriteLeft]);
    b.tileUpRight = Math.floor(map[this.spriteUp][this.spriteRight]);
    b.tileDownLeft = Math.floor(map[this.spriteDown][this.spriteLeft]);
    b.tileDownRight = Math.floor(map[this.spriteDown][this.spriteRight]);

    return b;
  }

  // MEthode, die alle tilenummern untersucht, wo der spieler steht. UNLIMITERTE MÖGLIHKEITEN DAMIT!!!
  checkInteractionWithTile() {
    // Kollisionwerte werden in collectable gespeichert
    let collectable = this.collision(
      this.game.map.MAPS[this.game.level],
      this.game.map.TILE_SIZE,
      this.game.map.BLOCKED_TILES
    );
    // untersuchen, ob collectable das Wert beinhaltet, falls ja, wird der unterprogramm ausgeführt
    // sauerstoff
    if (Object.values(collectable).includes(35)) {
      this.game.soundPlayer.play("oxygen");
      this.replaceTile(collectable, 35, 0);
      this.game.hud.lastTime = performance.now();

      if (this.oxygen + 2 < 10) {
        this.oxygen += 2;
      } else {
        this.oxygen = 10;
      }
    }

    // licht
    if (Object.values(collectable).includes(48)) {
      this.game.soundPlayer.play("light");
      this.replaceTile(collectable, 48, 49);
      this.spotlight.src = "./src/img/spotlight_lg.png";
      setTimeout(() => {
        this.spotlight.src = "./src/img/spotlight_sm.png";
      }, 5000);
    }

    // terminal aktivieren
    if (Object.values(collectable).includes(24) && this.controls.action) {
      this.game.soundPlayer.play("terminal");
      this.replaceTile(collectable, 24, 25);
      this.game.map.replaceAllTilesOfType(34, 32, this.game.level);
      this.game.hud.startBombTimer(this.game.map.MAP_TIMERS[this.game.level]);
    }

    // druckplatte betreten
    if (Object.values(collectable).includes(32)) {
      this.game.soundPlayer.play("plate");
      this.replaceTile(collectable, 32, 33);
      if (this.platesActivated < this.game.map.plateCount) this.platesActivated++;
      // alle druckplatten aktiviert
      if (this.platesActivated == this.game.map.plateCount) {
        this.game.soundPlayer.play("door");
        this.game.map.replaceTileAtPos(
          this.game.map.endPos.row,
          this.game.map.endPos.col,
          23,
          this.game.level
        );
      }
    }

    // ziel
    if (Object.values(collectable).includes(23)) {
      if (this.spriteUp == this.game.map.endPos.row) {
        if (
          this.spriteLeft == this.game.map.endPos.col ||
          this.spriteRight == this.game.map.endPos.col
        ) this.game.stopLevel("levelDone"); // ausgang betreten
      }
    }
  }

  replaceTile(collectable, oldTileIndex, newTileIndex) {
    if (collectable.tileUpLeft == oldTileIndex)
      this.game.map.MAPS[this.game.level][this.spriteUp][this.spriteLeft] = newTileIndex;
    if (collectable.tileUpRight == oldTileIndex)
      this.game.map.MAPS[this.game.level][this.spriteUp][this.spriteRight] = newTileIndex;
    if (collectable.tileDownLeft == oldTileIndex)
      this.game.map.MAPS[this.game.level][this.spriteDown][this.spriteLeft] = newTileIndex;
    if (collectable.tileDownRight == oldTileIndex)
      this.game.map.MAPS[this.game.level][this.spriteDown][this.spriteRight] = newTileIndex;
  }

  death(reason) {
    this.reason = reason;
    this.playerDead = true;
    this.frame = 0;
    this.frameRate = 0.3;
    this.animation = 4;
    Object.keys(this.controls).forEach(i => this.controls[i] = false);
    removeEventListener("keydown", this.keyInputListener);  // Tastatur-Ereignisse werden abgefangen
    removeEventListener("keyup", this.keyInputListener);

  }
}
