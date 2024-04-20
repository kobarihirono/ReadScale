// src/const/index.ts

// 本の高さの閾値を定義
export const thresholds = [
  { limit: 7, image: "1.2cm", name: "ハチ" },
  { limit: 25, image: "7cm", name: "ヒヨコ" },
  { limit: 50, image: "25cm", name: "ネコ" },
  { limit: 120, image: "50cm", name: "ウサギ" },
  { limit: 150, image: "120cm", name: "ペンギン" },
  { limit: 180, image: "150cm", name: "オオカミ" },
  { limit: 200, image: "180cm", name: "マグロ" },
  { limit: 300, image: "200cm", name: "一軒家" },
  { limit: 400, image: "300cm", name: "キリン" },
  { limit: 500, image: "400cm", name: "ワニ" },
  { limit: 800, image: "500cm", name: "シャチ" },
  { limit: 1000, image: "800cm", name: "風車" },
  { limit: 1500, image: "1000cm", name: "奈良の大仏" },
  { limit: 2000, image: "1500cm", name: "ビル" },
  { limit: 3000, image: "2000cm", name: "キリスト像" },
  { limit: 4000, image: "3000cm", name: "モアイ像" },
  { limit: 5700, image: "4000cm", name: "ピサの斜塔" },
  { limit: 9300, image: "5700cm", name: "自由の女神像" },
  { limit: 32400, image: "9300cm", name: "東京タワー" },
  { limit: 37760, image: "32400cm", name: "富士山" },
  { limit: 63400, image: "37760cm", name: "スカイツリー" },
];

// 1ページあたりの高さを定義
export const heightPerBookPage = 0.01;
