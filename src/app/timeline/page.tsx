// src/app/timeline/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

interface Book {
  id: string;
  name: string;
  date: string;
  userId: string;
  img_url: string;
}

interface User {
  uid: string;
  displayName: string;  // username という名前で変更
  photoURL: string;
}

const Timeline = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});

  useEffect(() => {
    const fetchBooks = async () => {
      const q = query(collection(db, "books"));
      const querySnapshot = await getDocs(q);
      const booksData: Book[] = querySnapshot.docs.map((doc) => ({
        ...doc.data() as Book,
        id: doc.id,
      }));
      setBooks(booksData);
      fetchUsers(booksData);
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

  return (
    <div>
      <h1>タイムライン</h1>
      {books.map((book) => (
        <div key={book.id} className="book-item">
          <img
            src={users[book.userId]?.photoURL}
            alt={users[book.userId]?.displayName || 'プロファイル画像'}
          />
          <h2>{users[book.userId]?.displayName}</h2>
          <p>{book.name}</p>
          <p>読了日: {book.date}</p>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
