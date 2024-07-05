import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { Book } from '../../data/book';
import { Subject, takeUntil } from 'rxjs';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../data/user';



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
  public comments: string [] = [
    'iyi',
    'fena degil'
  ];

  public commentAndRateForm!: FormGroup;
  public bookId?: string;
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
        this.user = user ? {...user} : undefined;
      }
    });
    this.commentAndRateForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      publishingYear: ['', Validators.required],
      price: ['', Validators.required]
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
              next: (book?: Book) => {
                this.book = book;
              }
            })
          }
        }
      });
  }
}
