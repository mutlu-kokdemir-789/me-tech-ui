import { Book } from "./book";
import { CommentResponseForBookDetails } from "./commentResponseForBookDetails";

export interface BookDetailsResponse {
    book: Book;
    comments: CommentResponseForBookDetails[];
}
