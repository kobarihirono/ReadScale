// search/page.tsx
"use client";

import React, { SyntheticEvent, useState } from "react";
import type { NextPage } from "next";
import BookItem from "../../components/BookItem/BookItem";
import AddBookModal from "../../components/BookModal/AddBookModal";
import { Book } from "../types/index";
import MypageButton from "@/components/Button/MypageButton";

const BookSearch: NextPage = () => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  // 検索時にデータの受け取りまでの時間が空くと、情報があっても一瞬検索結果が見つからないと表示される
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const onClickSearch = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    setHasSearched(true);

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
    }
  };

  const closeModal = () => setSelectedBook(null);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hover_button shadow-sm"
        placeholder="キーワードを入力"
      />
      <button
        onClick={onClickSearch}
        className="px-4 py-2 bg-navy text-white font-bold rounded-full hover:bg-hover_button"
      >
        検索
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {items.length === 0 && !error && hasSearched && (
        <div>
          検索結果が見つかりませんでした。
          <br />
          別のワードで試してください。
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
