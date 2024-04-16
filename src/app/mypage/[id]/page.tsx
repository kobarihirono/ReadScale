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
import DeleteModal from "@/components/BookModal/DeleteModal";
import Loading from "@/components/Loading/Loading";
import UserIcon from "@/components/User/UserIcon";

const MyPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const router = useRouter();

  /**
   * 書籍の削除処理
   *
   * @param bookId 削除する書籍のID
   */

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const handleDeleteClick = (bookId: string): void => {
    setDeleteModalOpen(true);
    setBookToDelete(bookId);
  };

  const confirmDelete = (): void => {
    if (bookToDelete) {
      deleteBook(bookToDelete);
      setDeleteModalOpen(false);
      setBookToDelete(null);
    }
  };

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

  /**
   * 書籍の更新処理
   * @param bookId 更新する書籍のID
   */

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleEdit = (book: Book): void => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleBookUpdate = (updatedBook: Book): void => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === updatedBook.id ? { ...book, date: updatedBook.date } : book,
      ),
    );
  };

  /**
   * 書籍の高さを更新する
   * @param books 書籍リスト
   */

  const [totalHeight, setTotalHeight] = useState<number>(0);

  const updateTotalHeight = (books: Book[]): void => {
    const totalPages = books.reduce((sum, book) => sum + book.pages, 0);
    const heightPerBookPage = 0.2;
    const totalHeight =
      Math.floor(((totalPages * heightPerBookPage) / 10) * 100) / 100;
    setTotalHeight(totalHeight);
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

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  /**
   * アイコン画像のアップロード処理
   * @param e イベント
   * @returns Promise<void>
   */

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

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

  // ローディング処理
  const [loading, setLoading] = useState<boolean>(true);
  
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <UserIcon
        profileImageUrl={profileImageUrl}
        onImageUpload={uploadProfileImage}
      />

      {user && (
        <div>
          <div className="text-center font-bold text-gray-700">
            <p className="mt-6 text-3xl">{user.displayName}</p>
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
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mt-10">
              登録書籍一覧
            </h2>
            {books.length > 0 ? (
              <ul className="space-y-4 mt-">
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
                            onClick={() => handleDeleteClick(book.id)}
                            className="px-4 py-2 bg-gray-400 text-white font-bold rounded-full hover:bg-hover_button"
                          >
                            削除
                          </button>
                          <DeleteModal
                            isOpen={deleteModalOpen}
                            onClose={() => setDeleteModalOpen(false)}
                            onDelete={confirmDelete}
                          />
                          <button
                            onClick={() => handleEdit(book)}
                            className="px-4 py-2 bg-deepGreen text-white font-bold rounded-full hover:bg-hover_button ml-2"
                          >
                            編集
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6">現在、登録した書籍はありません</p>
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
