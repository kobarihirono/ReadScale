// types/index.ts

export interface Book {
  id: string;
  title: string;
  description: string;
  pageCount: number | null;
  publishedDate: string | null;
  image: string | null;
  mainCategory: string;
  categories: string[];

  date: string;
  name: string;
  pages: number;
  img_url: string;
}
