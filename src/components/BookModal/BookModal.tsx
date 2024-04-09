// components/BookModal/BookModal.tsx

import React, { useEffect, useState } from "react";
import { Book } from "../../app/types/index";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface BookModalProps {
  book: Book;
  onClose: () => void;
}

const BookModal: React.FC<BookModalProps> = ({ book, onClose }) => {
  const [completedDate, setCompletedDate] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // ログインしているユーザー情報をセット
    });

    return () => unsubscribe();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompletedDate(e.target.value);
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error("ユーザーがログインしていません。");
      return;
    }

    console.log(`書籍名 : "${book.title}" 読了日 : ${completedDate}`);

    try {
      await addDoc(collection(db, "books"), {
        createdAt: serverTimestamp(),
        date: completedDate,
        img_url: book.image,
        name: book.title,
        pages: book.pageCount,
        userId: user.uid,
      });
      onClose();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold">{book.title}</h2>
        <div className="mt-4">
          <label
            htmlFor="completedDate"
            className="block text-sm font-medium text-gray-700"
          >
            読了日
          </label>
          <input
            type="date"
            id="completedDate"
            name="completedDate"
            value={completedDate}
            onChange={handleDateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            登録
          </button>
          <button
            onClick={onClose}
            className="ml-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
