console.log("Index.js running")
import {UIController} from "./UIController.js"

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
    .then(allLevels => UI_CONTROLLER.initLevels(allLevels))
  }
})
