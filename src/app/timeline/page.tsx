// src/app/timeline/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Book, User } from "../types/index";
import Loading from "@/components/elements/Loading/Loading";
import { formatDate } from "@/utils/index";

const Timeline = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const q = query(collection(db, "books"));
        const querySnapshot = await getDocs(q);
        const booksData: Book[] = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Book;
          return {
            ...data,
            id: doc.id,
            date: formatDate(data.date),
            createdAt: formatDate(data.createdAt),
          };
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        setBooks(booksData);
        await fetchUsers(booksData);
      } catch (err) {
        setError("データの取得中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async (booksData: Book[]) => {
      const usersData: { [key: string]: User } = {};
      const storage = getStorage();

      for (const book of booksData) {
        if (!usersData[book.userId]) {
          const userDocRef = doc(db, "users", book.userId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const photoRef = ref(
              storage,
              `profileImages/${book.userId}/avatar.jpg`,
            );
            const photoURL = await getDownloadURL(photoRef).catch(
              () => "/icons/no-icon.png",
            );

            usersData[book.userId] = {
              uid: book.userId,
              displayName: userData.username || "未設定",
              photoURL: photoURL,
            };
          } else {
            usersData[book.userId] = {
              uid: book.userId,
              displayName: "未設定",
              photoURL: "/icons/no-icon.png",
            };
          }
        }
      }

      setUsers(usersData);
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) return <div>Error: {error}</div>;

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
                <p className="text-gray-700 truncate">{book.name}</p>
                <p className="text-sm text-gray-500">
                  読了日: {book.date}
                </p>
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
};

export default Timeline;
