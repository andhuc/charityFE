import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, ApiResponse, PagedResult } from '../../../app.constant';
import { Observable } from 'rxjs';

export interface Donation {
  id?: number;
  title: string;
  description?: string;
  goalAmount: number;
  raisedAmount: number;
  startDate?: string;
  endDate?: string;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
  imageUrl?: string;
}

const ENDPOINT = 'api/Donation';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  constructor(private http: HttpClient) { }

  getDonations(page: number = 1, size: number = 10, search?: string): Observable<ApiResponse<PagedResult<Donation>>> {
    const params = new HttpParams().set('page', page).set('size', size).set('search', search || '');
    return this.http.get<ApiResponse<PagedResult<Donation>>>(`${API_URL}/${ENDPOINT}`, { params });
  }

  getDonationById(id: number): Observable<ApiResponse<Donation>> {
    return this.http.get<ApiResponse<Donation>>(`${API_URL}/${ENDPOINT}/${id}`);
  }

  getDonationProfile(id: number): Observable<ApiResponse<Donation>> {
    return this.http.get<ApiResponse<Donation>>(`${API_URL}/${ENDPOINT}/Profile/${id}`);
  }

  updateProfile(item: Donation): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${API_URL}/${ENDPOINT}/Profile`, item);
  }

  addDonation(item: Donation): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${API_URL}/${ENDPOINT}`, item);
  }

  updateDonation(item: Donation): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${API_URL}/${ENDPOINT}`, item);
  }

  deleteDonation(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${API_URL}/${ENDPOINT}/${id}`);
  }

}
