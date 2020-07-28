export class Tile {
  constructor(x, y, level_id, imageURL) {
    this.x = x
    this.y = y
    this.level_id = level_id
    this.image_url = imageURL
  }

  static findTile(tiles,x,y) {
    // probably a faster way to do this, may need to look into later
    return tiles.find(tile => tile.x === x && tile.y === y)
  }

  set imageURL(imageURL) {
    this.image_url = imageURL
    this.persist()
  }

  get imageURL() {
    return this.image_url
  }

  get postURL() {
    return `http://localhost:3000/levels/${this.level_id}/tiles`
  }

  get resourceURL() {
    return `http://localhost:3000/levels/${this.levelId}/tiles/${this.id}`
  }

  persist() {
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

  save() {
    let configObj = {
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json"
      },
      method: "PATCH",
      body: JSON.stringify(this)
    }
    fetch(this.resourceURL, configObj)
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
    fetch(this.resourceURL, configObj)
    .catch(err => console.log(err))
  }

  // make determinations about how to display a given tile
  //based on itself and its neighboring tiles
  // neighbors has key for top, right, left, and bot tiles
  render(targetDiv, neighbors) {

    targetDiv.classList.add("basic-tile")

    if(this.imageURL) {
      targetDiv.style.backgroundImage = `url('${this.imageURL}')`
      targetDiv.classList.add("tile-image")
    } else {
      targetDiv.style.backgroundImage = ""
    }

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
