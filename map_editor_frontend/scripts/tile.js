export class Tile {
  constructor(x, y, levelId) {
    this.x = x
    this.y = y
    this.levelId = levelId
  }

  static findTile(tiles,x,y) {
    // probably a faster way to do this, may need to look into later
    return tiles.find(tile => tile.x === x && tile.y === y)
  }

  get postURL() {
    return `http://localhost:3000/levels/${this.levelId}/tiles`
  }

  get deleteURL() {
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

}