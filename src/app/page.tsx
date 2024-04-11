import NextLink from "next/link";
import Image from "next/image";

export default function HomeScreen() {
  return (
    <div className="text-center p-4">
      {/* 画像が読み込めない */}
      {/* <Image src="/images/top.png" alt="bookshelf" width={150} height={150} /> */}
      <p className="mb-4">
        読書という冒険を、
        <br />
        積み上げた本の高さで描く。
        <br />
        あなたの知識の城を築き上げる旅に出ませんか？
      </p>
      <button className="bg-navy hover:bg-hover_button text-white font-bold py-2 px-8 rounded-full mb-4">
        <NextLink href="/signup">新規登録</NextLink>
      </button>
      <p className="mb-4">
        会員の方は
        <NextLink href="/signin" className="text-deepGreen font-bold text-md">
          こちら
        </NextLink>
        からログイン
      </p>
    </div>
  );
}
