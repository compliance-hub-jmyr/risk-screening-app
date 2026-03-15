import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '@/app/core/config';
import { PageResponse } from '@/app/shared/models/api';
import { SupplierPageRequest, SupplierResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private readonly http = inject(HttpClient);

  getAll(request: SupplierPageRequest): Observable<PageResponse<SupplierResponse>> {
    let params = new HttpParams()
      .set('page', request.page.toString())
      .set('size', request.size.toString())
      .set('sortBy', request.sortBy)
      .set('sortDirection', request.sortDirection);

    if (request.legalName) params = params.set('legalName', request.legalName);
    if (request.commercialName) params = params.set('commercialName', request.commercialName);
    if (request.taxId) params = params.set('taxId', request.taxId);
    if (request.country) params = params.set('country', request.country);
    if (request.status) params = params.set('status', request.status);
    if (request.riskLevel) params = params.set('riskLevel', request.riskLevel);

    return this.http.get<PageResponse<SupplierResponse>>(API_ENDPOINTS.SUPPLIERS, { params });
  }

  getById(id: string): Observable<SupplierResponse> {
    return this.http.get<SupplierResponse>(API_ENDPOINTS.SUPPLIER_BY_ID(id));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.SUPPLIER_BY_ID(id));
  }
}
