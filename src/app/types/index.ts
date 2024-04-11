// types/index.ts

export interface Book {
  // APIから取得するデータ
  id: string;
  title: string;
  description: string;
  pageCount: number | null;
  publishedDate: string | null;
  image: string | null;
  mainCategory: string;
  categories: string[];

  // 以下は書籍追加時のデータ
  date: string;
  name: string;
  pages: number;
  img_url: string;
}

export type FormData = {
  email: string;
};
