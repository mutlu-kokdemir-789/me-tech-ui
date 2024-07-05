import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookPreviewComponent } from "../book-preview/book-preview.component";
import { BooksService } from '../../services/books.service';
import { Book } from '../../data/book';
import { Subject, catchError, concat, finalize, last, takeUntil } from 'rxjs';
import { QueryParamsForBookListRequest } from '../../data/queryParams';
import { BookListResponse } from '../../data/bookListResponse';

@Component({
    selector: 'app-book-list',
    standalone: true,
    templateUrl: './book-list.component.html',
    styleUrl: './book-list.component.css',
    imports: [BookPreviewComponent]
})
export class BookListComponent implements OnInit, OnDestroy {

  public books?: Book[];

  private componentDestroyed$ = new Subject<void>();

  constructor(
    private booksService: BooksService
  ) {}

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.booksService.getBooksWithQuery({} as QueryParamsForBookListRequest)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (bookListResponse: BookListResponse) => {
          this.books = bookListResponse.books;

        },
        error: (err) => {
          console.error(err);
        }
      })
  }

  public clickedRemoveBook(bookId: string): void {
    concat(
      this.booksService.removeBook(bookId),
      this.booksService.getBooksWithQuery({} as QueryParamsForBookListRequest)
    ).pipe(last()).subscribe({
      next: (bookListResponse) => {
        this.books = bookListResponse?.books;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
}
