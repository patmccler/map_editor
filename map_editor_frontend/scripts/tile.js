export class Tile {
  constructor(x,y) {
    this.x = x
    this.y = y
  }

  static findTile(tiles,x,y) {
    // probably a faster way to do this, may need to look into later
    return tiles.find(tile => tile.x === x && tile.y === y)
  }

  persist(levelId) {
    let configObj = {
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json"
      },
      method: "POST",
      body: JSON.stringify(this)
    }
    fetch(this.postURL(levelId), configObj)
    .then(resp => resp.json())
    .then(newTile => this.id = newTile.id
    )
  }

  postURL(levelID) {
    return `http://localhost:3000/levels/${levelID}/tiles`
  }
}