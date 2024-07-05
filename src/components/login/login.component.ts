import { Component, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../data/user';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {

  public loginForm!: FormGroup;
  public signupForm!: FormGroup;
  public user: User = {
    name: '',
    email: '',
    password: '',
    role: ''
  } as User;
  public email = '';
  public password = '';

  private componentDestroyed$ = new Subject<void>();

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email1: ['', Validators.required],
      password1: ['', Validators.required]
    });
    this.signupForm = this.formBuilder.group({
      name2: ['', Validators.required],
      email2: ['', Validators.required],
      password2: ['', Validators.required],
      role2: ['User' , Validators.required]
    });
  }

  public submittedForLogin(event: SubmitEvent): void {
    event.preventDefault();
    // duplicate code
    const currentTarget = (event as any).currentTarget;
    if (this.loginForm.invalid) {
      currentTarget.classList.add('was-validated');
      return;
    }
    this.login();
    currentTarget.classList.remove('was-validated');
    this.resetLoginInfos();
    return;
  }

  public submittedForSignup(event: SubmitEvent): void {
    event.preventDefault();
    const currentTarget = (event as any).currentTarget;
    if (this.signupForm.invalid) {
      currentTarget.classList.add('was-validated');
      return;
    }
    this.signup();
    currentTarget.classList.remove('was-validated');
    this.resetUser();
    return;
  }

  // public clickedSignup(event: SubmitEvent): void {
  //   event.preventDefault();
  //   this.signup();
  //   this.resetUser();
  //   return;
  // }

  public login(): void {
    const hashedPswd = this.getHashedPassword(this.password);
    this.authenticationService.login({email: this.email, password: hashedPswd});
    this.authenticationService.loginSubject.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe({
      next: (isLoggedIn) => {
        const lastPage = localStorage.getItem('lastPage');
        this.router.navigate([lastPage ? lastPage : '../book-list'], { relativeTo: this.route });

      },
      error: (err) => {

      }
    });
  }

  public signup(): void {
    this.user.password = this.getHashedPassword(this.user.password);
    this.authenticationService.signup(this.user);
    this.authenticationService.signupSubject.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe({
      next: (isSignedUp) => {
        const sup = isSignedUp;
      },
      error: (err) => {

      }
    });
  }

  private getHashedPassword(password: string): string {
    // return shajs('sha256').update(password).digest('hex');
    let hash = 0;
    if (password.length == 0)
      return `${hash}`;

    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    return `${hash}`;
  }

  private resetUser(): void {
    this.user = {
      id: '',
      name: '',
      email: '',
      password: '',
      role: ''
    } as User;
  }

  private resetLoginInfos(): void {
    this.email = '';
    this.password = '';
  }
}
