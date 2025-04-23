import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../app.constant'; // Use your API constant

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const loginPayload = { email, password };

    return this.http.post(`${API_URL}/api/authen/login`, loginPayload, {
      headers: new HttpHeaders({ 'X-Skip-Auth': 'true' })
    });
  }

  register(email: string, password: string): Observable<any> {
    const registerPayload = { email, password };

    return this.http.post(`${API_URL}/api/authen/register`, registerPayload, {
      headers: new HttpHeaders({ 'X-Skip-Auth': 'true' })
    });
  }

  verify(email: string, token: string): Observable<any> {
    const verifyPayload = { email, token };

    return this.http.post(`${API_URL}/api/authen/verify`, verifyPayload);
  }

  saveToken(token: string): void {
    localStorage.setItem('tok', token);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('tok') !== null;
  }
}
