export class Tile {
  constructor(x, y, level_id, imageURL) {
    this.rotation = 0
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
    if(this.id) {
      this.save()
    } else {
      this.persist()
    }
  }

  get imageURL() {
    return this.image_url
  }

  get postURL() {
    return `http://localhost:3000/levels/${this.level_id}/tiles`
  }

  get resourceURL() {
    return `http://localhost:3000/levels/${this.level_id}/tiles/${this.id}`
  }

  rotate() {
    this.rotation = (this.rotation + 90) % 360
    console.log(this.rotation)
    this.save()
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
    if(this.id) {
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
      .then(updatedTile => Object.assign(this, updatedTile)
      )
    } else {
      this.persist()
    }
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
    targetDiv.className = "tile basic-tile"

    if(this.imageURL) {
      let img = targetDiv.firstChild || document.createElement("div")
      img.className = "tile-image"
      img.style.backgroundImage = `url('${this.imageURL}')`
      img.classList.add(`rotate-${this.rotation}`)
      targetDiv.appendChild(img)
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
