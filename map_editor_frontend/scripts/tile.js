export class Tile {
  constructor(x, y, level_id) {
    this.x = x
    this.y = y
    this.level_id = level_id
    // this.image_url = image_url
  }

  static findTile(tiles,x,y) {
    // probably a faster way to do this, may need to look into later
    return tiles.find(tile => tile.x === x && tile.y === y)
  }

  get postURL() {
    return `http://localhost:3000/levels/${this.level_id}/tiles`
  }

  get deleteURL() {
    return `http://localhost:3000/levels/${this.levelId}/tiles/${this.id}`
  }

  persist() {
    console.log(this)
    let configObj = {
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json"
      },
      method: "POST",
      body: JSON.stringify(this)
    }
    fetch(this.postURL, configObj)
    .then(resp => resp.json())
    .then(newTile => this.id = newTile.id
    )
  }

  delete() {
    let configObj = {
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json"
      },
      method: "DELETE"
    }
    fetch(this.deleteURL, configObj)
    .catch(err => console.log(err))
  }

  // make determinations about how to display a given tile
  //based on itself and its neighboring tiles
  // neighbors has key for top, right, left, and bot tiles
  render(targetDiv, neighbors) {
    targetDiv.classList.add("basic-tile")

    for(let key in neighbors) {
      if (neighbors[key]) {
        targetDiv.classList.add(`no-${key}`)
      }
      else {
        targetDiv.classList.remove(`no-${key}`)
      }
    }
  }

}