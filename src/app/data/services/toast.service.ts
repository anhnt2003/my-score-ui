import { Injectable } from '@angular/core';

import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private messageService : MessageService
  ) { }

  public success(content : string){
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: content });
  }

  public fail(content : string){
    this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: content });
  }
}
