// src/app/my-page/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

const MyPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState([]); // 複数の書籍データを保持するための状態
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // ユーザーがログインしている場合、ユーザー情報をセット
        setUser(currentUser);
        setLoading(false);

        // ログインユーザーに紐づく書籍データを取得する
        const fetchBooks = async () => {
          const q = query(collection(db, "books"), where("userId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const userBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setBooks(userBooks);
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
          <div>
            <h2>登録書籍一覧</h2>
            {books.length > 0 ? (
              <ul>
                {books.map(book => (
                  <li key={book.id}>
                    <p>書籍名: {book.name}</p>
                    <p>読了日: {book.date}</p>
                    <img src={book.img_url} alt={book.name} />
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
