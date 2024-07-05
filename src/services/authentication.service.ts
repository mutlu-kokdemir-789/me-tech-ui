import { User } from './../data/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LoginModel } from '../data/loginModel';
import { AuthenticatedUserResponse } from '../data/authenticatedUserResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public signupSubject = new Subject<boolean>();
  public loginSubject = new Subject<boolean>();
  public userSubject = new Subject<User | undefined>();

  private isUserLoggedIn = false;
  private authAdress = 'https://localhost:7292/api/Auth';
  private userLoggedIn?: User;

  constructor(
    private httpClient: HttpClient
  ) { }

  public signup(user: User): void {
    this.signupRequest(user).subscribe({
      next: (user) => {
        this.userLoggedIn = {...user, id: user.id }
        this.signupSubject.next(true);
      },
      error: (err) => {
        this.signupSubject.next(false);
      }
    });
  }

  public login(loginModel: LoginModel): void {
    this.loginRequest(loginModel).subscribe({
      next: (authenticatedUserResponse) => {
        this.userLoggedIn = {...authenticatedUserResponse.user}
        this.isUserLoggedIn = true;
        this.setHeaderToken(this.userLoggedIn.id, authenticatedUserResponse.token);
        this.loginSubject.next(true);
        this.userSubject.next({...this.userLoggedIn});
      },
      error: (err) => {
        this.loginSubject.next(false);
      }
    });
  }

  public logout(): void {
    this.removeHeaderToken();
    this.resetUser();
    this.isUserLoggedIn = false;
    this.userSubject.next(undefined);
    this.loginSubject.next(false);
  }

  private resetUser(): void {
    this.userLoggedIn = undefined;
    localStorage.removeItem('userObs');
  }

  public isLoggedIn(): boolean {
    return this.getHeaderToken() !== null ? true : false;
  }

  public removeHeaderToken(): void {
    if (this.userLoggedIn) {
      localStorage.removeItem(this.userLoggedIn.id);
    }
  }

  public getHeaderToken(): string | null {
    if (this.userLoggedIn) {
      return localStorage.getItem(this.userLoggedIn.id);
    }
    return null;
  }

  public getHeaders(): HttpHeaders {
    const token = this.getHeaderToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }

  public getUser(): User | undefined {
    if (this.userLoggedIn) {
      return this.userLoggedIn;
    }
    const userFromLocal = localStorage.getItem('userObs');
    if (userFromLocal !== null) {
      return JSON.parse(userFromLocal) as User;
    }
    return undefined;
  }

  private signupRequest(user: User): Observable<User> {
    return this.httpClient.post<User>(
      this.getRequestUrlForSignup(),
      user
    );
  }

  private loginRequest(loginModel: LoginModel): Observable<AuthenticatedUserResponse> {
    return this.httpClient.post<AuthenticatedUserResponse>(
      this.getRequestUrlForLogin(),
      loginModel,
    );
  }

  private setHeaderToken(userId: string, token: string): void {
    localStorage.setItem(userId, token);
    localStorage.setItem('userObs', JSON.stringify(this.userLoggedIn));
  }

  private getRequestUrlForSignup(): string {
    return `${this.authAdress}/Signup/`;
  }

  private getRequestUrlForLogin(): string {
    return `${this.authAdress}/Login/`;
  }
}
