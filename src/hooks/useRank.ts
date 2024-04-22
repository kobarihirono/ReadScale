// src/hooks/useRank.ts

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { thresholds, heightPerBookPage } from "@/const/index";
import { Book } from "../types/index";

const useRankManagement = (userId: string | undefined, books: Book[]) => {
  const [currentRankName, setCurrentRankName] = useState<string>("");
  const [showThresholdModal, setShowThresholdModal] = useState<boolean>(false);
  const [totalHeight, setTotalHeight] = useState<number>(0);
  const [lastThreshold, setLastThreshold] = useState<number>(0);

  useEffect(() => {
    if (!userId) return; // userIdがundefinedの場合は処理を実行しない

    const calculateTotalHeight = () => books.reduce((sum, book) => sum + book.pages, 0) * heightPerBookPage;

    const updateRank = async () => {
      const newTotalHeight = calculateTotalHeight();
      setTotalHeight(newTotalHeight);

      const latestRank = thresholds
        .slice()
        .reverse()
        .find(threshold => newTotalHeight >= threshold.limit);
      
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists() && latestRank && latestRank.name !== docSnap.data().rank) {
        await setDoc(userRef, { rank: latestRank.name }, { merge: true });
        setCurrentRankName(latestRank.name);
        setLastThreshold(latestRank.limit);
        setShowThresholdModal(true);
      } else {
        setShowThresholdModal(false);
      }
    };

    updateRank();
  }, [userId, books]);

  const closeModal = () => {
    setShowThresholdModal(false);
  };

  return { currentRankName, showThresholdModal, totalHeight, lastThreshold, closeModal };
};

export default useRankManagement;
