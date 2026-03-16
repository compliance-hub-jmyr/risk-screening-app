import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '@/app/core/config';
import { ListSource, ScreeningRequest, ScreeningResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ScreeningService {
  private readonly http = inject(HttpClient);

  search(request: ScreeningRequest): Observable<ScreeningResponse> {
    let params = new HttpParams().set('q', request.q);

    if (request.sources?.length) {
      const apiSourceMap: Record<ListSource, string> = {
        OFAC: 'ofac',
        WORLD_BANK: 'worldbank',
        ICIJ: 'icij',
      };
      for (const source of request.sources) {
        params = params.append('sources', apiSourceMap[source]);
      }
    }

    return this.http.get<ScreeningResponse>(API_ENDPOINTS.LISTS_SEARCH, { params });
  }
}
