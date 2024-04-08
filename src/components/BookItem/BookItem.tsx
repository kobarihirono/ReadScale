import { Book } from "../../app/types/index";

type AppProps = { book: Book };
const BookItem = ({ book }: AppProps) => {

  return (
    <div>
      <>{book.image ? <img src={book.image} /> : <div>No Image</div>}</>
      <div>
        <div>{book.title}</div>
        <div>{book.pageCount}ページ</div>
        <div>出版日：{book.publishedDate}</div>
      </div>
    </div>
  );
};

export default BookItem;
