var lastTimestamp, game, isFullscreen = false;

addEventListener("load", () => {
  let btnFullscreen = document.getElementById("btnFullscreen");
  let btnEditor = document.getElementById("btnEditor");
  btnFullscreen.style.width = btnFullscreen.offsetWidth / window.devicePixelRatio + "px";
  btnEditor.style.width     = btnEditor.offsetWidth / window.devicePixelRatio + "px";

  game = new Game(isFullscreen);
  requestAnimationFrame(refresh);
  // vollbild button
  document.getElementById("btnFullscreen").addEventListener("click", () => { 
    document.getElementById("mainCanvas").requestFullscreen();
    game.isFullscreen = true;
  });

  // vollbild mit "f" wechseln
  document.addEventListener("keydown", (e) => {
    if (e.code == "KeyF") {
      if (!game.isFullscreen) {
        document.getElementById("mainCanvas").requestFullscreen();
        game.isFullscreen = true;
      } else {
        game.isFullscreen = false;
        document.exitFullscreen();
      }
    }
  });
});

// game loop
function refresh(timestamp) {
  if (lastTimestamp == undefined) lastTimestamp = timestamp;
  let duration = (timestamp - lastTimestamp) / 1000; // zeit seit letztem frame
  lastTimestamp = timestamp;
  game.update(duration);
  game.draw();
  requestAnimationFrame(refresh);
}
