import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { Book } from '../../data/book';
import { Subject, takeUntil } from 'rxjs';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../data/user';
import { BookDetailsResponse } from '../../data/bookDetailsResponse';
import { CommentResponseForBookDetails } from '../../data/commentResponseForBookDetails';
import { CommentAndRateRequestData } from '../../data/commentAndRateRequestData';
import { BookUpdateRequest } from '../../data/bookUpdateRequest';



@Component({
  selector: 'app-book-info',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './book-info.component.html',
  styleUrl: './book-info.component.css'
})
export class BookInfoComponent implements OnInit, OnDestroy {
  public commentResponseForBookDetails?: CommentResponseForBookDetails[];

  public commentAndRateForm!: FormGroup;
  public updateForm!: FormGroup;
  public bookId!: string;
  public book?: Book;
  public user?: User;

  private componentDestroyed$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService
  ) {
    const user = this.authService.getUser();
    if (user) {
      this.user = {...user}
    }
    this.authService.userSubject.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe({
      next: (user) => {
        this.user = user;
      }
    });
    this.commentAndRateForm = this.formBuilder.group({
      comment: [''],
      rate: []
    });
    this.updateForm = this.formBuilder.group({
      title: [''],
      author: [''],
      publishingYear: [],
      price: []
    });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
      this.route.params.pipe(
        takeUntil(this.componentDestroyed$)
      ).subscribe({
        next: (params: Params) => {
          this.bookId = params['id'];
          if (this.bookId){
            this.booksService.getBookDetails(this.bookId).subscribe({
              next: (bookDetailsResponse: BookDetailsResponse) => {
                this.book = bookDetailsResponse.book;
                this.commentResponseForBookDetails = bookDetailsResponse.comments;
              },
              error: (err) => {console.error(err)}
            })
          }
        },
        error: (err) => {console.error(err)}
      });
  }

  public clickedSubmitCommentAndRate(event: SubmitEvent): void {
    event.preventDefault();
    if (this.commentAndRateForm.value['comment']) {
      const req = {
        bookId: this.bookId,
        userId: this.user?.id,
        comment: this.commentAndRateForm.value['comment']
      } as CommentAndRateRequestData;
      if (!isNaN(Number(this.commentAndRateForm.value['rate']))) {
        req.rate = Number(this.commentAndRateForm.value['rate']);
      }
      this.booksService.commentAndRate(req).pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: () => {
            this.booksService.getBookDetails(this.bookId).pipe(takeUntil(this.componentDestroyed$))
              .subscribe({
                next: (bookDetailsResponse: BookDetailsResponse) => {
                  this.book = bookDetailsResponse.book;
                  this.commentResponseForBookDetails = bookDetailsResponse.comments;
                },
                error: (err) => {console.error(err)}
              })
          },
          error: (err) => {console.error(err)}
        });
    }
  }

  public clickedSubmitUpdate(event: SubmitEvent): void {
    event.preventDefault();
    const abc = event;
    const currentTarget = (event as any).currentTarget;
    if (
      this.updateForm.value['title'] ||
      this.updateForm.value['author'] ||
      !isNaN(Number(this.updateForm.value['publishingYear'])) ||
      !isNaN(Number(this.updateForm.value['price']))
      ) {
        const title = this.updateForm.value['title'];
        const author = this.updateForm.value['author'];
        const publishNum = Number(this.updateForm.value['publishingYear']);
        const priceNum = Number(this.updateForm.value['price']);
        const publishingYear = !isNaN(publishNum) ? publishNum !== 0 ? publishNum : undefined : undefined;
        const price = !isNaN(priceNum) ? priceNum !== 0 ? priceNum : undefined : undefined;
      const bookReq = {
        id: this.bookId,
        title: title ? title : undefined,
        author: author ? author : undefined,
        publishingYear: publishingYear,
        price: price
      } as BookUpdateRequest;

      this.booksService.updateBook(bookReq).pipe(takeUntil(this.componentDestroyed$)).subscribe({
        next: () => {
          this.booksService.getBookDetails(this.bookId).pipe(takeUntil(this.componentDestroyed$)).subscribe({
            next: (bookDetailsResponse: BookDetailsResponse) => {
              this.book = bookDetailsResponse.book;
              this.commentResponseForBookDetails = bookDetailsResponse.comments;
            },
            error: (err) => {console.error(err)}
          })
        },
        error: (err) => {console.error(err)}
      })
    }
  }
}
