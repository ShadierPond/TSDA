class Hud {
  game;
  player;
  map;
  // Sauerstoffanzeige des Spielers
  oxygenBar;
  oxygenBarW = 72;
  oxygenBarH = 22;
  oxygenLastTime; // Timestamp für Oxygen Timer
  // Hitzeanzeige der Waffe des Spielers
  overheatBar;
  overheatBarW = 72;
  overheatBarH = 22;
  overheatLastTime;
  
  // Zeiterfassung nach dem aktivieren des Generators
  bombTimer;
  bombTime;
  

  constructor(game, player, map) {
    this.game = game;
    this.player = player;
    this.map = map;
    this.oxygenBar = document.getElementById("oxygenBar");
    this.bomb = document.getElementById("bomb");
    this.overheatBar = document.getElementById('overheatbar')
  }

  startBombTimer(seconds) {
    this.bombTimer = performance.now() + seconds * 1000;
  }

  update() {
    let now = performance.now();

    if (this.oxygenLastTime === undefined) this.oxygenLastTime = now;
    this.diff = (now - this.oxygenLastTime) / (5 * 1000);
    if (this.diff > 1) {
      this.player.decreaseOxygen();
      this.diff = 0;
      this.oxygenLastTime = now;
    }

    if (this.overheatLastTime === undefined) this.overheatLastTime = now;
    this.overheatDiff = (now - this.overheatLastTime) / (2 * 1000);
    if (this.overheatDiff > 1) {
      this.player.overheat > 0 && this.player.overheat--;
      this.overheatDiff = 0;
      this.overheatLastTime = now;
    }

    if (this.bombTimer) {
      let timeLeft = this.bombTimer - now;
      this.bombTime = (timeLeft / 1000).toFixed(2);
      if (this.bombTime <= 0) {
        this.bombTime = 0;
        this.bombTimer = undefined;
        this.game.stopLevel("bombExploded")
      }
    }
  }
    

  draw(context) {
    context.drawImage(
      this.oxygenBar,
      0,
      this.player.oxygen * this.oxygenBarH - this.oxygenBarH,
      this.oxygenBarW,
      this.oxygenBarH,
      10,
      10,
      this.oxygenBarW,
      this.oxygenBarH
    );

    context.drawImage(
      this.overheatBar,
      0,
      (this.player.overheat + 1) * this.overheatBarH - this.overheatBarH,
      this.overheatBarW,
      this.overheatBarH,
      this.game.canvas.width - 80,
      this.game.canvas.height - 30,
      this.overheatBarW,
      this.overheatBarH,
    )

    context.textBaseline = "top";
    context.font = "8px Dogica";
    context.fillStyle = "#ffffff";
    // context.fillText(this.diff, 10, 80);

    if (this.bombTimer) {
      context.drawImage(this.bomb, 10, this.game.canvas.height - 21);

      context.save();
      if(this.bombTime < 10) context.fillStyle = "#d95757";
      context.fillText(this.bombTime + "s", 41, this.game.canvas.height - 20);
      context.restore();
    }

    if (this.player.controls.action) {
      context.fillStyle = "#349beb";
      context.fillText("E", 10, 70);
    }

    context.save();
    context.fillStyle = "#28a880";
    context.fillText(this.player.platesActivated + "/" + this.map.plateCount, 10, 40);
    context.restore();

    context.fillStyle = "#454545";
    context.fillText("Level " + (this.game.level + 1) + "/" + this.map.MAPS.length, this.game.canvas.width - 65, 10);
  }
}
