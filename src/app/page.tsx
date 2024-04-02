import NextLink from "next/link";

export default function HomeScreen() {
  return (
    <div>
      <p>トップページ</p>
      <NextLink href="/signin">サインインページへ</NextLink>
    </div>
  );
}
