// src/const/index.ts

// 本の高さの閾値を定義
export const thresholds = [
  { limit: 7, image: "1.2cm" },
  { limit: 25, image: "7cm" },
  { limit: 50, image: "25cm" },
  { limit: 120, image: "50cm" },
  { limit: 150, image: "120cm" },
  { limit: 180, image: "150cm" },
  { limit: 200, image: "180cm" },
  { limit: 300, image: "200cm" },
  { limit: 400, image: "300cm" },
  { limit: 500, image: "400cm" },
  { limit: 800, image: "500cm" },
  { limit: 1000, image: "800cm" },
  { limit: 1500, image: "1000cm" },
  { limit: 2000, image: "1500cm" },
  { limit: 3000, image: "2000cm" },
  { limit: 4000, image: "3000cm" },
  { limit: 5700, image: "4000cm" },
  { limit: 9300, image: "5700cm" },
  { limit: 32400, image: "9300cm" },
  { limit: 37760, image: "32400cm" },
  { limit: 63400, image: "37760cm" },
];

// 1ページあたりの高さを定義
export const heightPerBookPage = 0.01;
