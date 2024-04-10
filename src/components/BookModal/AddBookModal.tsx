// components/AddBookModal/AddBookModal.tsx

import React from "react";
import BookModel from "./BookModal";
import { useToast } from "@/common/design";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import { Book } from "../../app/types/index";

interface AddBookModalProps {
  book: Book;
  onClose: () => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ book, onClose }) => {
  const toast = useToast();

  const handleAddBook = async (data: { completedDate: string }) => {
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
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        title: "エラー",
        description: "書籍の追加に失敗しました。",
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
        <BookModel onSubmit={handleAddBook} />
        <button
          onClick={onClose}
          type="button"
          className="ml-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default AddBookModal;
