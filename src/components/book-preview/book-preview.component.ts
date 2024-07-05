import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../../data/book';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-book-preview',
  standalone: true,
  imports: [],
  templateUrl: './book-preview.component.html',
  styleUrl: './book-preview.component.css'
})
export class BookPreviewComponent {

  @Input() book?: Book;

  @Output() removeBookClick: EventEmitter<string> = new EventEmitter();

  public isAdmin = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    this.isAdmin = this.authenticationService.getUser()?.role === 'Admin';
  }

  public clickedBook(): void {
    this.router.navigate(['/book-info', { id: this.book?.id }]);
  }

  public clickedRemoveBook(): void {
    this.removeBookClick.emit(this.book?.id);
  }
}
