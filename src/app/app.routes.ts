import { Routes } from '@angular/router';
import { AddBookComponent } from '../components/add-book/add-book.component';
import { BookListComponent } from '../components/book-list/book-list.component';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { LoginComponent } from '../components/login/login.component';
import { BookInfoComponent } from '../components/book-info/book-info.component';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'book-list', component: BookListComponent },
  { path: 'book-info', component: BookInfoComponent },
  { path: 'add-book', canActivate: [authGuard], component: AddBookComponent },
  { path: '', redirectTo: 'book-list', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
