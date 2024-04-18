import { Book } from "../../../app/types/index";

type AppProps = { book: Book };
const BookItem = ({ book }: AppProps) => {
  return (
    <div className="border border-gray-300 rounded p-4 mt-5 mx-10 cursor-pointer">
      <div className="flex">
        <>
          {book.image ? (
            <img
              src={book.image}
              className="w-36 h-48 object-cover border border-gray-200 mr-4"
              alt="Book cover"
            />
          ) : (
            <img
              src="https://placehold.jp/150x200.png?text=NO IMAGE"
              alt="登録された画像はありません"
              className="w-36 h-48 object-cover border border-gray-200 mr-4"
            />
          )}
        </>
        <div className="flex flex-col">
          <div className="text-lg font-semibold">{book.title}</div>
          <div className="text-gray-600 mt-4">{book.pageCount}ページ</div>
          <div className="text-gray-600">
            出版日：{book.publishedDate ? book.publishedDate : "不明"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookItem;
