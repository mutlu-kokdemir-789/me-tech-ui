import { Injectable } from '@angular/core';
import { Book } from '../data/book';
import books from '../data/temp-data/books';
import { Observable, of } from 'rxjs';
import { QueryParamsForBookListRequest } from '../data/queryParams';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private requestEndpoint = 'https://localhost:7292/api/Books';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthenticationService
  ) { }

  public getBooks(): Observable<Book[]> {
    return of(books);
  }

  public getBooksWithQuery(
    queryParams: QueryParamsForBookListRequest
  ): Observable<Book[]> {
    return of(books);
  }

  public getBookDetails(id: string): Observable<Book | undefined> {
    return of(books.find(book => book.id === id));
  }

  public removeBook(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.requestEndpoint}/${id}`, { headers: this.authService.getHeaders() });
  }
}
