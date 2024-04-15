// src/app/my-page/[id]/page.tsx
"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
      setProfileImageUrl("/icons/no-icon.png");
    } finally {
      setLoading(false);
    }
  };

  function getImageForHeight(height: number): string {
    const thresholds = [
      { limit: 7, image: "1.2cm" },
      { limit: 25, image: "7cm" },
      { limit: 50, image: "25cm" },
      { limit: 120, image: "50cm" },
      { limit: 150, image: "120cm" },
      { limit: 180, image: "150cm" },
      { limit: 200, image: "180cm" },
      { limit: 300, image: "200cm" },
      { limit: 400, image: "300cm" },
      { limit: 500, image: "400cm" },
      { limit: 800, image: "500cm" },
      { limit: 1000, image: "800cm" },
      { limit: 1500, image: "1000cm" },
      { limit: 2000, image: "1500cm" },
      { limit: 3000, image: "2000cm" },
      { limit: 4000, image: "3000cm" },
      { limit: 5700, image: "4000cm" },
      { limit: 9300, image: "5700cm" },
      { limit: 32400, image: "9300cm" },
      { limit: 37760, image: "32400cm" },
      { limit: 63400, image: "37760cm" },
    ];

    const defaultImage = "63400cm";

    const found = thresholds.find((threshold) => height < threshold.limit);
    return `/medal/${found ? found.image : defaultImage}.png`;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.uid) {
        setUser(currentUser);
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
            <div className="flex justify-center items-center my-10">
              <div className="flex justify-center items-center gap-4 border-2 w-2/3 p-4 rounded-xl">
                <Image
                  src={getImageForHeight(totalHeight)}
                  width={60}
                  height={60}
                  alt="Icon representing the accumulated height of books"
                />
                <p className="mt-4">積み上げの高さ: {totalHeight} cm</p>
              </div>
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
              <ul className="space-y-4 mt-8">
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
