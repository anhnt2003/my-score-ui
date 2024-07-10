import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/components/base.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subject, filter, switchMap, catchError, of, takeUntil, tap } from 'rxjs';
import { ScoreService } from '../../../data/services/score.service';
import { CategoryDto } from '../../../data/types/category.dto';
import { SharedModule } from '../../module/shared.module';
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
  @Input() scores!: ScoreDataTableDetail[]; // chú ý Input này vì nó sẽ quyết định form dùng cho create hay update
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
    const scorechanged = changes['scores'];
    if(categoryTreechanged.firstChange) {
      this.visiableReviewEmployeeForm = true;
      this.buildCategoryTree();
    };
    if(!scorechanged?.firstChange) {
      this.buildCreateFormArray();
    }
    else {
      this.buildUpdateFormArray();
    };
  }

  ngAfterViewInit(): void {
    this.formSubmited$.pipe(
      filter(() => this.addScoreForm.valid),
      switchMap(() => {
        //không tồn tại data score thì là form create ortherwise form update
        if(!this.scores) {
          return this.scoreService.createScore(this.entries.value).pipe(
            catchError(() => {
              return of(null);
            })
          )
        }
        else {
          return this.scoreService.updateScore(this.entries.value).pipe(
            catchError(() => {
              return of(null);
            })
          )
        }
      }),
      takeUntil(this.destroyed$)
    ).subscribe(() => this.closeDialog(true));
  }

  private buildCreateFormArray() {
    this.categories.forEach(category => {
      const addscoreForm = this.fb.group({
        departmentId: [category.departmentId, Validators.required],
        userId: [this.userIdReview, Validators.required],
        scoreEntered: [, Validators.nullValidator],
        categoryId: [category.id, Validators.required],
        categoryName: [category.name, Validators.required]
      });
      this.entries.push(addscoreForm);
    })
  }

  private buildUpdateFormArray() {
    this.categories.forEach(category => {
      const score = this.scores?.find(item => item.categoryId == category.id) ?? null;
      const addscoreForm = this.fb.group({
        id: [score?.id, Validators.required],
        departmentId: [category.departmentId, Validators.required],
        userId: [this.userIdReview, Validators.required],
        scoreEntered: [score?.scoreEntered, Validators.nullValidator],
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

  public closeDialog(event: boolean) {
    this.visibleEventChange.emit(event);
  }
}