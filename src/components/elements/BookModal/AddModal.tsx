// components/AddBookModal/AddBookModal.tsx

import React from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/common/design";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import { Book } from "../../../app/types/index";

interface AddBookModalProps {
  book: Book;
  onClose: () => void;
}

interface BookFormData {
  completedDate: string;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ book, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    defaultValues: {
      completedDate: "",
    },
  });
  const toast = useToast();

  const handleAddBook = async (data: { completedDate: string }) => {
    // 書籍の存在を確認
    const booksQuery = query(
      collection(db, "books"),
      where("name", "==", book.title),
      where("userId", "==", auth.currentUser?.uid),
    );
    const querySnapshot = await getDocs(booksQuery);

    if (!querySnapshot.empty) {
      // 書籍がすでに存在する場合はエラーメッセージを表示
      toast({
        title: "この書籍はすでに登録されています。",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // 書籍に重複がない場合は新規登録を行う
    try {
      await addDoc(collection(db, "books"), {
        createdAt: serverTimestamp(),
        date: data.completedDate,
        img_url: book.image,
        name: book.title,
        pages: book.pageCount,
        userId: auth.currentUser?.uid,
      });
      onClose();
      toast({
        title: "書籍が追加されました。",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        title: "書籍の追加に失敗しました。",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold">{book.title}</h2>
        <form onSubmit={handleSubmit(handleAddBook)} className="mt-4">
          <label
            htmlFor="completedDate"
            className="block font-medium text-gray-700 ml-2"
          >
            読了日
          </label>
          <input
            type="date"
            {...register("completedDate", {
              required: "読了日を入力してください",
            })}
            className="mt-2 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none sm:text-sm"
          />
          {errors.completedDate && (
            <p className="text-red-500">{errors.completedDate.message}</p>
          )}
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-navy text-white font-bold rounded-full hover:bg-hover_button"
            >
              登録
            </button>
            <button
              onClick={onClose}
              type="button"
              className="ml-2 px-4 py-2 bg-gray-500 text-white font-bold rounded-full hover:bg-gray-400"
            >
              閉じる
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
