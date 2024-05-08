import {
  Component,
  OnDestroy,
} from '@angular/core';

import { Subject } from 'rxjs';

@Component({
    template: ''
})

export abstract class BaseComponent implements OnDestroy {
    protected destroyed$ = new Subject();
    ngOnDestroy(): void {
        this.destroyed$.next(null);
    }
 }