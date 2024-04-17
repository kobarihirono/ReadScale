import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Book } from "../app/types/index";

export function useBooks(user) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (user) {
      const fetchBooks = async () => {
        const q = query(
          collection(db, "books"),
          where("userId", "==", user.uid),
        );
        const querySnapshot = await getDocs(q);
        const userBooks = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Book),
          id: doc.id,
        }));
        setBooks(userBooks);
      };

      fetchBooks();
    }
  }, [user]);

  const deleteBook = async (bookId: string) => {
    const bookDocRef = doc(db, "books", bookId);
    await deleteDoc(bookDocRef);
    const updatedBooks = books.filter((book) => book.id !== bookId);
    setBooks(updatedBooks);
  };

  return { books, setBooks, deleteBook };
}
