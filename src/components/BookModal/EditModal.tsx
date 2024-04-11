// components/EditBookModal/EditBookModal.tsx

import React from "react";
import BookModal from "../BookModal/BookModal";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useToast } from "@/common/design";
import { Book } from "../../app/types/index";

interface EditBookModalProps {
  bookId: string;
  currentCompletedDate: string;
  onClose: () => void;
  onBookUpdate: (updatedBook: Book) => void;
}

const EditBookModal: React.FC<EditBookModalProps> = ({
  bookId,
  currentCompletedDate,
  onClose,
}) => {
  const toast = useToast();

  const handleEditBook = async (data: { completedDate: string }) => {
    try {
      const bookDocRef = doc(db, "books", bookId);
      await updateDoc(bookDocRef, {
        date: data.completedDate,
      });

      onClose();
    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        title: "エラー",
        description: "書籍の更新に失敗しました。",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <BookModal
          defaultCompletedDate={currentCompletedDate}
          onSubmit={handleEditBook}
        />
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

export default EditBookModal;
