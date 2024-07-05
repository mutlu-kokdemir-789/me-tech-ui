import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Book } from '../../data/book';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../data/user';

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
export class AddBookComponent implements OnInit {
  public addBookForm!: FormGroup;
  public book!: Book;
  public user?: User;

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {
    this.user = this.authenticationService.getUser();
    this.book = {
      title: '',
      author: '',
    } as Book;
    this.addBookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      publishingYear: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  ngOnInit(): void {
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
  }
}
