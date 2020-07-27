export class Tile {
  constructor(x,y) {
    this.x = x
    this.y = y
  }

  static findTile(tiles,x,y) {
    // probably a faster way to do this, may need to look into later
    return tiles.find(tile => tile.x === x && tile.y === y)
  }
}