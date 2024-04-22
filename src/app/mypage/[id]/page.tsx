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
import { useToast } from "@/common/design";
import { Book } from "../../../types/index";
import { thresholds, heightPerBookPage } from "@/const/index";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useRankManagement from "@/hooks/useRank";
import EditBookModal from "@/components/elements/BookModal/EditModal";
import DeleteModal from "@/components/elements/BookModal/DeleteModal";
import ThresholdExceededModal from "@/components/elements/BookModal/ThresholdExceededModal";
import Loading from "@/components/elements/Loading/Loading";
import UserIcon from "@/components/elements/User/UserIcon";

const MyPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const toast = useToast();
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
      toast({
        title: "書籍が正常に削除されました。",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      const updatedBooks = books.filter((book) => book.id !== bookId);
      setBooks(updatedBooks);
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
  
  const userId = user ? user.uid : undefined;
  const {
    currentRankName,
    showThresholdModal,
    totalHeight,
    lastThreshold,
    closeModal,
  } = useRankManagement(userId, books);

  function getImageForHeight(height: number): string {
    const defaultImage = "1.2cm";

    const found = thresholds.find((threshold) => height < threshold.limit);
    return `/medal/${found ? found.image : defaultImage}.png`;
  }

  const calculatePagesToNextRank = (currentHeight: number): number => {
    const nextThreshold = thresholds.find(
      (threshold) => currentHeight < threshold.limit,
    );
    if (!nextThreshold) return 0;

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
          setBooks(userBooks); // フックが自動的に totalHeight を更新する
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
            <p className="pt-6 text-white text-3xl">{user.displayName}</p>
            <p className="mt-2 text-white">{user.email}</p>
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center relative top-10 bg-white shadow-md gap-4 w-7/12 p-4 rounded-xl">
                <Image
                  src={getImageForHeight(totalHeight)}
                  width={60}
                  height={60}
                  alt="ユーザーアイコンが表示されます"
                />
                <div className="ml-4">
                  <p>{totalHeight} cm</p>
                  <p className="text-sm mt-1 text-slate-500">
                    次のランクまで{pagesToNextRank}ページ
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 mb-10 mt-24">
            <h2 className="text-2xl font-bold text-gray-700">登録書籍一覧</h2>
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
                        className="rounded w-2/7 flex-shrink-0 object-cover"
                      />
                      <div className="flex flex-col justify-between flex-grow ml-4">
                        <div>
                          <p className="text-gray-700 font-bold text-base md:text-lg truncate">
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

      <ThresholdExceededModal
        isOpen={showThresholdModal}
        onClose={closeModal}
        height={totalHeight}
        rankName={currentRankName}
        thresholdLimit={lastThreshold}
      />

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
