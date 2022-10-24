class Game {
  isFullScreen;
  map;
  player;
  hud;
  soundPlayer;
  canvas;
  context;
  level = 0;
  isGameRunning = false;
  projectiles = [];
  bossProjectiles = [];
  enemies = [];
  boss = [];
  introPlayer;

  constructor(isFullScreen) {
    this.isFullscreen = isFullScreen;
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.canvas.id = "mainCanvas";
    document.getElementById("screen").appendChild(this.canvas);
    this.soundPlayer = new SoundPlayer();
    this.introPlayer = new IntroPlayer(this);
    this.menu = new Menu(this);
  }

  startLevel(level = this.level) {
    this.enemies = [];
    this.projectiles = [];
    this.bossProjectiles = [];
    this.boss = [];
    this.map = new Map(level);
    let start = this.map.getPlayerStartPos();
    this.player = new Player(this, start.x, start.y);
    this.hud = new Hud(this, this.player, this.map);

    let enemyPositions = this.map.getEnemyPositions();
    enemyPositions.forEach((pos) => {
      this.enemies.push(new Enemy(this, pos.x, pos.y, this.enemies.length));
    });

    let bossPositions = this.map.getBossPositions();
    bossPositions.forEach((pos) => {
      this.boss.push(new Boss(this, pos.x, pos.y, this.player.posX, this.player.posY));
    });

    this.isGameRunning = true;
  }

  // Methode um Level zu beenden mit Angabe von einem Grund
  // daraufhin wird entschieden welcher Screen angezeigt wird
  // später können verschiedene Screens abhängig von dem Grund
  // angezeigt werden
  stopLevel(reason) {
    removeEventListener("keydown", this.player.keyInputListener)
    removeEventListener("keyup", this.player.keyInputListener)
    if(reason == "enemyCollision" || reason == "bombExploded" || reason == "suffocated" || reason == "projectileCollision") {
      this.isGameRunning = false;
      this.soundPlayer.play("gameover");
      this.menu.showGameOverScreen()
    }
    else if(reason == "levelDone") {
      this.soundPlayer.play("leveldone");
      this.isGameRunning = false;

      if(this.level + 1 == this.map.MAPS.length) {
        this.menu.showGameDoneScreen()
      }
      else {
        this.menu.showLevelDoneScreen()
      }
    }
  }

  // Methode um level zu erhöhen und das nächste Level zu starten
  nextLevel() {
    this.level++;
    this.startLevel();
  }

  update(duration) {
    if (!this.isGameRunning && this.introPlayer.introRunning) this.introPlayer.update(duration);
    if (this.isGameRunning) {
      // Aktualisieren Methode für alle Spielelemente aufrufen
      this.player.update(duration);
      this.enemies.forEach(enemy => {
        enemy.update(duration, this.player.posX, this.player.posY)
      })
      this.projectiles.forEach(projectile => {
        projectile.update(duration)
      });
      this.bossProjectiles.forEach(projectile => {
        projectile.update(duration)
      });
      this.boss.forEach(boss => {
        boss.update(duration, this.player.posX, this.player.posY)
      })

      // Methode aufrufen, die Bereich der Map um Spieler zeichnet
      this.map.renderMapInViewport(
        this.level,
        this.player.posX,
        this.player.posY,
        this.player.WIDTH,
        this.player.HEIGHT
      );
      this.hud.update();
    }
  }

  draw() {
    if (!this.isGameRunning && !this.introPlayer.introRunning) this.menu.draw(this.context); // Wenn Spiel und Introplayer nicht laufen wird Menü gezeigt
    if (this.introPlayer.introRunning) this.introPlayer.draw(this.context);

    if (this.isGameRunning) { // Wenn Spiel läuft alle notwendigen Elemente zeichnen
      // Spielelemente auf Map Canvas zeichnen
      this.enemies.forEach((enemy) => {
        enemy.draw(this.map.context);
      });
      this.boss.forEach((boss) => {
        boss.draw(this.map.context);
      });
      this.projectiles.forEach((projectile) => {
        projectile.draw(this.map.context);
      });
      this.bossProjectiles.forEach((projectile) => {
        projectile.draw(this.map.context);
      });

      // Teil der Map abhängig von Spielerposition auf Hauptcanvas zeichnen
      this.map.draw(
        this.context,
        this.player.posX,
        this.player.posY,
        this.player.WIDTH,
        this.player.HEIGHT
      );

      this.player.draw(this.context); // Spieler auf Hauptcanvas zeichnen
      this.hud.draw(this.context); // HUD auf Hauptcanvas zeichnen
    }
  }
}
