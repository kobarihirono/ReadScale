import { Book } from "../../app/types/index";

type AppProps = { book: Book };
const BookItem = ({ book }: AppProps) => {
  console.log(book.image);

  return (
    <div>
      <>{book.image ? <img src={book.image} /> : <div>No Image</div>}</>
      <div>
        <div>{book.title}</div>
        <div>
          {(book.categories || []).map((category) => {
            return <div key={category}>{category}</div>;
          })}
        </div>
      </div>
      <div>
        <div>{book.description}</div>
      </div>
    </div>
  );
};

export default BookItem;
