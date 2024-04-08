// src/app/my-page/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

const MyPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState([]);
  const [totalHeight, setTotalHeight] = useState(0);
  const router = useRouter();

  // 書籍データを削除する関数
  const deleteBook = async (bookId: string) => {
    const bookDocRef = doc(db, "books", bookId);
    try {
      await deleteDoc(bookDocRef);
      setBooks(books.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error deleting book: ", error);
    }
  };

  // ページ数の合計に基づいて累計の高さを更新する関数
  const updateTotalHeight = (books) => {
    const totalPages = books.reduce((sum, book) => sum + book.pages, 0);
    // 1ページの厚みを0.2mmと仮定
    const heightPerBookPage = 0.2; // mm
    const totalHeight =
      Math.floor(((totalPages * heightPerBookPage) / 10) * 100) / 100;
    setTotalHeight(totalHeight);
  };

  // ユーザー情報と書籍データを取得する処理
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // ユーザーがログインしている場合、ユーザー情報をセット
        setUser(currentUser);
        setLoading(false);

        // ログインユーザーに紐づく書籍データを取得する
        const fetchBooks = async () => {
          const q = query(
            collection(db, "books"),
            where("userId", "==", currentUser.uid),
          );
          const querySnapshot = await getDocs(q);
          const userBooks = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBooks(userBooks);
          updateTotalHeight(userBooks);
        };

        fetchBooks();
      } else {
        router.push("/signin");
      }
    });

    // コンポーネントのアンマウント時にリスナーを解除
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My Page</h1>
      {user && (
        <div>
          <p>Username: {user.displayName}</p>
          <p>Email: {user.email}</p>
          <p>積み上げの高さ: {totalHeight} cm</p>
          <div>
            <h2>登録書籍一覧</h2>
            {books.length > 0 ? (
              <ul>
                {books.map((book) => (
                  <li key={book.id}>
                    <p>書籍名: {book.name}</p>
                    <p>読了日: {book.date}</p>
                    <p>ページ数: {book.pages}</p>
                    <img src={book.img_url} alt={book.name} />
                    <button onClick={() => deleteBook(book.id)}>削除</button>
                    <button>編集</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You have no books registered.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
