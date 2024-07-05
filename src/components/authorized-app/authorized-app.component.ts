import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authorized-app',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './authorized-app.component.html',
  styleUrl: './authorized-app.component.css'
})
export class AuthorizedAppComponent {

  isAdmin = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  public clickedAddBook(): void {
    this.router.navigate(['add-book'], { relativeTo: this.route });
  }

  public clickedHome(): void {
    this.router.navigate(['book-list'], { relativeTo: this.route });
  }
}
