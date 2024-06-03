import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserDto } from '../types/user.dto';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly httpClient: HttpClient) { }

  public getListUser(searchTerm: string) {
    return this.httpClient.get<UserDto[]>(`${environment.apiEndpoint}/user/get-list`, {
      params: { searchTerm }
    })
  }
}
