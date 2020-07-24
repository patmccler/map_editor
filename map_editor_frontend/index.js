
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
    console.log(this)
    console.log(this.tiles)
    this.tiles.push(new Tile(x,y))
  }

  removeTile(tile) {
    this.tiles.splice(this.tiles.indexOf(tile),1)
  }

  render() {
    let mapDiv = document.querySelector("#map")
    mapDiv.innerHTML = ""
    mapDiv.appendChild(this.buildHeaderRow(this.width))

    for(let r = 0; r < this.height; r++) {
      mapDiv.appendChild(this.buildLevelRow(r, this.width))
    }

    this.renderLevelName()
    this.renderLevelWidth()
    this.renderLevelHeight()
    this.renderable = false
  }

  renderLevelName() {
    document.getElementById("level-name").innerText = this.name
  }

  renderLevelWidth() {
    document.getElementById("level-width").innerText = this.width
  }

  renderLevelHeight() {
    document.getElementById("level-height").innerText = this.height
  }

  buildLevelRow(row, columns) {
    let mapRowDiv = document.createElement("div")
    mapRowDiv.classList.add("map-row")
    mapRowDiv.appendChild(this.headerTileTemplate(row))
    for(let col = 0; col < columns; col++) {
      mapRowDiv.appendChild(this.tileTemplate(col, row))
    }
    return mapRowDiv
  }

  tileTemplate(col, row) {
    let tileDiv = document.createElement("div")
    tileDiv.classList.add("tile")
    tileDiv.addEventListener("click", e => this.tileClicked(col, row))
    return tileDiv
  }

  tileClicked(col, row) {
    return this.toggleTile(col,row)
  }

  headerTileTemplate(index) {
    let div = document.createElement("div")
    div.innerText = index + 1
    return div
  }

  buildHeaderRow(length) {
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
}

class Tile {
  constructor(x,y) {
    this.x = x
    this.y = y
  }

  static findTile(tiles,x,y) {
    // probably a faster way to do this, may need to look into later
    return tiles.find(tile => tile.x === x && tile.y === y)
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
  const UI_CONTROLLER = new UIController()

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
      UI_CONTROLLER.levels = levels
      UI_CONTROLLER.populateLevelSelect(levels)
      console.log(UI_CONTROLLER)
      chooseLevel(levels[0].id)
    })
  }

  function chooseLevel(levelID) {
    currentLevel = levels.find(level => level.id === levelID)
    currentLevel.renderable = true
  }

  document.querySelector("#levels-select").addEventListener("change", e => chooseLevel(parseInt(e.target.value)))
})

class UIController {
  constructor(levels, current) {
    this.levels = levels
    this.currentLevel = current
  }

  populateLevelSelect(levels) {
    let levelSelect = document.querySelector("#levels-select")
    levels.forEach(level => levelSelect.appendChild(this.buildLevelOption(level)))
  }

  buildLevelOption(level) {
    let opt = document.createElement("option")
    opt.value = level.id
    opt.innerText = level.name
    return opt
  }



}
