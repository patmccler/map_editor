import {Level} from "./level.js"
import {Modal} from "./modal.js"

/**
 * There should only be one of this clas
 * It keeps track of the levels, and the current level
 * It also loops and checks if rerendering is needed
 */
export class UIController {
  static tools = [
    {name: "Toggle"},
    {
      name: "Door",
      tile_image_url: "../assets/door_closed.png"
    },
    {
      name: "Stairs",
      tile_image_url: "../assets/stair_down.png"
    }
  ]

  constructor(levels, current) {
    this.levels = levels
    this.currentLevel = current
    this.currentTool
    this.tools
    this.populateTools()
    this.setupActionsMenu()
  }

  loop() {
    if (this.currentLevel && this.currentLevel.renderable) {
      this.currentLevel.render()
    }
    requestAnimationFrame(this.loop.bind(this));
  }

  initLevels(levels) {
    this.levels = levels.map(level => Level.buildFromJSON(level, this.tileClicked.bind(this)))
    this.populateLevelSelect(levels)
    this.chooseLevel(levels[0].id)
  }

  chooseLevel(levelID) {
    document.getElementById("levels-select").value = levelID
    this.currentLevel = this.levels.find(level => level.id === levelID)
    this.currentLevel.renderable = true
    this.currentLevel.firstRender = true
  }

  tileClicked(col, row) {
    let tile = this.currentLevel.getMapAt(col,row)

    if(this.currentTool.name === "Toggle") {
      this.currentLevel.renderable = true
      let add = this.currentLevel.toggleTile(col,row)
      tile = this.currentLevel.getMapAt(col,row)

      this.neighborsRespondToDrag(col, row, add)

    } else if (this.currentTool.tile_image_url) {
      this.currentLevel.renderable = true

      if(tile && tile.imageURL !== this.currentTool.tile_image_url) {
        tile.imageURL = this.currentTool.tile_image_url
        tile.rotation = 0
      } else if(tile) {
        tile.rotate()
      } else {
        this.currentLevel.addTile(col, row, this.currentTool.tile_image_url)
      }
    }

    return tile || {x: col, y: row}
  }

  neighborsRespondToDrag(col, row, add) {
    let neighbors = this.currentLevel.findNeighborTileDivWithLocation(col, row)
    for(let neighbor of Object.values(neighbors)) {

      let mouseEnterListener = (callback, thisArg) => {
        return e => {
          if(thisArg) {
            // only rerender if were actually doing something with callback
            this.currentLevel.renderable = true
            callback.call(thisArg, neighbor.x, neighbor.y)
          }
          this.neighborsRespondToDrag(neighbor.x, neighbor.y, add)
          e.target.onmouseenter = null
        }
      }

      //takes a function generated above, asigns it to the current div and sets a listener on doc to destory when mouse is lifted up
      let setListener = callback => {
        neighbor.div.onmouseenter = callback
        document.addEventListener("mouseup", e => neighbor.div.onmouseenter = null, { once: true })
      }

      // if neighbor tile is empty, and we are adding
      if(!this.currentLevel.getMapAt(neighbor.x, neighbor.y) && add && neighbor.div) {
        let addOnMouseEnter = mouseEnterListener(this.currentLevel.addTile, this.currentLevel)
        setListener(addOnMouseEnter)

      // if neighbor tile is not empty, and we are removing
      } else if(!!this.currentLevel.getMapAt(neighbor.x, neighbor.y) && !add && neighbor.div){
        let removeOnMouseEnter = mouseEnterListener(this.currentLevel.removeTileAtLocation, this.currentLevel)
        setListener(removeOnMouseEnter)
      // pass an empty callback to bubble to further neighbors without affecting intermediate elements
      } else if(neighbor.div) {
        let bubblePastExistingOnEnter = mouseEnterListener(() => {}, null)
        setListener(bubblePastExistingOnEnter)
      }
    }
  }

  populateLevelSelect(levels) {
    let buildLevelOption = (level) => {
      let opt = document.createElement("option")
      opt.value = level.id
      opt.innerText = level.name
      return opt
    }

    let levelSelect = document.querySelector("#levels-select")
    levelSelect.innerHTML = ""
    levels.forEach(level => levelSelect.appendChild(buildLevelOption(level)))
    levelSelect.addEventListener("change", e => this.chooseLevel(parseInt(e.target.value)))
  }

  populateTools() {
    this.fetchTools()
    .then(tools => {
      this.tools = this.constructor.tools.concat(tools)
      this.tools.forEach((tool, i) => this.addTool(tool,i))
    })
  }

  addTool(tool, i) {
    let div = document.createElement("div")
    div.classList.add("tool-button")
    div.innerHTML = `<div>${tool.name}<div>`
    div.setAttribute("data-tool", tool.name)
    div.addEventListener("click", (e) => this.chooseTool(e.currentTarget))
    if(i === 0) this.chooseTool(div)
    console.log(tool)
    if(tool.tile_image_url) {
      console.log(tool)
      div.appendChild(this.buildToolImg(tool.tile_image_url))
    }

    document.getElementById("tool-box").appendChild(div)
  }

  buildToolImg(tile_image_url) {
    let img = document.createElement("img")
    img.className = "tool-image"
    img.src = tile_image_url
    return img
  }


  chooseTool(toolDiv) {
    if(!toolDiv.classList.contains("selected")) {
      if(this.currentTool) document.querySelector(".tool-button.selected").classList.remove("selected")
      toolDiv.classList.add("selected")
      this.currentTool = this.tools.find(tool => tool.name === toolDiv.getAttribute("data-tool"))
    }
  }

  setupActionsMenu() {
    let newToolModal = new Modal(document.getElementById("new-tool-modal"), this.newToolSubmit.bind(this))
    let newLevelModal = new Modal(document.getElementById("new-level-modal"), this.newLevelSubmit.bind(this))

    document.getElementById("new-level").addEventListener("click", newLevelModal.show.bind(newLevelModal))
    document.getElementById("new-tool").addEventListener("click", newToolModal.show.bind(newToolModal))
  }

  fetchTools() {
    const configObj = {
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json"
      }
    }

    return fetch(`http://localhost:3000/tile_templates`, configObj)
    .then(resp => resp.json())
    // .then(tileTemplates => tileTemplates.forEach(tileTemplate => this.renderTool(tileTemplate)))
  }

  hideModals() {
    this.modals.forEach(modal => modal.hide())
  }

  newLevelSubmit(e) {
    let width = document.getElementById("width-input").value
    let height = document.getElementById("height-input").value
    let name = document.getElementById("level-name-input").value

    const configObj = {
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json"
      },
      method: "POST",
      body: JSON.stringify({width, height, name})
    }

    return fetch(`http://localhost:3000/levels`, configObj)
    .then(resp => resp.json())
    .then(newLevel => newLevel.id ? this.showNewLevel(newLevel) : Promise.reject(newLevel))
  }

  showNewLevel(level) {
    level = Level.buildFromJSON(level, this.tileClicked.bind(this))
    this.levels.push(level)
    this.populateLevelSelect(this.levels)
    this.chooseLevel(level.id)
  }

  newToolSubmit(e) {

    let body = new FormData()
    body.append("tile_template[name]", document.getElementById("tool-name-input").value)
    body.append("tile_template[tile_image]", document.getElementById("tool-image-input").files[0] || "")

    const configObj = {
      method: "POST",
      body
    }


    return fetch(`http://localhost:3000/tile_templates`, configObj)
    .then(resp => resp.json())
    .then(newTool => {
      return newTool.id ? this.createTool(newTool) : Promise.reject(newTool)
    })
  }

  createTool(tool) {
    this.tools.push(tool)
    this.addTool(tool, -1)
  }
}
