import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { LOGIN_QUERY, SIGNUP_MUTATION } from '../../graphql/auth.queries';

export interface LoginResponse {
  token: string;
  message: string;
}

export interface SignupResponse {
  message: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';

  constructor(
    private apollo: Apollo,
    private router: Router
  ) {}

  login(usernameOrEmail: string, password: string): Observable<LoginResponse> {
    return this.apollo
      .query<{ login: LoginResponse }>({
        query: LOGIN_QUERY,
        variables: { usernameOrEmail, password },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((result) => {
          const payload = result.data?.login;
          if (!payload) {
            throw new Error('Login failed');
          }

          if (payload.token) {
            localStorage.setItem(this.TOKEN_KEY, payload.token);
          }

          return payload;
        })
      );
  }

  signup(username: string, email: string, password: string): Observable<SignupResponse> {
    return this.apollo
      .mutate<{ signup: SignupResponse }>({
        mutation: SIGNUP_MUTATION,
        variables: { username, email, password },
      })
      .pipe(
        map((result) => {
          const payload = result.data?.signup;
          if (!payload) {
            throw new Error('Signup failed');
          }
          return payload;
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.apollo.client.clearStore().catch(() => {});
    this.router.navigate(['/login']);
  }
}