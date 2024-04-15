// src/app/timeline/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Book, User } from "../types/index";

const Timeline = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // データベースからbooksコレクションのデータを取得
        const q = query(collection(db, "books"));
        // ドキュメントを非同期で取得
        const querySnapshot = await getDocs(q);
        // 取得したドキュメント配列をオブジェクトに変換
        const booksData: Book[] = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Book),
          id: doc.id,
        }));
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

  // ローディング中はローディングアイコンを表示
  if (loading)
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

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="py-8 m-auto w-11/12">
      <h1 className="text-center font-bold text-xl">みんなの積み上げ</h1>
      {books.map((book) => (
        <div
          key={book.id}
          className="book-item flex items-center border-2 m-4 p-4"
        >
          <img
            className="rounded-full w-32 h-32 object-cover mr-4"
            src={users[book.userId]?.photoURL}
            alt={users[book.userId]?.displayName || "プロファイル画像"}
          />
          <div className="flex flex-col gap-2">
            <h2 className="font-bold">{users[book.userId]?.displayName}</h2>
            <p className="font-bold">{book.name}</p>
            <p>読了日: {book.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
