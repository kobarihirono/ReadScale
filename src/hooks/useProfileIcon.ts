// hooks/useProfileIcon.ts

import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { User } from "@/types/index";

export function useProfileImage(user: User) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const uploadProfileImage = async (file: File) => {
    if (!user || !file) return;

    const storage = getStorage();
    const storageRef = ref(storage, `profileImages/${user.uid}/avatar.jpg`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);
    setProfileImageUrl(photoURL);
  };

  const loadProfileImage = async () => {
    if (!user) return;

    const storage = getStorage();
    const storageRef = ref(storage, `profileImages/${user.uid}/avatar.jpg`);
    try {
      const url = await getDownloadURL(storageRef);
      setProfileImageUrl(url);
    } catch (error) {
      console.error("Failed to load profile image", error);
      setProfileImageUrl("/icons/no-icon.png");
    }
  };

  return { profileImageUrl, uploadProfileImage, loadProfileImage };
}
