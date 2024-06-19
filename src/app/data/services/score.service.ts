import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ScoreDto } from '../types/score.dto';
import { PagedResult } from '../types/paged-result';
import { GetListScoreReq } from '../types/get-list-score-req';
import { GetPagedScoreReq } from '../types/get-paged-score-req';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private readonly httpClient: HttpClient) { }

  public getListScore(params: GetListScoreReq) {
    return this.httpClient.get<ScoreDto[]>(`${environment.apiEndpoint}/score`, {
      params: { ...params }
    });
  }

  public getPagedScore(params: GetPagedScoreReq) {
    return this.httpClient.get<PagedResult<ScoreDto>>(`${environment.apiEndpoint}/score/get-paged-score`, {
      params: { ...params }
    });
  }
}
