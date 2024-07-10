import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  constructor() { }

  public showLoading() {
    this.loadingSubject.next(true);
  }

  public hideLoading() {
    this.loadingSubject.next(false);
  }
}
