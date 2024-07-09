import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/components/base.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Subject, filter, switchMap, catchError, of, takeUntil } from 'rxjs';
import { ScoreService } from '../../../data/services/score.service';
import { CategoryDto } from '../../../data/types/category.dto';
import { EmployeeDto } from '../../../data/types/employee.dto';
import { ScoreDto } from '../../../data/types/score.dto';
import { SharedModule } from '../../module/shared.module';
import { UserDto } from '../../../data/types/user.dto';
import { ScoreDataTableDetail } from '../../../data/types/score-data-table-detail';

@Component({
  selector: 'app-employee-score-review-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './employee-score-review-form.component.html',
  styleUrl: './employee-score-review-form.component.scss'
})
export class EmployeeScoreReviewFormComponent extends BaseComponent implements OnChanges, AfterViewInit {

  public categoryTree: CategoryDto[] = [];
  public formSubmitSubject = new Subject<void>();
  public addScoreForm: FormGroup = new FormGroup({});
  private formSubmited$ = this.formSubmitSubject.asObservable();

  @Input() visiableReviewEmployeeForm: boolean = false;
  @Input() categories!: CategoryDto[];
  @Input() scores!: ScoreDataTableDetail[];
  @Input() userIdReview!: number;

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

  ngOnChanges(changes: SimpleChanges): void {
    const categoryTreechanged = changes['categories'];
    if(categoryTreechanged.firstChange) {
      this.visiableReviewEmployeeForm = true;
      this.buildCategoryTree();
      this.buildFormArray();
    };
    console.log(this.userIdReview)
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

  private buildFormArray() {
    this.categories.forEach(category => {
      const scoreEntered = this.scores?.find(item => item.categoryId == category.id)?.scoreEntered ?? null;
      const addscoreForm = this.fb.group({
        departmentId: [category.departmentId, Validators.required],
        userId: [this.userIdReview, Validators.required],
        scoreEntered: [scoreEntered, Validators.nullValidator],
        categoryId: [category.id, Validators.required],
        categoryName: [category.name, Validators.required]
      });
      this.entries.push(addscoreForm);
    })
  }

  private buildCategoryTree() {
    const categoryTree = this.categories.reduce((pre, cur) => {
      pre[cur.id!] = { ...cur, children: [] };
      return pre
    }, [] as CategoryDto[]);

    this.categories.forEach(item => {
      if (item.parentId === null) {
        this.categoryTree.push(categoryTree[item.id!]);
      } else {
        categoryTree[item.parentId!].children!.push(categoryTree[item.id!]);
      }
    });
  }

  public get entries(): FormArray {
    return this.addScoreForm.controls['entries'] as FormArray;
  }

  public closeDialog() {
    this.visibleEventChange.emit(false);
  }
}