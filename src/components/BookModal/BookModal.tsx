// components/BookModal/BookModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { Book } from "../../app/types/index";

interface BookModalProps {
  book: Book;
  onClose: () => void;
  isEditing?: boolean;
  editingBookData?: {
    id: string;
    completedDate: string;
  };
  onBookUpdate?: (updatedBook: Book) => void;
}

const BookModal: React.FC<BookModalProps> = ({
  book,
  onClose,
  isEditing = false,
  editingBookData,
  onBookUpdate,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      completedDate: editingBookData?.completedDate || "",
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const onSubmit = async (data: { completedDate: string }) => {
    if (!user) {
      console.error("ユーザーがログインしていません。");
      return;
    }

    if (isEditing && editingBookData) {
      try {
        const bookDocRef = doc(db, "books", editingBookData.id);
        await updateDoc(bookDocRef, {
          date: data.completedDate,
        });
        onBookUpdate?.({ ...book, date: data.completedDate });
        onClose();
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    } else {
      try {
        await addDoc(collection(db, "books"), {
          createdAt: serverTimestamp(),
          date: data.completedDate,
          img_url: book.image,
          name: book.title,
          pages: book.pageCount,
          userId: user.uid,
        });
        onClose();
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold">{book.title}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <label
            htmlFor="completedDate"
            className="block text-sm font-medium text-gray-700"
          >
            読了日
          </label>
          <input
            type="date"
            {...register("completedDate", {
              required: "読了日を入力してください",
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none sm:text-sm"
          />
          {errors.completedDate && (
            <p className="text-red-500">{errors.completedDate.message}</p>
          )}
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditing ? "更新" : "登録"}
            </button>
            <button
              onClick={onClose}
              type="button"
              className="ml-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              閉じる
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
