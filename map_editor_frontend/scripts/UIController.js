import {Level} from "./level.js"

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
      image_url: "../assets/door_closed.png"
    },
    {text: "Entrance"}
  ]

  constructor(levels, current) {
    this.levels = levels
    this.currentLevel = current
    this.currentTool
    this.populateTools()
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
    this.currentLevel = this.levels.find(level => level.id === levelID)
    this.currentLevel.renderable = true
    this.currentLevel.firstRender = true
  }

  tileClicked(col, row) {
    if(this.currentTool.text === "Toggle") {
      this.currentLevel.renderable = true
      this.currentLevel.toggleTile(col,row)
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
      div.addEventListener("click", (e) => this.chooseTool(e.target))
      if(i === 0) this.chooseTool(div)

      if(tool.image_url) {
        div.appendChild(this.buildToolImg(tool.image_url))
      }

      toolBox.appendChild(div)
    })
  }

  buildToolImg(image_url) {
    let img = document.createElement("img")
    img.src = image_url
    return img
  }

  chooseTool(toolDiv) {
    if(!toolDiv.classList.contains("selected")) {
      if(this.currentTool) document.querySelector(".tool-button.selected").classList.remove("selected")
      toolDiv.classList.add("selected")
      this.currentTool = this.constructor.tools.find(tool => tool.text === toolDiv.getAttribute("data-tool"))
    }
  }
}