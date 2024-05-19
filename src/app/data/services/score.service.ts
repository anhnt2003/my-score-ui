import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { GetListScoreReq } from '../types/get-list-score.req';
import { ScoreDto } from '../types/score.dto';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private readonly httpClient: HttpClient) { }

  getListScore(params: GetListScoreReq) {
    return this.httpClient.get<ScoreDto[]>(`${environment.apiEndpoint}/score`, {
      params: { ...params }      
    }
    );
  }
}
