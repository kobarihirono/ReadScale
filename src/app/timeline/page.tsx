// src/app/timeline/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import Loading from "@/components/elements/Loading/Loading";
import { fetchBooks, fetchUsers } from "@/lib/firebase/apis/allBook";
import { Book, User } from "@/types/index"; // この行を追加

export default function TimelinePage() {
  const [books, setBooks] = useState<Book[] | null>(null); // Book型の配列またはnullを指定
  const [users, setUsers] = useState<{ [key: string]: User }>({}); // Userオブジェクトのマップとして型指定
  const [error, setError] = useState<string | null>(null); // エラーの型も明示的に指定

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedBooks = await fetchBooks();
        if (fetchedBooks) {
          setBooks(fetchedBooks);
          const fetchedUsers = await fetchUsers(fetchedBooks);
          setUsers(fetchedUsers);
        }
      } catch (err) {
        setError("データの取得中にエラーが発生しました。");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!books || !users) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-4">
              <img
                className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full object-cover"
                src={users[book.userId]?.photoURL}
                alt={users[book.userId]?.displayName || "プロファイル画像"}
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl text-gray-900 truncate">
                  {users[book.userId]?.displayName}
                </h2>
                <p className="text-gray-700 truncate">{book.title}</p>{" "}
                {/* 'name'を 'title'に修正 */}
                <p className="text-sm text-gray-500">読了日: {book.date}</p>
                <p className="text-sm text-gray-500">
                  登録日: {book.createdAt}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
