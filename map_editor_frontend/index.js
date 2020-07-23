
console.log("Index.js running")

class Level {
  constructor(name, width, height) {
    this.name = name
    this.width = width
    this.height = height
    this.renderable = false
  }
}

Level.prototype.render = function() {
  renderLevel(this)
  this.renderable = false
}

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
  mapDiv = document.querySelector("#map")
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
  console.log(`Tile at ${col}, ${row} clicked.`)
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