import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, ApiResponse, PagedResult } from '../../../app.constant';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  role?: number;
  token?: string;
  roleName?: string;
  isDeleted?: boolean;
}

const ENDPOINT = 'api/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(page: number = 1, size: number = 10): Observable<ApiResponse<PagedResult<User>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PagedResult<User>>>(`${API_URL}/${ENDPOINT}`, { params });
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${API_URL}/${ENDPOINT}/${id}`);
  }

  getUserProfile(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${API_URL}/${ENDPOINT}/Profile/${id}`);
  }

  updateProfile(user: User): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${API_URL}/${ENDPOINT}/Profile`, user);
  }

  addUser(user: User): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${API_URL}/${ENDPOINT}`, user);
  }

  updateUser(user: User): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${API_URL}/${ENDPOINT}`, user);
  }

  deleteUser(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${API_URL}/${id}`);
  }

}
