
console.log("Index.js running")

/**
 * These are the classes used to represent the data
 */
class Level {
  constructor(name, width, height) {
    //Better way to get base URL in here?
    this.name = name
    this.width = width
    this.height = height
    this.renderable = false
    this.firstRender = true

    this.tiles = []
  }

  get tilePostURL() {
    return `http://localhost:3000/levels/${this.id}/tiles`
  }

  tileDeleteURL(tileID) {
    return `http://localhost:3000/levels/${this.id}/tiles/${tileID}`
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
    let tile = new Tile(x,y)
    this.tiles.push(tile)
    this.postTile(tile)
  }

  //Make a fetcher class maybe, to hold urls?
  postTile(tile) {
    let configObj = {
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json"
      },
      method: "POST",
      body: JSON.stringify(tile)
    }
    fetch(this.tilePostURL, configObj)
    .then(resp => resp.json())
    .then(newTile => tile.id = newTile.id
    )
  }

  removeTile(tile) {
    this.tiles.splice(this.tiles.indexOf(tile),1)
    this.resetTile(tile)
    this.deleteTile(tile)
  }

  deleteTile(tile) {
    let configObj = {
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json"
      },
      method: "DELETE"
    }
    fetch(this.tileDeleteURL(tile.id), configObj)
    .catch(err => console.log(err))
  }

  resetTile(tile) {
    this.findTileDiv(tile).className = "tile"
  }

  render() {
    if(this.firstRender) {
      let mapDiv = document.querySelector("#map")
      mapDiv.innerHTML = ""
      mapDiv.appendChild(this.buildHeaderRow(this.width))

      for(let r = 0; r < this.height; r++) {
        mapDiv.appendChild(this.buildLevelRow(r, this.width))
      }

      this.renderLevelName()
      this.renderLevelWidth()
      this.renderLevelHeight()
      this.firstRender = false
    }
    this.renderTiles()
    this.renderable = false
  }

  renderTiles() {
    this.tiles.forEach(tile => {
      this.findTileDiv(tile).classList.add("basic-tile")
    })
  }

  findTileDiv(tile) {
    return document.getElementsByClassName("map-row")[tile.y + 1].children[tile.x + 1]
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
      mapRowDiv.appendChild(this.buildTile(col, row))
    }
    return mapRowDiv
  }

  buildTile(col, row) {
    let tileDiv = document.createElement("div")
    tileDiv.classList.add("tile")
    tileDiv.addEventListener("click", e => this.tileClicked(col, row))
    return tileDiv
  }

  tileClicked(col, row) {
    this.renderable = true
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


/**
 * There should only be one of this clas
 * It keeps track of the levels, and the current level
 * It also loops and checks if rerendering is needed
 */
class UIController {
  constructor(levels, current) {
    this.levels = levels
    this.currentLevel = current
  }

  loop() {
    if (this.currentLevel && this.currentLevel.renderable) {
      this.currentLevel.render()
    }
    requestAnimationFrame(this.loop.bind(this));
  }

  initLevels(levels) {
    this.levels = levels.map(level => {
      return Object.assign(new Level(), level)
    })
    this.populateLevelSelect(levels)
    this.chooseLevel(levels[0].id)
  }

  chooseLevel(levelID) {
    this.currentLevel = this.levels.find(level => level.id === levelID)
    this.currentLevel.renderable = true
    this.currentLevel.firstRender = true
  }

  populateLevelSelect(levels) {
    let buildLevelOption = (level) => {
      let opt = document.createElement("option")
      opt.value = level.id
      opt.innerText = level.name
      return opt
    }

    let levelSelect = document.querySelector("#levels-select")
    levels.forEach(level => levelSelect.appendChild(buildLevelOption(level)))
    levelSelect.addEventListener("change", e => this.chooseLevel(parseInt(e.target.value)))
  }

}

/** This is where some setup happens
 *  The UIController is initialized, levels are grabbed
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

  UI_CONTROLLER.loop()

  fetchAllLevels()
  function fetchAllLevels() {
    fetch(LEVELS_URL, {HEADERS})
    .then(resp => resp.json())
    .then(allLevels => {
      console.log(allLevels)
      UI_CONTROLLER.initLevels(allLevels)
    })
  }
})
