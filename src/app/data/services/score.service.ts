import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { GetListScoreReq } from '../types/get-list-score.req';
import { ScoreDto } from '../types/score.dto';
import { PagedResult } from '../types/paged-result';
import { ScoreUserDto } from '../types/score-user.dto';

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

  public getPagedScore(organizationId: number) {
    return this.httpClient.get<PagedResult<ScoreUserDto>>(`${environment.apiEndpoint}/score/get-paged-score`, {
      params: { organizationId }
    });
  }
}
