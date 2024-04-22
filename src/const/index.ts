// src/const/index.ts

// 本の高さの閾値を定義
export const thresholds = [
  { limit: 7, image: "1.2cm", name: "ヒヨコ" },
  { limit: 25, image: "7cm", name: "ネコ" },
  { limit: 50, image: "25cm", name: "ウサギ" },
  { limit: 120, image: "50cm", name: "ペンギン" },
  { limit: 150, image: "120cm", name: "オオカミ" },
  { limit: 180, image: "150cm", name: "マグロ" },
  { limit: 200, image: "180cm", name: "一軒家" },
  { limit: 300, image: "200cm", name: "キリン" },
  { limit: 400, image: "300cm", name: "ワニ" },
  { limit: 500, image: "400cm", name: "シャチ" },
  { limit: 800, image: "500cm", name: "風車" },
  { limit: 1000, image: "800cm", name: "奈良の大仏" },
  { limit: 1500, image: "1000cm", name: "ビル" },
  { limit: 2000, image: "1500cm", name: "キリスト像" },
  { limit: 3000, image: "2000cm", name: "モアイ像" },
  { limit: 4000, image: "3000cm", name: "ピサの斜塔" },
  { limit: 5700, image: "4000cm", name: "自由の女神像" },
  { limit: 9300, image: "5700cm", name: "東京タワー" },
  { limit: 32400, image: "9300cm", name: "富士山" },
  { limit: 37760, image: "32400cm", name: "スカイツリー" },
  { limit: 63400, image: "37760cm", name: "未公開" },
];

// 1ページあたりの高さを定義
export const heightPerBookPage = 0.01;
