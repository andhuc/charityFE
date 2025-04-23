import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, ApiResponse, PagedResult } from '../../../app.constant';
import { Observable } from 'rxjs';

export interface OrderInfo {
  amount: number;
  donationId: number;
}

const ENDPOINT = 'api/Payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  payment(item: OrderInfo): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${API_URL}/${ENDPOINT}/pay`, item);
  }

}
