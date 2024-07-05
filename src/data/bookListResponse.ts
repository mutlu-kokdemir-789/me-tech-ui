import { Book } from "./book";

export interface BookListResponse {
  numberOfBooks: number;
  books: Book[];
}
