
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
  loadCurrentLevel(this)
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
      currentLevel = levels[0]
      currentLevel.renderable = true
    })
  }
})


// TODO:
function loadCurrentLevel(level) {
  mapDiv = document.querySelector("#map")
  mapDiv.innerHTML = ""
  mapDiv.appendChild(buildHeaderRow(level.width))

  for(let r = 0; r < level.height; r++) {
    mapDiv.appendChild(buildLevelRow(r, level.width))
  }
}

function buildLevelRow(row, columns) {
  let mapRowDiv = document.createElement("div")
  mapRowDiv.classList.add("map-row")
  mapRowDiv.appendChild(headerTileTemplate(row))
  for(let col = 0; col < columns; col++) {
     mapRowDiv.appendChild(tileTemplate())
  }
  return mapRowDiv
}

function tileTemplate(tile) {
  let tileDiv = document.createElement("div")
  tileDiv.classList.add("tile")
  return tileDiv
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