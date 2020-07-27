import {Tile} from "./tile.js"

/**
 * These are the classes used to represent the data
 */
export class Level {
  constructor(name, width, height) {
    //Better way to get base URL in here?
    this.name = name
    this.width = width
    this.height = height
    this.renderable = false
    this.firstRender = true

    this.tiles = []
    this.map = []
  }

  static buildFromJSON(levelJSON, tileClickedCallback) {
    let newLevel = Object.assign(new Level(), levelJSON)
    newLevel.tileClicked = tileClickedCallback
    newLevel.processTiles()
    return newLevel
  }
  //called when level first generated from JSON
  processTiles() {
    // cant map on empty array -> fill null then map
    this.map = new Array(this.height).fill(null).map(arr => new Array(this.width))
    this.tiles = this.tiles.map(tile => {
      tile = Object.assign(new Tile(), tile)
      this.map[tile.y][tile.x] = tile
      return tile
    })
  }

  setMapAt(x,y, value) {
    this.map[y][x] = value
  }

  getMapAt(x,y) {
    return this.map[y] ? this.map[y][x] : null
  }

  clearMapAt(x,y) {
    delete this.map[y][x]
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
    this.setMapAt(x,y, tile)
    tile.persist(this.id)
  }

  removeTile(tile) {
    this.tiles.splice(this.tiles.indexOf(tile),1)
    this.resetTile(tile)
    this.clearMapAt(tile.x,tile.y)
    tile.delete(this.id)
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
      let tileDiv = this.findTileDiv(tile)
      tileDiv.classList.add("basic-tile")
      let neighbors = this.findNeighborTiles(tile)

      for(let key in neighbors) {
        if (neighbors[key]) {
          tileDiv.classList.add(`no-${key}`)
        }
        else {
          tileDiv.classList.remove(`no-${key}`)
        }
      }
    })
  }



  findNeighborTiles(tile) {
    let top = this.getMapAt(tile.x, tile.y - 1)
    let right = this.getMapAt(tile.x + 1, tile.y)
    let bottom = this.getMapAt(tile.x, tile.y + 1)
    let left = this.getMapAt(tile.x - 1, tile.y)
    return { top, right, bottom, left }
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
