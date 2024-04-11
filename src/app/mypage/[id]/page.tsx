// src/app/my-page/[id]/page.tsx
"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
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
import { Book } from "../../types/index";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import EditBookModal from "@/components/BookModal/EditModal";

const MyPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  const [totalHeight, setTotalHeight] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const router = useRouter();

  const deleteBook = async (bookId: string): Promise<void> => {
    const bookDocRef = doc(db, "books", bookId);
    try {
      await deleteDoc(bookDocRef);
      const updatedBooks = books.filter((book) => book.id !== bookId);
      setBooks(updatedBooks);
      updateTotalHeight(updatedBooks);
    } catch (error) {
      console.error("Error deleting book: ", error);
    }
  };

  const updateTotalHeight = (books: Book[]): void => {
    const totalPages = books.reduce((sum, book) => sum + book.pages, 0);
    const heightPerBookPage = 0.2;
    const totalHeight =
      Math.floor(((totalPages * heightPerBookPage) / 10) * 100) / 100;
    setTotalHeight(totalHeight);
  };

  const handleEdit = (book: Book): void => {
    setEditingBook(book);
    setIsModalOpen(true);
    console.log("Editing book: ", book);
  };

  const handleBookUpdate = (updatedBook: Book): void => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === updatedBook.id ? { ...book, date: updatedBook.date } : book,
      ),
    );
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const uploadProfileImage = async (
    e: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const storage = getStorage();
    const storageRef = ref(storage, `profileImages/${user.uid}/avatar.jpg`);

    try {
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      setProfileImageUrl(photoURL);
      console.log("Uploaded a blob or file!", photoURL);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const loadProfileImage = async (currentUser: User | null): Promise<void> => {
    if (!currentUser) return;

    const storage = getStorage();
    const storageRef = ref(
      storage,
      `profileImages/${currentUser.uid}/avatar.jpg`,
    );

    try {
      const url = await getDownloadURL(storageRef);
      setProfileImageUrl(url);
    } catch (error) {
      console.error("Failed to load profile image", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.uid) {
        setUser(currentUser);
        setLoading(false);
        loadProfileImage(currentUser);

        const fetchBooks = async () => {
          const q = query(
            collection(db, "books"),
            where("userId", "==", currentUser.uid),
          );
          const querySnapshot = await getDocs(q);
          const userBooks: Book[] = querySnapshot.docs.map((doc) => ({
            ...(doc.data() as Book),
            id: doc.id,
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
    <div className="p-6">
      <div className="flex justify-center">
        {profileImageUrl && (
          <img
            className="rounded-full w-1/3 shadow-lg border-2 border-gray-300"
            src={profileImageUrl}
            alt="プロファイル画像"
          />
        )}
      </div>
      {user && (
        <div>
          <div className="text-center font-bold text-gray-700">
            <p className="mt-6">{user.displayName}</p>
            <p className="mt-2">{user.email}</p>
            <div className="flex justify-center">
              <p className="mt-4 border-2 w-2/3 p-6 rounded-xl">
                積み上げの高さ: {totalHeight} cm
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={uploadProfileImage}
              className="file:shadow file:border-none file:py-2 file:px-4 file:rounded-full file:bg-blue-500 file:text-white file:cursor-pointer"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mt-10">
              登録書籍一覧
            </h2>
            {books.length > 0 ? (
              <ul className="space-y-4">
                {books.map((book) => (
                  <li key={book.id} className="bg-white p-4 shadow rounded-lg">
                    <div className="book-item flex">
                      <img
                        src={book.img_url}
                        alt={book.name}
                        className="rounded"
                      />
                      <div className="flex justify-between flex-col">
                        <div>
                          <div className="flex flex-col ml-6">
                            <p className="text-gray-700">書籍名: {book.name}</p>
                            <p className="text-gray-700">読了日: {book.date}</p>
                            <p className="text-gray-700 mb-4">
                              ページ数: {book.pages}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => deleteBook(book.id)}
                            className="px-4 py-2 bg-gray-400 text-white font-bold rounded-full hover:bg-hover_button"
                          >
                            削除
                          </button>
                          <button
                            onClick={() => handleEdit(book)}
                            className="px-4 py-2 bg-deepGreen text-white font-bold rounded-full hover:bg-hover_button ml-2"
                          >
                            編集
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* .book-item */}
                  </li>
                ))}
              </ul>
            ) : (
              <p>現在、登録した書籍はありません</p>
            )}
          </div>
        </div>
      )}
      {isModalOpen && editingBook && (
        <EditBookModal
          bookId={editingBook.id}
          currentCompletedDate={editingBook.date}
          onClose={handleCloseModal}
          onBookUpdate={handleBookUpdate}
        />
      )}
    </div>
  );
};

export default MyPage;
