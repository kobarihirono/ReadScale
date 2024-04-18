// src/components/UserProfile.tsx
import React from "react";
import Image from "next/image";

type UserIconProps = {
  profileImageUrl: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const UserIcon: React.FC<UserIconProps> = ({
  profileImageUrl,
  onImageUpload,
}) => {
  return (
    <div className="flex justify-center items-center relative bg-navy pt-6">
      <div className="relative w-1/3 aspect-square">
        {profileImageUrl && (
          <img
            className="rounded-full w-full h-full object-cover shadow-lg border-2 border-gray-300"
            src={profileImageUrl}
            alt="Profile Image"
          />
        )}
        <label
          htmlFor="file-upload"
          className="cursor-pointer absolute right-2 bottom-2 w-3/12"
        >
          <Image src="/icons/add.png" width={45} height={45} alt="Upload" />
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UserIcon;
