
console.log("Index.js running")

document.addEventListener("DOMContentLoaded", loadCurrentMap)

/**TODO: actually fetch this data
 *
 */
function fetchCurrentMap() {
  return (new Array(10).fill(new Array(20).fill("")))
}

function loadCurrentMap() {
  let mapData = fetchCurrentMap()
  mapDiv = document.querySelector("#map")
  mapDiv.innerHTML = ""
  mapDiv.appendChild(buildHeaderRow(mapData[0].length))



  let rows = mapData.map((row, i) => buildMapRow(row, i))
  rows.forEach(row => mapDiv.appendChild(row))
}

function buildMapRow(row, index) {
  let mapRowDiv = document.createElement("div")
  mapRowDiv.classList.add("map-row")
  mapRowDiv.appendChild(headerTileTemplate(index))
  row.forEach(tile => mapRowDiv.appendChild(tileTemplate(tile)))
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