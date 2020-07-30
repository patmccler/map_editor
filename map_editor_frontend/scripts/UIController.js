import {Level} from "./level.js"
import {Modal} from "./modal.js"

/**
 * There should only be one of this clas
 * It keeps track of the levels, and the current level
 * It also loops and checks if rerendering is needed
 */
export class UIController {
  static tools = [
    {text: "Toggle"},
    {
      text: "Door",
      imageURL: "../assets/door_closed.png"
    },
    {
      text: "Stairs",
      imageURL: "../assets/stair_down.png"
    }
  ]

  constructor(levels, current) {
    this.levels = levels
    this.currentLevel = current
    this.currentTool
    this.modals
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

    if(this.currentTool.text === "Toggle") {
      this.currentLevel.renderable = true
      let add = this.currentLevel.toggleTile(col,row)
      tile = this.currentLevel.getMapAt(col,row)

      this.neighborsRespondToDrag(col, row, add)

    } else if (this.currentTool.imageURL) {
      this.currentLevel.renderable = true

      if(tile && tile.imageURL !== this.currentTool.imageURL) {
        tile.imageURL = this.currentTool.imageURL
        tile.rotation = 0
      } else if(tile) {
        tile.rotate()
      } else {
        this.currentLevel.addTile(col, row, this.currentTool.imageURL)
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
    let tools = this.constructor.tools
    let toolBox = document.getElementById("tool-box")

    tools.forEach((tool, i) => {
      let div = document.createElement("div")
      div.classList.add("tool-button")
      div.innerHTML = `<div>${tool.text}<div>`
      div.setAttribute("data-tool", tool.text)
      div.addEventListener("click", (e) => this.chooseTool(e.currentTarget))
      if(i === 0) this.chooseTool(div)

      if(tool.imageURL) {
        div.appendChild(this.buildToolImg(tool.imageURL))
      }

      toolBox.appendChild(div)
    })
  }

  buildToolImg(imageURL) {
    let img = document.createElement("img")
    img.className = "tool-image"
    img.src = imageURL
    return img
  }

  chooseTool(toolDiv) {
    if(!toolDiv.classList.contains("selected")) {
      if(this.currentTool) document.querySelector(".tool-button.selected").classList.remove("selected")
      toolDiv.classList.add("selected")
      this.currentTool = this.constructor.tools.find(tool => tool.text === toolDiv.getAttribute("data-tool"))
    }
  }

  setupActionsMenu() {
    let newToolModal = new Modal(document.getElementById("new-tool-modal"), null)
    let newLevelModal = new Modal(document.getElementById("new-level-modal"), this.newLevelSubmit.bind(this))
    console.log(newToolModal)

    document.getElementById("new-level").addEventListener("click", newLevelModal.show.bind(newLevelModal))
    document.getElementById("new-tool").addEventListener("click", newToolModal.show.bind(newToolModal))

    //returns modals to controller
    this.modals = new Map()
    this.modals.set("tool", newToolModal)
    this.modals.set("level", newLevelModal)
    console.log(this.modals)
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

    fetch(`http://localhost:3000/levels`, configObj)
    .then(resp => resp.json())
    .then(newLevel => newLevel.id ? this.showNewLevel(newLevel) : this.modals.get("level").displayErrors(newLevel))
    .catch()
  }

  showNewLevel(level) {
    this.hideModals()
    level = Level.buildFromJSON(level, this.tileClicked.bind(this))
    this.levels.push(level)
    this.populateLevelSelect(this.levels)
    this.chooseLevel(level.id)
  }

  logModalError(attrs) {
    const errorDiv = document.getElementById("modal-errors")
    errorDiv.innerText = ""
    for(let attr in attrs) {
      errorDiv.innerText += `${attr}: ${attrs[attr].join(" ")}\n`
    }
    return false
  }
}