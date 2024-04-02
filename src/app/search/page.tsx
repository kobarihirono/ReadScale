// search/page.tsx
"use client";

import React, { SyntheticEvent, useState } from 'react';
import type { NextPage } from 'next';
import BookItem from '../../components/BookItem/BookItem';
import { Book } from '../types/index';

const BookSearch: NextPage = () => {
  const [query, setQuery] = useState(""); 
  const [items, setItems] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onClickSearch = async (e: SyntheticEvent) => {
    e.preventDefault(); // フォーム送信によるページのリロードを防ぐ
    setError(null); // 以前のエラー状態をクリア

    try {
      const response = await fetch(`/api/books?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch books. Status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("An error occurred during the book search:", error);
      setError("Failed to load books. Please try again.");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={onClickSearch}>検索</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <BookItem book={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookSearch;
