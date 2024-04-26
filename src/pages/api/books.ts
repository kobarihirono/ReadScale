// src/pages/api/books.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { Book } from "../../types/index";

/**
 * Google Books API で書籍を検索する関数
 * [GET]/api/books
 *
 * @param req リクエスト
 * @param res レスポンス
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Book[] | { error: string }>,
) {
  let q = req.query.q || "";
  q = Array.isArray(q) ? q[0] : q;

  try {
    const data = await getData(q);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}

/**
 * Google Books API の実行と取得結果の整形を行う
 *
 * @param q 検索クエリ
 * @returns 見つかった書籍のリスト
 */

async function getData(query: string): Promise<Book[]> {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40&langRestrict=ja`,
  );

  if (!response.ok) {
    throw new Error(`API call failed with status: ${response.status}`);
  }

  const jsonData = await response.json();

  if (!jsonData.items) {
    throw new Error("No items found in the API response");
  }

  return jsonData.items.map((elem: any) => ({
    id: elem.id,
    title: elem.volumeInfo.title,
    description: elem.volumeInfo?.description,
    pageCount: elem.volumeInfo?.pageCount,
    publishedDate: elem.volumeInfo.publishedDate,
    image: elem.volumeInfo.imageLinks?.thumbnail,
    mainCategory: elem.volumeInfo.mainCategory,
    categories: elem.volumeInfo.categories,
  }));
}
