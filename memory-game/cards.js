// ============================================================
//  tiles.js  –  Card data for the Memory Game
//
//  Each tile defines ONE pair:
//    • the "name" card  → displays tile.name as text
//    • the "image" card → displays tile.image (URL or relative path)
//
//  You can use:
//    - a full URL:      "https://example.com/photo.jpg"
//    - a relative path: "assets/image/fuji.jpg"
//    - leave image as  "" and a colour-coded fallback will show
//
//  The game picks as many pairs as it needs based on
//  GRID_ROWS × GRID_COLS ÷ 2  (configured in memory-game.js).
// ============================================================

const TILES = [
  {
    id: 1,
    name: "Hungarian Parliament",
    image: "https://game.no1online.cz/assets/images/hu_parliament.jpg",
  },
  {
    id: 2,
    name: "Budapest Bathouse",
    image: "https://game.no1online.cz/assets/images/budapest_bathouse.jpg",
  },
  {
    id: 3,
    name: "Lookout tower in Monor",
    image: "https://game.no1online.cz/assets/images/monor_lookout_twr.jpg",
  },
  {
    id: 4,
    name: "Hero square in Budapest",
    image: "https://game.no1online.cz/assets/images/budapest_hero_square.jpg",
  },
  {
    id: 5,
    name: "First bridge in Budapest",
    image: "https://game.no1online.cz/assets/images/budapest_chain_bridge.jpg",
  },
  {
    id: 6,
    name: "Matthias Church in Budapest",
    image: "https://game.no1online.cz/assets/images/budapest_matthias_church.jpg",
  },
  {
    id: 7,
    name: "Margaret Island in Budapest",
    image: "https://game.no1online.cz/assets/images/budapest_margaret_island.jpg",
  },
  {
    id: 8,
    name: "Budapest Nyugati railway station",
    image: "https://game.no1online.cz/assets/images/budapest_nyugati_station.jpg",
  }
];