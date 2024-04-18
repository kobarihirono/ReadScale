import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="inset-x-0 py-2 px-10 border-t">
      <div className="flex justify-between pt-4">
        <h1 className="text-2xl text-mainFont font-extrabold">Read Scale</h1>
        <nav>
          <Link className="block" href="/terms">
            利用規約
          </Link>
          <Link className="block" href="/contact">
            お問い合わせ
          </Link>
        </nav>
      </div>
      <small className="block text-center mt-6 mb-2">
        &copy; 2024 hirono kobari. All Rights Reserved.
      </small>
    </footer>
  );
};

export default Footer;
