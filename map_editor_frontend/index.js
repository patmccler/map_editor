
console.log("Index.js running")

/**
 * These are the classes used to represent the data
 */
class Level {
  constructor(name, width, height) {
    this.name = name
    this.width = width
    this.height = height
    this.renderable = false

    this.tiles = []
  }

  /**
   * toggle the tile at x,y
   * returns true if added, false if removed
   */
  toggleTile(x,y) {
    let tile = Tile.findTile(this.tiles,x,y)
    if(tile) {
      this.removeTile(tile)
      return false
    } else {
      this.addTile(x,y)
      return true
    }
  }

  addTile(x,y) {
    this.tiles.push(new Tile(x,y))
  }

  removeTile(tile) {
    this.tiles.splice(this.tiles.indexOf(tile),1)
  }
}

Level.prototype.render = function() {
  renderLevel(this)
  this.renderable = false
}

class Tile {
  constructor(x,y) {
    this.x = x
    this.y = y

    this.constructor.allTiles.push(this)
  }

  static findTile(tiles,x,y) {
    // probably a faster way to do this, may need to look into later
    return tiles.find(tile => tile.x === x && tile.y === y)
  }

  static findOrCreateTile(x,y) {
    return this.findTile(x,y) || new Tile(x,y)
  }

}

/** This is where some setup happens
 *
 *
 */

document.addEventListener("DOMContentLoaded", e => {
  const BASE_URL = "http://localhost:3000"
  const LEVELS_URL = `${BASE_URL}/levels`
  const HEADERS = {
    'Content-Type': 'application/json',
    "Accept": "application/json"
  }

  let levels;
  let currentLevel;

  function loop() {
    if (currentLevel && currentLevel.renderable) {
      currentLevel.render()
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  fetchAllLevels()
  function fetchAllLevels() {
    fetch(LEVELS_URL, {HEADERS})
    .then(resp => resp.json())
    .then(allLevels => {
      levels = allLevels.map(level => {
        return Object.assign(new Level(), level)
      })
      populateLevelSelect(levels)
      chooseLevel(levels[0].id)
    })
  }

  function chooseLevel(levelID) {
    currentLevel = levels.find(level => level.id === levelID)
    currentLevel.renderable = true
  }

  document.querySelector("#levels-select").addEventListener("change", e => chooseLevel(parseInt(e.target.value)))
})

  function populateLevelSelect(levels) {
    let levelSelect = document.querySelector("#levels-select")
    levels.forEach(level => levelSelect.appendChild(buildLevelOption(level)))
  }

  function buildLevelOption(level) {
    let opt = document.createElement("option")
    opt.value = level.id
    opt.innerText = level.name
    return opt
  }


  function renderLevel(level) {
    let mapDiv = document.querySelector("#map")
    mapDiv.innerHTML = ""
    mapDiv.appendChild(buildHeaderRow(level.width))

    for(let r = 0; r < level.height; r++) {
      mapDiv.appendChild(buildLevelRow(r, level.width))
    }

    renderLevelName(level.name)
    renderLevelWidth(level.width)
    renderLevelHeight(level.height)
  }

  function renderLevelName(name) {
    document.getElementById("level-name").innerText = name
  }

  function renderLevelWidth(width) {
    document.getElementById("level-width").innerText = width
  }

  function renderLevelHeight(height) {
    document.getElementById("level-height").innerText = height
  }

  function buildLevelRow(row, columns) {
    let mapRowDiv = document.createElement("div")
    mapRowDiv.classList.add("map-row")
    mapRowDiv.appendChild(headerTileTemplate(row))
    for(let col = 0; col < columns; col++) {
      mapRowDiv.appendChild(tileTemplate(col, row))
    }
    return mapRowDiv
  }

  function tileTemplate(col, row) {
    let tileDiv = document.createElement("div")
    tileDiv.classList.add("tile")
    tileDiv.addEventListener("click", e => tileClicked(col, row))
    return tileDiv
  }

  function tileClicked(col, row) {
    return currentLevel.toggleTile(col,row)
  }

  function headerTileTemplate(index) {
    let div = document.createElement("div")
    div.innerText = index + 1
    return div
  }

  function buildHeaderRow(length) {
    let mapRowDiv = document.createElement("div")
    mapRowDiv.classList.add("map-row")

    for(let i = 0; i <= length; i++) {
      let div = document.createElement("div")
      div.innerText = i
      div.classList.add("tile", "map-header")
      mapRowDiv.appendChild(div)
    }
    return mapRowDiv
  }
