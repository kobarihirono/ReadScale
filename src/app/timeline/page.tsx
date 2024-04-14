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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
const fetchBooks = async () => {
      try {
        const q = query(collection(db, "books"));
        const querySnapshot = await getDocs(q);
        const booksData: Book[] = querySnapshot.docs.map((doc) => ({
          ...doc.data() as Book,
          id: doc.id,
        }));
        setBooks(booksData);
        await fetchUsers(booksData);
      } catch (err) {
        setError('データの取得中にエラーが発生しました。');
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
            const photoRef = ref(storage, `profileImages/${book.userId}/avatar.jpg`);
            const photoURL = await getDownloadURL(photoRef).catch(() => "/icons/no-icon.png");
            
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>

  return (
    <div className="py-8 m-auto w-11/12">
      <h1 className="text-center font-bold text-xl">みんなの積み上げ</h1>
      {books.map((book) => (
        <div key={book.id} className="book-item flex items-center border-2 m-4 p-4">
          <img
            className="rounded-full w-32 h-32 object-cover mr-4"
            src={users[book.userId]?.photoURL}
            alt={users[book.userId]?.displayName || 'プロファイル画像'}
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
