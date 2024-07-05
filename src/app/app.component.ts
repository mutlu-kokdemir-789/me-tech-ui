import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet, RouterModule } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../data/user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isAdmin = false;
  public isUserLoggedIn = false;
  user?: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    const user = this.authenticationService.getUser();
    if (user) {
      this.user = {...user}
      this.isUserLoggedIn = true;
    }
    this.authenticationService.userSubject.subscribe({
      next: (user) => {
        this.user = user;
        this.isUserLoggedIn = this.user ? true : false;
        this.isAdmin = this.user?.role === 'Admin';
      }
    });
  }

  public clickedAddBook(): void {
    this.router.navigate(['add-book'], { relativeTo: this.route });
  }

  public clickedHome(): void {
    this.router.navigate(['book-list'], { relativeTo: this.route });
  }

  public clicekdLoginLogout(): void {
    this.isUserLoggedIn ? this.logout() : this.router.navigate(['login']);
  }

  private logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }
}
