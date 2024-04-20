// src/lib/firebase/apis/book.ts

import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Book, User } from "@/types";
import { formatDate } from "@/utils/index";

export const fetchBooks = async (): Promise<Book[]> => {
  const q = query(collection(db, "books"));
  const querySnapshot = await getDocs(q);
  const books = querySnapshot.docs
    .map((doc) => {
      const data = doc.data() as Book;
      return {
        ...data,
        id: doc.id,
        date: formatDate(data.date),
        createdAt: formatDate(data.createdAt),
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return books;
};

export const fetchUsers = async (
  books: Book[],
): Promise<{ [key: string]: User }> => {
  const users: { [key: string]: User } = {};
  const storage = getStorage();

  for (const book of books) {
    if (!users[book.userId]) {
      const userDocRef = doc(db, "users", book.userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as any; // Adjust type casting as needed
        const photoRef = ref(
          storage,
          `profileImages/${book.userId}/avatar.jpg`,
        );
        const photoURL = await getDownloadURL(photoRef).catch(
          () => "/icons/no-icon.png",
        );
        users[book.userId] = {
          uid: book.userId,
          displayName: userData.username || "未設定",
          photoURL,
        };
      } else {
        users[book.userId] = {
          uid: book.userId,
          displayName: "未設定",
          photoURL: "/icons/no-icon.png",
        };
      }
    }
  }

  return users;
};
