import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ScoreDto } from '../types/score.dto';
import { PagedResult } from '../types/paged-result';
import { GetListScoreReq } from '../types/get-list-score-req';
import { GetPagedScoreReq } from '../types/get-paged-score-req';
import { CreateScoreReq } from '../types/create-score-req';
import { UpdateScoreReq } from '../types/update-score-req';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private readonly httpClient: HttpClient) { }

  public createScore(params: CreateScoreReq[]) {
    return this.httpClient.post<ScoreDto[]>(`${environment.apiEndpoint}/score`, params)
  }

  public updateScore(params: UpdateScoreReq[]) {
    return this.httpClient.put<ScoreDto[]>(`${environment.apiEndpoint}/score`, params)
  }
  
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
