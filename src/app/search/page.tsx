// search/page.tsx
"use client";

import React, { SyntheticEvent, useState, ChangeEvent } from "react";
import type { NextPage } from "next";
import BookItem from "../../components/elements/BookItem/BookItem";
import AddBookModal from "../../components/elements/BookModal/AddModal";
import { Book } from "../types/index";
import Image from "next/image";
import Loading from "@/components/elements/Loading/Loading";

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
    return <Loading />;
  }

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="flex flex-col items-center w-full bg-navy py-6 rounded-b-3xl">
          <div className="relative w-8/12 lg:w-6/12">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-2 border w-full bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-hover_button"
              placeholder="キーワードを入力"
            />
            <button
              onClick={onClickSearch}
              className="absolute right-2 top-4 transform -translate-y-1/2"
            >
              <Image
                src="/icons/search.png"
                alt="検索アイコン"
                width={30}
                height={30}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
      <select
        onChange={handleSortChange}
        value={sortOrder}
        className="px-2 py-2 mt-4 mr-12 lg:mr-36 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hover_button"
      >
        <option value="">並び替え</option>
        <option value="newest">出版日が新しい順</option>
        <option value="oldest">出版日が古い順</option>
      </select>
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
        <div className="flex flex-col items-center justify-center my-24 text-center">
          <p className="">キーワードを入力して検索してください。</p>
          <div className="flex justify-center mt-6">
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
