import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SharedModule } from '../../../../shared/module/shared.module';
import { BaseComponent } from '../../../../core/components/base.component';
import { CategoryDto } from '../../../../data/types/category.dto';
import { MenuItem } from 'primeng/api';
import { Subject, catchError, filter, of, switchMap, takeUntil, tap } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScoreDto } from '../../../../data/types/score.dto';
import { ScoreService } from '../../../../data/services/score.service';
import { EmployeeDto } from '../../../../data/types/employee.dto';

@Component({
  selector: 'app-employee-review-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './employee-review-form.component.html',
  styleUrl: './employee-review-form.component.scss'
})
export class EmployeeReviewFormComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit {

  public menuItemData: MenuItem[] = [];
  public formSubmitSubject = new Subject<void>();
  public addScoreForm: FormGroup = new FormGroup({});
  private formSubmited$ = this.formSubmitSubject.asObservable();

  @Input() visiableReviewEmployeeForm: boolean = false;
  @Input() categories!: CategoryDto[];
  @Input() categoryTree!: CategoryDto[];
  @Input() scores!: ScoreDto[];
  @Input() employeeReview!: EmployeeDto;

  @Output() visibleEventChange = new EventEmitter<boolean>();
  constructor(
    private fb: FormBuilder,
    private readonly scoreService: ScoreService
  ) {
    super();
    this.addScoreForm = this.fb.group({
      entries: this.fb.array([])
    });
  }
  
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const inputChanged = changes['categoryTree'];
    if(!!inputChanged) {
      this.visiableReviewEmployeeForm = true;
      this.buildFormArray(this.categories);
    };
    console.log(this.addScoreForm.value);
  }

  ngAfterViewInit(): void {
    this.formSubmited$.pipe(
      filter(() => this.addScoreForm.valid),
      switchMap(() => this.scoreService.createScore(this.entries.value).pipe(
        catchError(() => {
          return of(null);
        })
      )),
      takeUntil(this.destroyed$)
    ).subscribe(() => this.closeDialog());
  }

  private buildFormArray(categories: CategoryDto[]) {
    categories.forEach(category => {
      const addscoreForm = this.fb.group({
        departmentId: [category.departmentId, Validators.required],
        userId: [this.employeeReview.userId, Validators.required],
        scoreEntered: [, Validators.nullValidator],
        categoryId: [category.id, Validators.required],
        categoryName: [category.name, Validators.required]
      });
      this.entries.push(addscoreForm);
    })
  }

  public get entries(): FormArray {
    return this.addScoreForm.controls['entries'] as FormArray;
  }

  public closeDialog() {
    this.visibleEventChange.emit(false);
  }
}
