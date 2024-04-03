// lib/firebase/apis/user.ts

import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

/**
 * ユーザーIDに基づいてユーザー情報を取得
 * @param uid ユーザーID
 */

export const getUserInfo = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    // ユーザー情報が見つからない場合
    console.error("ユーザーが見つかりません");
    return null;
  }
};
