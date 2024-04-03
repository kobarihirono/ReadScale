// lib/firebase/apis/auth.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

import { auth, db } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";

/** firebaseの処理結果 */
export type FirebaseResult = {
  isSuccess: boolean;
  message: string;
};

/** firebaseのエラー */
type FirebaseError = {
  code: string;
  message: string;
  name: string;
};

const isFirebaseError = (e: Error): e is FirebaseError => {
  return "code" in e && "message" in e;
};

/**
 * EmailとPasswordでサインイン
 * @param email
 * @param password
 * @returns Promise<FirebaseResult>
 */

export const signInWithEmail = async (args: {
  email: string;
  password: string;
}): Promise<FirebaseResult> => {
  let result: FirebaseResult = { isSuccess: false, message: "" };
  try {
    const user = await signInWithEmailAndPassword(
      auth,
      args.email,
      args.password,
    );

    if (user) {
      result = { isSuccess: true, message: "ログインに成功しました" };
    }
  } catch (error) {
    if (
      error instanceof Error &&
      isFirebaseError(error) &&
      error.code === "auth/user-not-found"
    ) {
      result = { isSuccess: false, message: "ユーザが見つかりませんでした" };
    } else if (
      error instanceof Error &&
      isFirebaseError(error) &&
      error.code === "auth/wrong-password"
    ) {
      result = { isSuccess: false, message: "パスワードが間違っています" };
    } else {
      result = { isSuccess: false, message: "ログインに失敗しました" };
    }
  }
  return result;
};

/**
 * EmailとPasswordでサインアップ
 * @param username
 * @param email
 * @param password
 * @returns Promise<FirebaseResult>
 */

export const signUpWithEmail = async (args: {
  email: string;
  password: string;
  username: string;
}): Promise<FirebaseResult> => {
  let result: FirebaseResult = { isSuccess: false, message: "" };

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      args.email,
      args.password,
    );

    // 成功した場合、Firebase AuthenticationにユーザーのdisplayNameを設定
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: args.username,
      });

      const colRef = doc(db, "users", userCredential.user.uid);
      await setDoc(colRef, {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        username: args.username, // Firestoreにも保存
      });

      result = { isSuccess: true, message: "新規登録に成功しました" };
    }
  } catch (error) {
    if (
      error instanceof Error &&
      isFirebaseError(error) &&
      error.code === "auth/email-already-in-use"
    ) {
      result = {
        isSuccess: false,
        message: "メールアドレスが既に使用されています",
      };
    } else {
      result = { isSuccess: false, message: "新規登録に失敗しました" };
      console.log(error);
    }
  }

  return result;
};

/**
 * ログアウト処理
 * @returns Promise<FirebaseResult>
 */
export const logout = async (): Promise<FirebaseResult> => {
  let result: FirebaseResult = { isSuccess: false, message: "" };

  await signOut(auth)
    .then(() => {
      result = { isSuccess: true, message: "ログアウトしました" };
    })
    .catch((error) => {
      result = { isSuccess: false, message: error.message };
    });

  return result;
};

/**
 * ユーザーにパスワードリセット用のメールを送信
 * @param email ユーザーのメールアドレス
 */

export const sendPasswordReset = async (
  email: string,
): Promise<FirebaseResult> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      isSuccess: true,
      message: "パスワードリセットメールを送信しました",
    };
  } catch (error) {
    return { isSuccess: false, message: "メール送信に失敗しました" };
  }
};
