import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import {
  BehaviorSubject,
  catchError,
  filter,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { AuthService } from '../../../../data/services/auth.service';
import { CategoryService } from '../../../../data/services/category.service';
import {
  DepartmentService,
} from '../../../../data/services/department.service';
import { EmployeeService } from '../../../../data/services/employee.service';
import { ScoreService } from '../../../../data/services/score.service';
import { ToastService } from '../../../../data/services/toast.service';
import {
  CategoryToReviewResponseDto,
} from '../../../../data/types/category-to-review-response.dto';
import {
  CategoryToReviewDto,
} from '../../../../data/types/category-to-review.dto';
import { CategoryDto } from '../../../../data/types/category.dto';
import { EmployeeDto } from '../../../../data/types/employee.dto';
import { ScoreDto } from '../../../../data/types/score.dto';
import { DefaultPagingOptions } from '../../../../shared/common/constants';
import { SharedModule } from '../../../../shared/module/shared.module';
import {
  EmployeeCreateDialogComponent,
} from '../employee-create-dialog/employee-create-dialog.component';
import { EmployeeEditFormComponent } from '../employee-edit-form/employee-edit-form.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    SharedModule,
    EmployeeCreateDialogComponent,
    EmployeeEditFormComponent
  ],
  providers: [
    ConfirmationService,
    MessageService,
    ToastService
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent extends BaseComponent implements OnInit, AfterViewInit {

  public employeeData: EmployeeDto[] = [];
  public totalCountData: number = 0;
  public pagingOptions = DefaultPagingOptions;
  public perPageModel: number = 0;
  public userId = this.authService.getAuthState().userId ?? 0;
  public departmentId = this.departmentService.getDepartmentnState().id ?? 0;
  public categoriesSkill: CategoryToReviewDto[] = [];
  public reviewUserDialog: boolean = false;
  public showButtonReview: boolean = false;
  public addScoreForm: FormGroup = new FormGroup({});
  public userScore: ScoreDto[] = [];
  public searchTermSubject = new Subject<string>();
  public paginatorSubject = new Subject<void>();
  public formSubmitSubject = new Subject<void>();
  public categoryEnterScoreSubject = new Subject<CategoryDto[]>();
  public categoryEnterScore$: Observable<CategoryDto[]> = this.categoryEnterScoreSubject.asObservable();
  public existedCategorySubject = new BehaviorSubject<boolean>(false); 
  public existedCategory$ = this.existedCategorySubject.asObservable();
  public visibleAddEmployeeSubject = new BehaviorSubject<boolean>(false);
  public visibleAddEmployee$ = this.visibleAddEmployeeSubject.asObservable();

  private formSubmited$ = this.formSubmitSubject.asObservable();
  private userIdIsReviewed!: number;
  private addScore!: ScoreDto[];

  public visibleEditEmployeeSubject = new BehaviorSubject<EmployeeDto | null>(null);
  public visibleEditEmployee$ = this.visibleEditEmployeeSubject.asObservable();  

  private paginatorChanged$ = this.paginatorSubject.asObservable();
  private searchTermChanged$ = this.searchTermSubject.asObservable();

  @ViewChild('searchTerm') searchTermEl: ElementRef | undefined;
  @ViewChild('paginator') paginator: PaginatorState | undefined;
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly categoryService: CategoryService,
    private readonly scoreService: ScoreService,
    private readonly departmentService: DepartmentService,
    private readonly toastService: ToastService,
    private readonly fb: FormBuilder,
    private confirmationService: ConfirmationService,
    public authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadPagedEmployee(this.departmentId);
    this.submitAddCoreForm();
    this.initalizeFormArray();
    this.checkExistedCategory();
    this.categoryService.getCategoryToReview(this.departmentId).pipe(
      tap((childCategories: CategoryToReviewResponseDto) => {
        this.categoriesSkill = childCategories.data;
      }),
      catchError(err => of(err)),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  ngAfterViewInit(): void {
    merge(this.searchTermChanged$, this.paginatorChanged$).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.loadPagedEmployee(
        this.departmentId, 
        this.paginator?.page, 
        this.paginator?.pageCount, 
        this.searchTermEl?.nativeElement.value ?? null
      );
    });
  }

  private checkExistedCategory() {
    this.categoryService.getCategory(this.departmentId, null).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((result) => {
      if(result.length < 1) {
        this.existedCategorySubject.next(true);
      };
      this.showButtonReview = true;
    });
  }

  public openAddUserDialog() {
    this.visibleAddEmployeeSubject.next(true);
  }

  public closeAddUserDialog() {
    this.visibleAddEmployeeSubject.next(false);
    this.loadPagedEmployee(this.departmentId);
  }

  public openEditEmployeeForm(employee: EmployeeDto) {
    this.visibleEditEmployeeSubject.next(employee);
  }

  public handleDeleteEmployee(event: Event, employee: EmployeeDto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Bạn có muốn xoá nhân viên ${employee.email} không`,
      header: 'Xác nhận xoá nhân viên',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Huỷ',

      accept: () => {
        this.employeeService.DeleteEmployee(employee.id).pipe(
          takeUntil(this.destroyed$),
          catchError((error) => {
            return of(error);
          })
        ).subscribe((result) => {
          if (result) {
            this.loadPagedEmployee(
              this.departmentId, 
              this.paginator?.page, 
              this.paginator?.pageCount, 
              this.searchTermEl?.nativeElement.value
            );
          };
          this.toastService.success('Xoá nhân viên thành công')
        });
      },
    });
  }

  private loadPagedEmployee(departmentId: number, pageIndex = 0, pageSize = DefaultPagingOptions.pageSize , searchTerm?: string) {
    this.employeeService.getPagedEmployee({ 
      departmentId: departmentId, 
      take: pageSize, 
      skip: pageSize * pageIndex, 
      searchTerm: searchTerm ?? ''
    }).pipe(
      takeUntil(this.destroyed$)
    )
    .subscribe(reponse => {
      this.employeeData = reponse.data;
      this.totalCountData = reponse.total;
      console.log('fetch data employees successful');
    });
  }

  public openReviewDialog(userId: number){
    this.scoreService.getListScore({departmentId: this.departmentId, userId: userId}).pipe(
      tap((res: ScoreDto[]) => {
        this.userScore = res;
        this.initializeFormEntries();
      }),
      catchError((err) => of(err))
    ).subscribe();
    this.userIdIsReviewed = userId;
    this.reviewUserDialog = true;
  }

  public get entries(): FormArray {
    return this.addScoreForm.get('entries') as FormArray;
  }

  private initalizeFormArray() {
    this.addScoreForm = this.fb.group({
      entries: this.fb.array([])
    });
  }

  private initializeFormEntries() {
    const entries = this.entries;
    entries.clear();
    this.categoriesSkill.forEach((childCategory) => {
      childCategory.categoryChildren.forEach((categoryEnterScore, index) => {
        entries.push(this.fb.group({
          userId: [this.userIdIsReviewed, Validators.required],
          departmentId: [this.departmentId, Validators.required],
          scoreEntered: [this.userScore[index]?.scoreEntered ?? '', Validators.required],
          categoryId: [categoryEnterScore.id, Validators.required],
        }));
      });
    });
  }

  private submitAddCoreForm() {
    this.formSubmited$.pipe(
      tap(() => {
        const entries = this.addScoreForm.get('entries') as FormArray;
        this.addScore = [];
        entries.controls.forEach((item) => {
          if (item.value.scoreEntered !== '')
            this.addScore.push(item.value)
        })
      }),
      filter(() => {
        if (this.addScore.length == 0)
          return false;
        return true;
      }),
      switchMap(() => {
        let addScoreMap = this.userScore.map(scoreDefault => {
          const matchedData = this.addScore.find(scoreEntered => scoreDefault.categoryId === scoreEntered.categoryId);
          return matchedData ? { ...scoreDefault, ...matchedData } : scoreDefault;
        });
        return this.scoreService.createScore(addScoreMap).pipe(
          tap((data: ScoreDto[]) => {
            this.reviewUserDialog = false;
            this.addScore = [];
          }),
          catchError((err) => of(err))
        )
      }
      ),
      catchError((err) => {
        console.log(err);
        return of(err)
      })
    ).subscribe();
  }
}
