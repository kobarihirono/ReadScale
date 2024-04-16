// search/page.tsx
"use client";

import React, { SyntheticEvent, useState, ChangeEvent } from "react";
import type { NextPage } from "next";
import BookItem from "../../components/BookItem/BookItem";
import AddBookModal from "../../components/BookModal/AddBookModal";
import { Book } from "../types/index";
import Image from "next/image";

const BookSearch: NextPage = () => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<string>("");

  const onClickSearch = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    setHasSearched(true);
    setLoading(true);

    try {
      const response = await fetch(`/api/books?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch books. Status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
      setQuery("");
    } catch (error) {
      console.error("An error occurred during the book search:", error);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    if (newSortOrder === "newest") {
      setItems(
        items
          .slice()
          .sort(
            (a, b) =>
              new Date(b.publishedDate).getTime() -
              new Date(a.publishedDate).getTime(),
          ),
      );
    } else if (newSortOrder === "oldest") {
      setItems(
        items
          .slice()
          .sort(
            (a, b) =>
              new Date(a.publishedDate).getTime() -
              new Date(b.publishedDate).getTime(),
          ),
      );
    }
  };

  const closeModal = () => setSelectedBook(null);

  if (loading) {
    return (
      <div
        role="status"
        className="flex flex-col justify-center items-center h-full"
      >
        <svg
          aria-hidden="true"
          className="w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-deepGreen"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="py-8 m-auto w-11/12">
      <div className="flex justify-center">
        <div className="flex flex-col md:flex-row">
          <div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-2 border w-8/12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hover_button shadow-sm"
              placeholder="キーワードを入力"
            />
            <button
              onClick={onClickSearch}
              className="px-4 py-2 bg-navy text-white font-bold rounded-full hover:bg-hover_button ml-2"
            >
              検索
            </button>
          </div>
          <select
            onChange={handleSortChange}
            value={sortOrder}
            className="px-2 py-2 md:ml-8 md:mt-0 ml-0 mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hover_button shadow-sm"
          >
            <option value="">並び替え</option>
            <option value="newest">出版日が新しい順</option>
            <option value="oldest">出版日が古い順</option>
          </select>
        </div>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {items.length === 0 && !error && hasSearched && (
        <div className="my-6 h-full">
          <p>
            検索結果が見つかりませんでした。
            <br />
            別のワードで試してください。
          </p>
          <Image
            src="/images/search.png"
            alt="読書をしている手の画像"
            width={300}
            height={300}
          />
        </div>
      )}
      {items.length === 0 && !hasSearched && (
        <div className="mt-6 text-center">
          <p>キーワードを入力して検索してください。</p>
          <div className="flex justify-center">
            <Image
              src="/images/search.png"
              alt="本を開いている人の画像"
              width={300}
              height={300}
            />
          </div>
        </div>
      )}
      <ul className="flex flex-wrap">
        {items.map((item, index) => (
          <li
            className="p-2 w-full md:w-1/2 xl:w-1/3"
            key={index}
            onClick={() => setSelectedBook(item)}
          >
            <BookItem book={item} />
          </li>
        ))}
      </ul>
      {selectedBook && (
        <AddBookModal book={selectedBook} onClose={closeModal} />
      )}
    </div>
  );
};

export default BookSearch;
