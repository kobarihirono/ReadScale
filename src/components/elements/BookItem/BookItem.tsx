import { Book } from "../../../types/index";

type AppProps = { book: Book };
const BookItem = ({ book }: AppProps) => {
  const displayTitle =
    book.title.length > 30 ? book.title.substring(0, 30) + "..." : book.title;

  return (
    <div className="border border-gray-300 rounded p-4 mt-2 mx-2 cursor-pointer">
      <div className="flex">
        <div className="flex-shrink-0">
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
        </div>
        <div className="flex flex-col">
          <div className="text-lg font-semibold">{displayTitle}</div>
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
