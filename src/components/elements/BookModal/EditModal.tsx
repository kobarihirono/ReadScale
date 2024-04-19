// components/EditBookModal/EditBookModal.tsx

import React from "react";
import { useForm } from "react-hook-form";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useToast } from "@/common/design";
import { Book } from "../../../app/types/index";

interface EditBookModalProps {
  bookId: string;
  currentCompletedDate: string;
  onClose: () => void;
  onBookUpdate: (updatedBook: Partial<Book>) => void;
}

interface BookFormData {
  completedDate: string;
}

const EditBookModal: React.FC<EditBookModalProps> = ({
  bookId,
  currentCompletedDate,
  onClose,
  onBookUpdate,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    defaultValues: {
      completedDate: currentCompletedDate,
    },
  });

  const toast = useToast();

  const onSubmit = async (data: BookFormData) => {
    try {
      const bookDocRef = doc(db, "books", bookId);
      await updateDoc(bookDocRef, {
        completedDate: data.completedDate,
      });

      // 更新された書籍情報をマイページに渡す
      onBookUpdate({
        id: bookId,
        date: data.completedDate,
      });

      toast({
        title: "更新が完了しました。",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        title: "更新に失敗しました。",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
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
              className="px-4 py-2 bg-teal-600 text-white font-bold rounded-full hover:bg-teal-500 ml-2"
            >
              更新
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

export default EditBookModal;
