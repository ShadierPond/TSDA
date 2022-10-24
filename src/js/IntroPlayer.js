class IntroPlayer {
  game;
  spritesheet;
  width = 480;
  height = 270;
  interval = 0;
  animation = 9;
  frame = 0;
  frameZahl = 4;
  frameRate = 0.15;
  introRunning = false;
  keyHeld = false;
  isPaused = false;
  keyBlocked = false;
  controls = {
      next: false,
      skip: false
  };


  constructor(game) {
    this.game = game;
    this.spritesheet = document.getElementById("Intro");
    this.overlay = document.getElementById("intro-overlay");
    this.keyInputListener = this.handleControls.bind(this);
    addEventListener("keydown", this.keyInputListener);
    addEventListener("keyup", this.keyInputListener);

  }

    update(duration) {
        this.animate(duration);
        this.play();
    }

    play() {
      if(!this.game.isGameRunning && this.introRunning && !this.keyBlocked) {
        switch (this.animation) {
          case 9:
            this.frameZahl = 9;
            this.frameRate = 1.5;
            if(this.frame == this.frameZahl - 1) {
              this.isPaused = true;
            }
            break;
          case 8:
            this.frameZahl = 3;
            this.frameRate = 0.4;
            break;
          case 7:
            this.frameZahl = 10;
            this.frameRate = 1.5;
            if(this.frame == this.frameZahl - 1) {
              this.isPaused = true;
            }
            break;
          case 6:
            this.frameZahl = 3;
            this.frameRate = 0.4;
            break;
          case 5:
            this.frameZahl = 9;
            this.frameRate = 1.5;
            if(this.frame == this.frameZahl - 1) {
              this.isPaused = true;
            }
            break;
          case 4:
            this.frameZahl = 2;
            this.frameRate = 0.4;
            break;
          case 3:
            this.frameZahl = 9;
            this.frameRate = 1.5;
            if(this.frame == this.frameZahl - 1) {
              this.isPaused = true;
            }
            break;
          case 2:
            this.frameZahl = 9;
            this.frameRate = 1.5;
            if(this.frame == this.frameZahl - 1) {
              this.isPaused = true;
            }
            break;
          case 1:
            this.frameZahl = 7;
            this.frameRate = 0.4;
            break;
          case 0:
            this.frameZahl = 9;
            this.frameRate = 1.5;
            if(this.frame == this.frameZahl - 1) {
              this.isPaused = true;
            }
            break;
          default:
            break;
        }
        if(!this.keyHeld) {
          // mit dem drücken der Leertaste, wird die nächste Introsequenz abgespielt
          if (this.controls.next) {
            this.frame = 0;
            this.isPaused = false;
            this.keyHeld = true;
            this.keyBlocked = true;
            this.animation--;

            // Spiel wird starten wenn ausgewählte animation erreicht ist
            if(this.animation < 0) {
              removeEventListener("keydown", this.keyInputListener);
              removeEventListener("keyup", this.keyInputListener);
              this.introRunning = false;
              this.game.isGameRunning = true;
              this.game.startLevel();
            }
          }
          // wird während des Intros Q gedrückt, wird das Intro abgebrochen und das Spiel startet
          if(this.controls.skip) {
            removeEventListener("keydown", this.keyInputListener);
            removeEventListener("keyup", this.keyInputListener);
            this.introRunning = false;
            this.game.startLevel();
          }
        } else {
          this.keyHeld = false;
        }
      }
    }


    animate(duration) {
      if(!this.isPaused) {
        this.interval += duration;
        if (this.interval > this.frameRate) {
          this.interval = 0;
          this.frame = ++this.frame % this.frameZahl;
        }
      }
    }
    
      // Intro wird gezeichnet
      draw(context) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(
          this.spritesheet,
          this.frame * this.width,
          this.animation * this.height,
          this.width,
          this.height,
          0,
          0,
          this.width,
          this.height
        );
        context.drawImage(this.overlay, 0, 0);
      }

      handleControls(event) {
        if (event.type == "keyup") this.keyBlocked = false;
        switch (event.code) {
            case "Space":
            case "Enter":
                this.controls.next = event.type == "keydown";
                break;
            case "KeyQ":
                this.controls.skip = event.type == "keydown";
            default:
                break;
        }
      }
}