import {Level} from "./level.js"

/**
 * There should only be one of this clas
 * It keeps track of the levels, and the current level
 * It also loops and checks if rerendering is needed
 */
export class UIController {
  static tools = ["Toggle", "Door", "Entrance"]

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
    if(this.currentTool === "Toggle") {
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

    tools.forEach((text, i) => {
      let div = document.createElement("div")
      div.classList.add("tool-button")
      div.innerText = text
      div.setAttribute("data-tool", text)
      div.addEventListener("click", (e) => this.chooseTool(e.target))
      if(i === 0) this.chooseTool(div)
      toolBox.appendChild(div)
    })

  }

  chooseTool(toolDiv) {
    if(!toolDiv.classList.contains("selected")) {
      if(this.currentTool) document.querySelector(".tool-button.selected").classList.remove("selected")
      toolDiv.classList.add("selected")
      this.currentTool = toolDiv.getAttribute("data-tool")
    }
  }
}