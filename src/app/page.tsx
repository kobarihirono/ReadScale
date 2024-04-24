import NextLink from "next/link";
import Image from "next/image";

export default function HomeScreen() {
  return (
    <div className="text-center p-4 lg:flex lg:justify-center lg:items-center my-16">
      <Image
        className="m-auto lg:m-0"
        src="/images/top.png"
        alt="bookshelf"
        width={500}
        height={500}
      />
      <div className="lg:flex lg:flex-col lg:justify-center">
        <p className="mt-4 leading-loose">
          読書という冒険を、
          <br />
          積み上げた本の高さで描く。
          <br />
          あなたの知識の城を築き上げる旅に出ませんか？
        </p>
        <div className="flex justify-center">
          <button className="bg-navy hover:bg-hover_button text-white w-40 font-bold py-2 px-8 rounded-full mt-6">
            <NextLink href="/signup">新規登録</NextLink>
          </button>
        </div>
        <p className="mb-10 mt-6">
          会員の方は
          <NextLink href="/signin" className="text-deepGreen font-bold text-md">
            こちら
          </NextLink>
          からログイン
        </p>
      </div>
    </div>
  );
}
