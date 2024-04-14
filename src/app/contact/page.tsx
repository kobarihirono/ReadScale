import React from "react";
import Image from "next/image";

const Contact = () => {
  return (
    <div className="max-w-4xl w-10/12 px-4 py-14 m-auto">
      <h1 className="text-xl font-bold">お問い合わせ</h1>
      <p className="mt-8 text-gray-600">サービスについて不具合、ご要望がある際には以下メールアドレス宛にご連絡ください。</p>
      <address className="mt-6 text-blue-600 underline">k.hirono0127@gmail.com</address>
      <div className="flex md:justify-end justify-center mt-10">
      <div className="md:w-6/12">
        <Image className="" src="/images/contact.png" layout="responsive" height={400} width={400} alt="男の子と女の子が一緒に本を読んでいる画像" />
      </div>
      </div>
    </div>
  );
};

export default Contact;
