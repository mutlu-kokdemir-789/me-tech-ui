import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Book } from '../../data/book';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../data/user';
import { BooksService } from '../../services/books.service';
import { Subject, takeUntil } from 'rxjs';
import { BookAddRequest } from '../../data/bookAddRequest';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css'
})
export class AddBookComponent implements OnDestroy {
  public addBookForm!: FormGroup;
  public user?: User;

  public componentDestroyed$ = new Subject<void>();

  constructor(
    private authenticationService: AuthenticationService,
    private bookService: BooksService,
    private formBuilder: FormBuilder
  ) {
    this.user = this.authenticationService.getUser();
    this.addBookForm = this.formBuilder.group({
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

  public submitAddBook(event: SubmitEvent): void {
    event.preventDefault();
    const currentTarget = (event as any).currentTarget;
    if (this.addBookForm.invalid) {
      currentTarget.classList.add('was-validated');
      return;
    }
    // action for adding book
    currentTarget.classList.remove('was-validated');
    const pubYearNum = Number(this.addBookForm.value['publishingYear']);
    const priceNum = Number(this.addBookForm.value['price']);
    const pubYear = isNaN(pubYearNum) ? undefined : pubYearNum;
    const price = isNaN(priceNum) ? undefined : priceNum;
    const book = {
      title: this.addBookForm.value['title'],
      author: this.addBookForm.value['author'],
      publishingYear: pubYear,
      price: price
    } as BookAddRequest;
    this.bookService.addBook(book).pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: () => {console.log("Book was added.")},
        error: (err) => {console.error(err)}
      });
  }
}
