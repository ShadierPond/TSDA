class Menu {
  selected = 1;
  screen = "welcome";
  game;

  constructor(game) {
    this.game             = game;
    this.menuWelcome      = document.getElementById("menuWelcome");
    this.menuStory        = document.getElementById("menuStory");
    this.arrow            = document.getElementById("menuArrow");
    this.screenLeveldone  = document.getElementById("leveldone");
    this.menuHelp         = document.getElementById("menuHelp");
    this.screenGameover   = document.getElementById("gameover");
    this.screenGamedone   = document.getElementById("gamedone");

    this.keyDownListener  = this.handleKeypress.bind(this);
    window.addEventListener("keydown", this.keyDownListener);
    this.mouseMoveListener = this.handleMouseMove.bind(this)
    this.game.canvas.addEventListener("mousemove", this.mouseMoveListener);
    this.clickListener = this.handleMenuClick.bind(this)
    this.game.canvas.addEventListener("click", this.clickListener)
  }

  draw(context) {
    if (this.screen == "welcome") {
      context.drawImage(this.menuWelcome, 0, 0);
      if (this.selected == 1) context.drawImage(this.arrow, 180, 123);
      if (this.selected == 2) context.drawImage(this.arrow, 180, 156);
      if (this.selected == 3) context.drawImage(this.arrow, 180, 189);
    }
    if (this.screen == "help") context.drawImage(this.menuHelp, 0, 0);
    if (this.screen == "story") context.drawImage(this.menuStory, 0, 0);
    if (this.screen == "leveldone") context.drawImage(this.screenLeveldone, 0, 0);
    if (this.screen == "gamedone") context.drawImage(this.screenGamedone, 0, 0);
    if (this.screen == "gameover") context.drawImage(this.screenGameover, 0, 0);
  }

  showGameOverScreen() {
    this.screen = "gameover";
    window.addEventListener("keydown", function gameOverListener(event) {
      if ((event.code == "Space") || (event.code == "Enter")) {
        this.removeEventListener("keydown", gameOverListener);
        this.game.startLevel();
      }
    });
  }

  showGameDoneScreen() {
    this.screen = "gamedone";
    this.gameDoneKeyHandler = this.handleGameDoneInput.bind(this)
    window.addEventListener("keydown", this.gameDoneKeyHandler)
  }

  showLevelDoneScreen() {
    this.screen = "leveldone";
    window.addEventListener("keydown", function levelDoneListener(event) {
      if ((event.code == "Space") || (event.code == "Enter")) {
        this.removeEventListener("keydown", levelDoneListener);
        this.game.nextLevel();
      }
    });
  }

  confirmSelection() {
    if (this.screen == "welcome" && this.selected == 1) {
      this.game.level = 0;
      this.game.introPlayer = new IntroPlayer(this.game);
      this.game.introPlayer.introRunning = true;
      this.game.introPlayer.play();
      //this.game.startLevel();
      removeEventListener("keydown", this.keyDownListener);
      this.game.canvas.removeEventListener("mousemove", this.mouseMoveListener);
      this.game.canvas.removeEventListener("click", this.clickListener);

    }
    if (this.screen == "welcome" && this.selected == 2) this.screen = "help";
    if (this.screen == "welcome" && this.selected == 3) this.screen = "story";
  }

  handleKeypress(event) {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        this.selected-1 >= 1 ? this.selected-- : this.selected = 3;
        break;
      case "KeyS":
      case "ArrowDown":
        this.selected+1 <= 3 ? this.selected++ : this.selected = 1;
        break;
      case "Enter":
      case "Space":
        this.confirmSelection();
        break;
      case "KeyQ":
        if (this.screen == "help" || this.screen == "story") {
          this.screen = "welcome";
        }
        break;
      default:
        break;
    }
  }

  handleGameDoneInput(event) {
    if ((event.code == "Space") || (event.code == "Enter")) {
      removeEventListener("keydown", this.gameDoneKeyHandler);
      this.screen = "welcome"

      this.keyDownListener  = this.handleKeypress.bind(this);
      window.addEventListener("keydown", this.keyDownListener);
      this.mouseMoveListener = this.handleMouseMove.bind(this)
      this.game.canvas.addEventListener("mousemove", this.mouseMoveListener);
      this.clickListener = this.handleMenuClick.bind(this)
      this.game.canvas.addEventListener("click", this.clickListener)
    }
  }

  handleMouseMove(event) {
    if(!this.game.isFullscreen) {
      if (event.offsetX > 393 && event.offsetX < 562 && event.offsetY > 245 && event.offsetY < 269)  this.selected = 1;
      if (event.offsetX > 417 && event.offsetX < 539 && event.offsetY > 311 && event.offsetY < 336 ) this.selected = 2;
      if (event.offsetX > 416 && event.offsetX < 540 && event.offsetY > 375 && event.offsetY < 401 ) this.selected = 3;
    }
    if(this.game.isFullscreen) {
      if (event.offsetX > 393*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetX < 562*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetY > 245*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetY < 269*(window.innerWidth/(this.game.canvas.width*2)) )  this.selected = 1;
      if (event.offsetX > 417*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetX < 539*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetY > 311*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetY < 336*(window.innerWidth/(this.game.canvas.width*2)) ) this.selected = 2;
      if (event.offsetX > 416*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetX < 540*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetY > 375*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetY < 401*(window.innerWidth/(this.game.canvas.width*2)) ) this.selected = 3;
    }
  }

  handleMenuClick(event) {
    if(!this.game.isFullscreen) {
      if (event.offsetX > 393 && event.offsetX < 562 && event.offsetY > 245 && event.offsetY < 269)  {
        this.selected = 1;
        this.confirmSelection();
      }
      if (event.offsetX > 417 && event.offsetX < 539 && event.offsetY > 311 && event.offsetY < 336) {
        this.selected = 2;
        this.confirmSelection();
      }
      if (event.offsetX > 416 && event.offsetX < 540 && event.offsetY > 375 && event.offsetY < 401) {
        this.selected = 3;
        this.confirmSelection();
      }

      if (event.offsetX > 20 && event.offsetX < 60 && event.offsetY > 20 && event.offsetY < 60 ) {
        if (this.screen == "help" || this.screen == "story") {
          this.screen = "welcome";
        }
      }
    }
    if(this.game.isFullscreen) {
      if (event.offsetX > 393*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetX < 562*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetY > 245*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetY < 269*(window.innerWidth/(this.game.canvas.width*2)))  {
        this.selected = 1;
        this.confirmSelection();
      }
      if (event.offsetX > 417*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetX < 539*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetY > 311*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetY < 336*(window.innerWidth/(this.game.canvas.width*2)) ) {
        this.selected = 2;
        this.confirmSelection();
      }
      if (event.offsetX > 416*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetX < 540*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetY > 375*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetY < 401*(window.innerWidth/(this.game.canvas.width*2)) ) {
        this.selected = 3;
        this.confirmSelection();
      }

      if (event.offsetX > 20*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetX < 60*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetY > 20*(window.innerWidth/(this.game.canvas.width*2)) && event.offsetY < 60*(window.innerWidth/(this.game.canvas.width*2)) ) {
        if (this.screen == "help" || this.screen == "story") {
          this.screen = "welcome";
        }
      }
    }
  }
}
