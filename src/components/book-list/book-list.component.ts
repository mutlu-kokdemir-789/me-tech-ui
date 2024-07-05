import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookPreviewComponent } from "../book-preview/book-preview.component";
import { BooksService } from '../../services/books.service';
import { Book } from '../../data/book';
import { Subject, takeUntil } from 'rxjs';
import { QueryParamsForBookListRequest } from '../../data/queryParams';
import { BookListResponse } from '../../data/bookListResponse';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-book-list',
    standalone: true,
    templateUrl: './book-list.component.html',
    styleUrl: './book-list.component.css',
    imports: [
      BookPreviewComponent,
      FormsModule,
      ReactiveFormsModule
    ]
})
export class BookListComponent implements OnInit, OnDestroy {

  public books?: Book[];
  public filterForm!: FormGroup;
  public query = {} as QueryParamsForBookListRequest;

  private componentDestroyed$ = new Subject<void>();

  constructor(
    private booksService: BooksService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.booksService.getBooksWithQuery(this.query)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (bookListResponse: BookListResponse) => {
          this.books = bookListResponse.books;
        },
        error: (err) => {
          console.error(err);
        }
      });
    this.filterForm = this.formBuilder.group({
      priceMin: [''],
      priceMax: [''],
      rateMin: [''],
      rateMax: ['']
    });
  }

  public clickedSubmitFilterApply(event: SubmitEvent): void {
    const minPrice = isNaN(Number(this.filterForm.value['priceMin'])) ? 0 : Number(this.filterForm.value['priceMin']);
    const maxPrice = isNaN(Number(this.filterForm.value['priceMax'])) ? undefined : Number(this.filterForm.value['priceMax']) === 0 ? undefined : Number(this.filterForm.value['priceMax']);
    const rateMin = isNaN(Number(this.filterForm.value['rateMin'])) ? undefined : Number(this.filterForm.value['rateMin']) === 0 ? undefined : Number(this.filterForm.value['rateMin']);
    const rateMax = isNaN(Number(this.filterForm.value['rateMax'])) ? undefined : Number(this.filterForm.value['rateMax']) === 0 ? undefined : Number(this.filterForm.value['rateMax']);
    this.query = {
      filter: {
        priceMax: maxPrice,
        priceMin: minPrice,
        rateMax: rateMax,
        rateMin: rateMin
      },
      pageNumber: 1,
    } as QueryParamsForBookListRequest;

    this.booksService.getBooksWithQuery(this.query).pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (bookListResponse: BookListResponse) => {
          this.books = bookListResponse.books;
        },
        error: (err) => {console.error(err)}
      })
  }

  public sortPriceAsc(): void {
    this.query = {...this.query, sort: 'Price - Asc'}
    this.makeBookListRequest();
  }

  public sortPriceDesc(): void {
    this.query = {...this.query, sort: 'Price - Desc'}
    this.makeBookListRequest();
  }

  public sortPubAsc(): void {
    this.query = {...this.query, sort: 'Publishing Year - Asc'}
    this.makeBookListRequest();
  }

  public sortPubDesc(): void {
    this.query = {...this.query, sort: 'Publishing Year - Desc'}
    this.makeBookListRequest();
  }

  public sortRateAsc(): void {
    this.query = {...this.query, sort: 'Rate - Asc'}
    this.makeBookListRequest();
  }

  public sortRateDesc(): void {
    this.query = {...this.query, sort: 'Rate - Desc'}
    this.makeBookListRequest();
  }

  public makeBookListRequest(): void {
    this.booksService.getBooksWithQuery(this.query).pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (bookListResponse: BookListResponse) => {
        this.books = bookListResponse.books;
      },
      error: (err) => {console.error(err)}
    })
  }

  public clickedRemoveBook(bookId: string): void {
    this.booksService.removeBook(bookId).pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: () => {
          this.booksService.getBooksWithQuery({} as QueryParamsForBookListRequest).pipe(takeUntil(this.componentDestroyed$))
            .subscribe({
              next: (bookListResponse: BookListResponse) => {
                this.books = bookListResponse?.books;
              },
              error: (err) => {console.error(err)}
            })
        },
        error: (err) => {console.error(err)}
      });
  }
}
