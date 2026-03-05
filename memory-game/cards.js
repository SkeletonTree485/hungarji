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
    name: "Mount Fuji",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/080103_hakkai_fuji.jpg/320px-080103_hakkai_fuji.jpg",
  },
  {
    id: 2,
    name: "Sakura",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/320px-Image_created_with_a_mobile_phone.png",
  },
  {
    id: 3,
    name: "Torii Gate",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Fushimi_Inari-taisha_Torii_gates.jpg/320px-Fushimi_Inari-taisha_Torii_gates.jpg",
  },
  {
    id: 4,
    name: "Bento Box",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Bento_box_lunch.jpg/320px-Bento_box_lunch.jpg",
  },
  {
    id: 5,
    name: "Bamboo Forest",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Bamboo_forest_Arashiyama_Kyoto_Japan.jpg/320px-Bamboo_forest_Arashiyama_Kyoto_Japan.jpg",
  },
  {
    id: 6,
    name: "Ramen",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Shoyu_Ramen.jpg/320px-Shoyu_Ramen.jpg",
  },
  {
    id: 7,
    name: "Samurai",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Nakamura_Seijuro_1.jpg/240px-Nakamura_Seijuro_1.jpg",
  },
  {
    id: 8,
    name: "Matcha",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Matcha_green_tea.jpg/320px-Matcha_green_tea.jpg",
  },
  {
    id: 9,
    name: "Shinkansen",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Shinkansen_700.jpg/320px-Shinkansen_700.jpg",
  },
  {
    id: 10,
    name: "Origami Crane",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Orizuru.jpg/320px-Orizuru.jpg",
  },
  {
    id: 11,
    name: "Sumo",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sumo_ceremony.jpg/320px-Sumo_ceremony.jpg",
  },
  {
    id: 12,
    name: "Kabuki",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Kabuki_dancer.jpg/240px-Kabuki_dancer.jpg",
  },
  {
    id: 13,
    name: "Koi Fish",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Koi_fish.jpg/320px-Koi_fish.jpg",
  },
  {
    id: 14,
    name: "Osaka Castle",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Osaka_Castle_in_November_2019.jpg/320px-Osaka_Castle_in_November_2019.jpg",
  },
  {
    id: 15,
    name: "Taiko Drum",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Taiko_drum_front.jpg/240px-Taiko_drum_front.jpg",
  },
  {
    id: 16,
    name: "Maneki-neko",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Maneki-neko-Japanese.jpg/240px-Maneki-neko-Japanese.jpg",
  },
  {
    id: 17,
    name: "Ikebana",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Ikebana_2013.JPG/240px-Ikebana_2013.JPG",
  },
  {
    id: 18,
    name: "Japanese Garden",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Kinkaku-ji_temple_Kyoto.jpg/320px-Kinkaku-ji_temple_Kyoto.jpg",
  },
];