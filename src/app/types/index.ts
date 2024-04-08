// types/index.ts

export interface Book {
  id: string;
  title: string;
  description: string;
  pageCount: number | null;
  image: string;
  mainCategory: string;
  categories: string[];
}
