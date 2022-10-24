class SoundPlayer {
  constructor() {
    this.terminal = new Audio("./src/audio/terminal.mp3");
    this.plate = new Audio("./src/audio/plate.mp3");
    this.light = new Audio("./src/audio/light.mp3");
    this.oxygen = new Audio("./src/audio/oxygen.mp3");
    this.door = new Audio("./src/audio/door.mp3");
    this.leveldone = new Audio("./src/audio/leveldone.mp3");
    this.gameover = new Audio("./src/audio/gameover.mp3");
    this.shoot = new Audio("./src/audio/shoot.mp3");
  }

  play(sound) {
    switch (sound) {
      case "terminal":
        this.terminal.currentTime = 0;
        this.terminal.play();
        break;
      case "plate":
        this.plate.currentTime = 0;
        this.plate.play();
        break;
      case "light":
        this.light.currentTime = 0;
        this.light.play();
        break;
      case "oxygen":
        this.oxygen.currentTime = 0;
        this.oxygen.play();
        break;
      case "door":
        this.door.currentTime = 0;
        this.door.play();
        break;
      case "leveldone":
        this.leveldone.currentTime = 0;
        this.leveldone.play();
        break;
      case "gameover":
        this.gameover.currentTime = 0;
        this.gameover.play();
        break;
      case "shoot":
        this.shoot.currentTime = 0;
        this.shoot.volume = 0.1;
        this.shoot.play();
        break;

      default:
        break;
    }
  }
}
