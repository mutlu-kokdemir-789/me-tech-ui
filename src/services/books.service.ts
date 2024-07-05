import { Injectable } from '@angular/core';
import { Book } from '../data/book';
import books from '../data/temp-data/books';
import { Observable, of } from 'rxjs';
import { QueryParamsForBookListRequest } from '../data/queryParams';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { BookListResponse } from '../data/bookListResponse';
import { BookDetailsResponse } from '../data/bookDetailsResponse';

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
  ): Observable<BookListResponse> {
    return this.httpClient.post<BookListResponse>(`${this.requestEndpoint}`, { body: queryParams });
  }

  public getBookDetails(id: string): Observable<BookDetailsResponse> {
    return this.httpClient.get<BookDetailsResponse>(`${this.requestEndpoint}/Id?id=${id}`);
  }

  public removeBook(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.requestEndpoint}/Id?id=${id}`, { headers: this.authService.getHeaders() });
  }
}
