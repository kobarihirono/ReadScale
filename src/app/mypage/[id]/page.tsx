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
import { thresholds } from "@/const/index";
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

  const handleBookUpdate = (updatedBookPartial: Partial<Book>): void => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === updatedBookPartial.id
          ? { ...book, ...updatedBookPartial }
          : book,
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
    const defaultImage = "63400cm";

    const found = thresholds.find((threshold) => height < threshold.limit);
    return `/medal/${found ? found.image : defaultImage}.png`;
  }

  const calculatePagesToNextRank = (currentHeight: number): number => {
    const nextThreshold = thresholds.find(
      (threshold) => currentHeight < threshold.limit,
    );
    if (!nextThreshold) return 0;

    const heightPerBookPage = 0.2;
    const nextPageThreshold =
      (nextThreshold.limit - currentHeight) / heightPerBookPage;
    return Math.ceil(nextPageThreshold);
  };

  const pagesToNextRank = calculatePagesToNextRank(totalHeight);

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  /**
   * アイコン画像のアップロード処理
   * @param
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
    <div>
      <UserIcon
        profileImageUrl={profileImageUrl}
        onImageUpload={uploadProfileImage}
      />

      {user && (
        <div>
          <div className="text-center font-bold text-gray-700 bg-navy rounded-b-3xl">
            <p className="pt-2 text-white text-3xl">{user.displayName}</p>
            <p className="mt-2 text-white">{user.email}</p>
            <div className="flex justify-center items-center my-2">
              <div className="flex justify-center items-center relative top-1 bg-white gap-4 border w-2/3 p-4 rounded-xl">
                <Image
                  src={getImageForHeight(totalHeight)}
                  width={60}
                  height={60}
                  alt="ユーザーアイコンが表示されます"
                />
                <div className="ml-4">
                  <p className="">{totalHeight} cm</p>
                  <p className="text-sm mt-1 text-slate-500">
                    次のランクまで約{pagesToNextRank}ページ
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 mb-10 mt-20">
            <h2 className="text-2xl font-bold text-gray-700">
              登録書籍一覧
            </h2>
            {books.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                {books.map((book) => (
                  <li
                    key={book.id}
                    className="bg-white p-4 shadow rounded-lg flex flex-col h-full"
                  >
                    <div className="flex flex-1">
                      <img
                        src={book.img_url}
                        alt={book.name}
                        className="rounded w-50 h-50 mr-4 object-cover"
                      />
                      <div className="flex flex-col justify-between">
                        <div>
                          <p className="text-gray-700 font-bold text-base md:text-lg">
                            書籍名: {book.name}
                          </p>
                          <p className="text-gray-700 text-sm md:text-base mt-1">
                            読了日: {book.date}
                          </p>
                          <p className="text-gray-700 text-sm md:text-base mb-4 mt-1">
                            ページ数: {book.pages}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => handleDeleteClick(book.id)}
                        className="px-6 py-2 bg-gray-500 text-white font-bold rounded-full hover:bg-gray-400"
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
                        className="px-6 py-2 bg-teal-600 text-white font-bold rounded-full hover:bg-teal-500 ml-2"
                      >
                        編集
                      </button>
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
