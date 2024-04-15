import React from "react";
import Image from "next/image";
import Link from "next/link";

const Contact = () => {
  return (
    <div className="max-w-4xl w-10/12 px-4 py-14 m-auto">
      <h1 className="text-xl font-bold">お問い合わせ</h1>
      <p className="mt-8 text-gray-600">
        サービスについて不具合、ご要望がある際には以下連絡先にご連絡ください。
      </p>
      <p className="mt-8 text-gray-600">
        メールアドレスをクリックすると、メールアプリが起動します。そのまま必要事項をご記入の上、送信してください。
      </p>
      <a
        href="mailto:k.hirono0127@gmail.com?subject=ReadScale%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%E3%81%AE%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B&body=%E4%BB%A5%E4%B8%8B%E3%81%AE%E5%86%85%E5%AE%B9%E3%82%92%E3%81%94%E8%A8%98%E5%85%A5%E3%81%AE%E4%B8%8A%E3%80%81%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82%0A1.%20%E3%81%8A%E5%90%8D%E5%89%8D%0A2.%20%E3%83%A1%E3%83%BC%E3%83%AB%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%0A3.%20%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B%E5%86%85%E5%AE%B9"
        className="block mt-6 text-blue-600 underline"
      >
        k.hirono0127@gmail.com
      </a>
      <div className="flex md:justify-start mt-14 justify-center">
        <Link
          className="bg-navy text-white font-bold rounded-full py-2 px-8"
          href="/"
        >
          トップへ戻る
        </Link>
      </div>

      <div className="flex md:justify-end justify-center mt-10">
        <div className="md:w-6/12">
          <Image
            className=""
            src="/images/contact.png"
            layout="responsive"
            height={400}
            width={400}
            alt="男の子と女の子が一緒に本を読んでいる画像"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
