addEventListener("load", (e) => {
  /* --------- Konstanten --------- */
  
  const TILE_SIZE = 32; // Größe der Tiles
  const GAP_SIZE = 4; // Abstand zwischen tiles
  const MAX_TILES_INDEX = 51; // höchster index der Tiles (also Anzahl Tiles - 1)
  const DISABLED_TILES = [25, 32, 33, 49, 51]; // tiles, die nicht ausgewählt werden können


  /* --------- Setup --------- */

  var tileset = document.getElementById("tileset");
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  canvas.width = 3200; // canvas breite festlegen
  canvas.height = 3200; // cavas höhe festlegen

  var selectedTileIndex = 0; // ausgewähltes tile
  var map = [];
  var brushActive = false;

  document.getElementById("editor").style.height = window.innerHeight + "px"; // benötigt für horizontale scrollbar

  var activeTileIndicator = document.getElementById("ati");
  activeTileIndicator.style.width = TILE_SIZE + "px";
  activeTileIndicator.style.height = TILE_SIZE + "px";
  // positioniert den active tile indicator auf das erste tile, 
  // abhänging von position des tilesets auf der seite
  let cRect = tileset.getBoundingClientRect();
  activeTileIndicator.style.top = cRect.top + GAP_SIZE / 2 + "px";
  activeTileIndicator.style.left = cRect.left + GAP_SIZE / 2 + "px";


  /* --------- Event Listener um Tile auszuwählen --------- */

  // tile per klick auf tileset auswählen
  tileset.addEventListener("click", (e) => {
    var x = Math.floor(e.offsetX / (TILE_SIZE + GAP_SIZE));
    let y = Math.floor(e.offsetY / (TILE_SIZE + GAP_SIZE));
    let tilesPerRow = tileset.width / (TILE_SIZE + GAP_SIZE);

    selectTile(x + y * tilesPerRow);
  });

  // eventlistener um mit strg und mausrad die tiles durchscrollen zu können
  document.addEventListener("wheel", (e) => {
    if (e.ctrlKey) {
      e.preventDefault(); // zoomen der seite verhindern
      const delta = Math.sign(e.deltaY);
      selectedTileIndex += delta;
      if (selectedTileIndex < 0) selectedTileIndex = 0;
      if (selectedTileIndex > MAX_TILES_INDEX) selectedTileIndex = MAX_TILES_INDEX;
      selectTile(selectedTileIndex);
    }
  },
    { passive: false }
  );


  /* --------- Event Listener um Tiles zu zeichnen --------- */

  // position der maus auf canvas bei click erhalten und mit ausgewähltem tile füllen
  canvas.addEventListener("click", (e) => {
    var canvasX = Math.floor(e.offsetX / TILE_SIZE)
    var canvasY = Math.floor(e.offsetY / TILE_SIZE)

    if (map[canvasY] !== undefined) var indexAtPos = map[canvasY][canvasX]; // wenn das gleiche teil ander position nicht existiert

    if (e.ctrlKey && indexAtPos !== undefined) selectTile(indexAtPos); // tile auf canvas mit strg klick auswählen
    if (indexAtPos != selectedTileIndex && selectedTileIndex <= MAX_TILES_INDEX) drawTile(canvasX, canvasY, selectedTileIndex);
  });

  // wenn linke maustaste gedrückt gehalten wird, brush modus aktivieren
  canvas.addEventListener("mousedown", (e) => {
    if (e.button == 0) brushActive = true;
  });

  // wenn mousetaste losgelassen wird brush modus deaktivieren
  document.addEventListener("mouseup", (e) => {
    brushActive = false;
  });

  // tiles zeichnen bei mausbewegung wenn brush modus aktiv ist
  canvas.addEventListener("mousemove", (e) => {
    if(brushActive) {
      var canvasX = Math.floor(e.offsetX / TILE_SIZE)
      var canvasY = Math.floor(e.offsetY / TILE_SIZE)

      if (map[canvasY] !== undefined) var indexAtPos = map[canvasY][canvasX];

      if (
        indexAtPos != selectedTileIndex &&
        selectedTileIndex <= MAX_TILES_INDEX)
          drawTile(canvasX, canvasY, selectedTileIndex);
    }
  });

  // mit rechtsklick tile löschen
  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault(); // öffnen des kontextmenüs verhindern

    var canvasX = Math.floor(e.offsetX / TILE_SIZE)
    var canvasY = Math.floor(e.offsetY / TILE_SIZE)
    if (map[canvasY] !== undefined) {
      if (map[canvasY][canvasX] !== undefined) deleteTile(canvasX, canvasY);
    }
  });


  /* --------- Event Listener um auf Buttons zu reagieren --------- */

  // eventlistener um auf "map öffnen" bzw. dateiupload zu reagieren
  document.getElementById("fileInput").addEventListener("change", (e) => {
    resetCanvas();

    var file = new FileReader();
    file.onload = () => { // wenn datei geladen ist, den inhalt in array umwandeln und in das canvas zeichnen
      drawMap(stringToArray(file.result));
    };
    file.readAsText(e.target.files[0]);
  });

  // button um canvas zu resetten
  document.getElementById("clear").addEventListener("click", () => {
    resetCanvas();
  });

  // handler für den "speichern" button
  document.getElementById("generate").addEventListener("click", () => {
    let downloadBtn = document.getElementById("download");
    let mapName = "default"; // default Mapname festlegen
    mapName = prompt("Map bennenen:"); // abfrage für Mapname

    downloadBtn.download = mapName; // über download attribut festlegen, dass datei bei klick gespeichert werden soll
    downloadBtn.style.opacity = "1";
    downloadBtn.style.color = "#6a94ff";
    downloadBtn.style.pointerEvents = "unset";

    let text = mapArrayToString(mapName); // array in string umwandeln
    // text datei erstellen
    var data = new Blob([text], { type: "text/plain;charset=utf-8" });
    var textFile = window.URL.createObjectURL(data);
    downloadBtn.href = textFile; // link zu erstellter datei für download button setzen
  });

  /* --------- Funktionen --------- */

  // funktion um tile per index auszuwählen
  function selectTile(index) {
    if(DISABLED_TILES.includes(index)) return;
    if (index < 0) index = 0;
    if (index > MAX_TILES_INDEX) index = MAX_TILES_INDEX;
    selectedTileIndex = index;
    document.getElementById("tileIndex").innerText = "selectedTileIndex: " + index;
    
    let tilesPerRow = tileset.width / (TILE_SIZE + GAP_SIZE);
    x = index % tilesPerRow;
    y = Math.floor(index / tilesPerRow);
    
    let cRect = tileset.getBoundingClientRect();
    activeTileIndicator.style.top = cRect.top + TILE_SIZE * y + y * GAP_SIZE + GAP_SIZE / 2 + "px";
    activeTileIndicator.style.left = cRect.left + TILE_SIZE * x + x * GAP_SIZE + GAP_SIZE / 2 + "px";
  }

  // tile auf canvas zeichnen
  function drawTile(x, y, tileIndex) {
    let tilesPerRow = tileset.width / (TILE_SIZE + GAP_SIZE);
    tileX = tileIndex % tilesPerRow;
    tileY = Math.floor(tileIndex / tilesPerRow);

    context.drawImage(
      tileset,
      tileX * TILE_SIZE + tileX * GAP_SIZE + GAP_SIZE / 2,
      tileY * TILE_SIZE + tileY * GAP_SIZE + GAP_SIZE / 2,
      TILE_SIZE,
      TILE_SIZE,
      x * TILE_SIZE,
      y * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
    replaceTile(y, x, tileIndex); // tile in array ersetzen
  }

  // map Array verändern / Tile einfügen bzw. ersetzen
  function replaceTile(zeile, spalte, tileIndex) {
    disableDownload();
    if (map[zeile] === undefined) map[zeile] = [];
    map[zeile][spalte] = tileIndex;
  }

  // bereich auf canvas löschen
  function deleteTile(x, y) {
    context.clearRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    delete map[y][x];
  }

  // funktion um canvas zu resetten
  function resetCanvas() {
    disableDownload();
    context.clearRect(0, 0, canvas.width, canvas.height); // context löschen
    map = []; // array leeren
  }

  // download button in deaktivierten zustand versetzen
  function disableDownload() {
    let downloadBtn = document.getElementById("download");
    downloadBtn.style.opacity = "0.2";
    downloadBtn.style.color = "#ffffff";
    downloadBtn.style.pointerEvents = "none";
  }

    // funktion um map array auf canvas zu zeichnen (mit 5 tiles abstand zum rand)
    function drawMap(map) {
      for (let zeile = 0; zeile < map.length; zeile++) {
        for (let spalte = 0; spalte < map[zeile].length; spalte++) {
          drawTile(spalte + 5, zeile + 5, map[zeile][spalte]);
        }
      }
    }

  // funktion die aus einem string ein array macht und dieses zurückgibt
  function stringToArray(str) {
    let trimmedStr = str.replaceAll("[", "");
    trimmedStr = trimmedStr.split(",");
    let arr = [];

    let row = 0;
    trimmedStr.forEach((num) => {
      if (!isNaN(num)) {
        if (arr[row] === undefined) arr[row] = [];
        arr[row].push(parseInt(num));
      }
      if (num.trim() == "]") row++;
    });
    return arr
  }

  // funktion um das array mit der map in einen string umzuwandeln
  function mapArrayToString(mapName) {
    purgeArray();

    let output = "[\n";
    map.forEach((row) => {
      output += "\t[";
      row.forEach((tileIndex) => {
        output += tileIndex + ", ";
      });
      output += "],\n";
    });
    output += "],";
    return output;
  }

  // leere bereiche im array mit index von schwarzem tile füllen
  function purgeArray() {
    let arrayBounds = getMinMaxIndexFromArr2d();
    console.log(arrayBounds);

    for (let row = arrayBounds.firstRowIndex; row < map.length; row++) {
      for (let col = arrayBounds.minIndexInCol; col <= arrayBounds.maxIndexInCol; col++) {
        if (map[row][col] === undefined) map[row][col] = 9; // index von schwarzem tile (hintergrund)
      }
    }
  }

  // anhand der gezeichneten tiles den bereich für das array herausfinden
  // da level an beliebiger stelle in das canvas gezeichnet werden kann
  function getMinMaxIndexFromArr2d() {
    let minIndexInCol = undefined;
    let maxIndexInCol = 0;
    let firstFilledRowFound = false;
    let firstRowIndex = undefined;
    for (let row = 0; row < map.length; row++) {
      if (map[row] == undefined && firstFilledRowFound) {
        map[row] = [];
      } else if (map[row]) {
        if (!firstFilledRowFound) {
          firstFilledRowFound = true;
          firstRowIndex = row;
        }
      } else {
        continue;
      }

      for (let col = 0; col < map[row].length; col++) {
        if (map[row][col] != undefined) {
          if (minIndexInCol == undefined) minIndexInCol = col;
          if (col > maxIndexInCol) maxIndexInCol = col;
          if (col < minIndexInCol) minIndexInCol = col;
        }
      }
    }
    return {
      firstRowIndex: firstRowIndex,
      minIndexInCol: minIndexInCol,
      maxIndexInCol: maxIndexInCol,
    };
  }
});
