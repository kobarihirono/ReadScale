"use client";

import Link from "next/link";
import React from "react";
import { useAuth } from "@/lib/firebase/hooks/useAuth";
import Image from "next/image";

const Header = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  if (!userId) return null;

  return (
    <header className="py-5 px-10 bg-navy border-b flex justify-between items-center">
      <div>
        <h1 className="text-2xl text-white font-extrabold">Read Scale</h1>
      </div>
      <div>
        <nav className="text-sm font-medium">
          <Link href={`/mypage/${userId}`} passHref>
            <Image
              src="/icons/my-page.png"
              width={20}
              height={20}
              alt="マイページに遷移するアイコン"
            />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
