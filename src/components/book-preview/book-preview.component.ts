import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Book } from '../../data/book';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../data/user';

@Component({
  selector: 'app-book-preview',
  standalone: true,
  imports: [],
  templateUrl: './book-preview.component.html',
  styleUrl: './book-preview.component.css'
})
export class BookPreviewComponent implements OnDestroy {

  @Input() book?: Book;

  @Output() removeBookClick: EventEmitter<string> = new EventEmitter();

  public user?: User;
  public componentDestroyed$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    const user = this.authenticationService.getUser();
    if (user) {
      this.user = {...user};
    }
    this.authenticationService.userSubject.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe({
      next: (user) => {
        this.user = user;
      }
    })
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  public clickedBook(): void {
    this.router.navigate(['/book-info', { id: this.book?.id }]);
  }

  public clickedRemoveBook(): void {
    this.removeBookClick.emit(this.book?.id);
  }
}
