// src/app/my-page/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import BookModal from "../../../components/BookModal/BookModal";

const MyPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState([]);
  const [totalHeight, setTotalHeight] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const router = useRouter();

  const deleteBook = async (bookId: string) => {
    const bookDocRef = doc(db, "books", bookId);
    try {
      await deleteDoc(bookDocRef);
      // 書籍リストから削除された書籍をフィルタリング
      const updatedBooks = books.filter((book) => book.id !== bookId);
      setBooks(updatedBooks);
      // 更新された書籍リストで累計の高さを再計算
      updateTotalHeight(updatedBooks);
    } catch (error) {
      console.error("Error deleting book: ", error);
    }
  };
  const updateTotalHeight = (books) => {
    const totalPages = books.reduce((sum, book) => sum + book.pages, 0);
    const heightPerBookPage = 0.2;
    const totalHeight =
      Math.floor(((totalPages * heightPerBookPage) / 10) * 100) / 100;
    setTotalHeight(totalHeight);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleBookUpdate = (updatedBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === updatedBook.id ? { ...book, date: updatedBook.date } : book,
      ),
    );
    updateTotalHeight(books);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);

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
                    <button onClick={() => handleEdit(book)}>編集</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You have no books registered.</p>
            )}
          </div>
        </div>
      )}
      {isModalOpen && editingBook && (
        <BookModal
          book={editingBook}
          onClose={handleCloseModal}
          isEditing={true}
          editingBookData={{
            id: editingBook.id,
            completedDate: editingBook.date,
          }}
          onBookUpdate={handleBookUpdate}
        />
      )}
    </div>
  );
};

export default MyPage;
