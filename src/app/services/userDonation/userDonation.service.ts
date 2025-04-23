import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, ApiResponse, PagedResult } from '../../../app.constant';
import { Observable } from 'rxjs';

export interface UserDonation {
  id?: number;
  userId: number;
  donationId: number;
  amount: number;
  userFullname?: string;
  donationTitle?: string;
}

const ENDPOINT = 'api/UserDonation';

@Injectable({
  providedIn: 'root'
})
export class UserDonationService {

  constructor(private http: HttpClient) { }

  getUserDonations(page: number = 1, size: number = 10, search?: string, userId?: number, donationId?: number): Observable<ApiResponse<PagedResult<UserDonation>>> {
    const params = new HttpParams().set('page', page).set('size', size).set('search', search || '').set('userId', userId ? userId.toString() : '').set('donationId', donationId ? donationId.toString() : '');
    return this.http.get<ApiResponse<PagedResult<UserDonation>>>(`${API_URL}/${ENDPOINT}`, { params });
  }

  getUserDonationById(id: number): Observable<ApiResponse<UserDonation>> {
    return this.http.get<ApiResponse<UserDonation>>(`${API_URL}/${ENDPOINT}/${id}`);
  }

  getUserDonationProfile(id: number): Observable<ApiResponse<UserDonation>> {
    return this.http.get<ApiResponse<UserDonation>>(`${API_URL}/${ENDPOINT}/Profile/${id}`);
  }

  updateProfile(item: UserDonation): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${API_URL}/${ENDPOINT}/Profile`, item);
  }

  addUserDonation(item: UserDonation): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${API_URL}/${ENDPOINT}`, item);
  }

  updateUserDonation(item: UserDonation): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${API_URL}/${ENDPOINT}`, item);
  }

  deleteUserDonation(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${API_URL}/${ENDPOINT}/${id}`);
  }

}
