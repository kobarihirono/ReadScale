// src/app/Header.tsx

"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/lib/firebase/hooks/useAuth";
import { logout } from "@/lib/firebase/apis/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;
  const router = useRouter();

  const handleMenuOpen = () => {
    setOpen(!isOpen);
  };

  const handleMenuClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      router.push('/signin');
      handleMenuClose();
    } else {
      alert('ログアウトに失敗しました。');
    }
  };

  if (!userId) return (
    <header className="py-5 px-10 bg-navy flex justify-center items-center">
      <div>
        <h1 className="text-2xl text-white font-extrabold">Read Scale</h1>
      </div>
    </header>
  
  );

  return (
    <header className="py-5 px-10 bg-navy border-b flex justify-between items-center">
      {/* ハンバーガーナビゲーション */}
      <button className="z-50 space-y-1.5 md:hidden" onClick={handleMenuOpen}>
        <span
          className={
            isOpen
              ? "block w-6 h-0.5 bg-white translate-y-2 rotate-45 duration-300"
              : "block w-6 h-0.5 bg-white duration-300"
          }
        />
        <span
          className={
            isOpen
              ? "block opacity-0 duration-300"
              : "block w-6 h-0.5 bg-white duration-300"
          }
        />
        <span
          className={
            isOpen
              ? "block w-6 h-0.5 bg-white -rotate-45 duration-300"
              : "block w-6 h-0.5 bg-white duration-300"
          }
        />
      </button>
      <nav
        className={
          isOpen
            ? "z-40 bg-navy fixed top-0 right-0 bottom-0 left-0 h-screen flex flex-col"
            : "fixed right-[-100%] md:right-4"
        }
      >
        <ul
          className={
            isOpen
              ? "flex h-screen justify-center items-center flex-col gap-6 text-xl font-bold text-white"
              : "block md:flex md:gap-8 font-bold text-white pr-6"
          }
        >
          <li>
            <Link onClick={handleMenuClose} href="/about">
              タイムライン
            </Link>
          </li>
          <li>
            <Link onClick={handleMenuClose} href={`/mypage/${userId}`}>
              マイページ
            </Link>
          </li>
          <li>
            <Link onClick={handleMenuClose} href="/search">
              書籍検索
            </Link>
          </li>
          <li>
            <button onClick={handleLogout}>
              ログアウト
            </button>
          </li>
        </ul>
      </nav>

      <div>
        <h1 className="text-2xl text-white font-extrabold">Read Scale</h1>
      </div>
      <div className="md:hidden">
        <Link href={`/mypage/${userId}`} passHref>
          <Image
            src="/icons/my-page.png"
            width={20}
            height={20}
            alt="マイページに遷移するアイコン"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
