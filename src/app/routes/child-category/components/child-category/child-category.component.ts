import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  catchError,
  of,
  tap,
} from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { CategoryService } from '../../../../data/services/category.service';
import {
  DepartmentService,
} from '../../../../data/services/department.service';
import { CategoryDto } from '../../../../data/types/category.dto';
import { SharedModule } from '../../../../shared/module/shared.module';

@Component({
  selector: 'app-child-category',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './child-category.component.html',
  styleUrl: './child-category.component.scss'
})
export class ChildCategoryComponent extends BaseComponent implements OnInit{
  public visible: boolean = false;
  private id !: string;
  public categoryForm: FormGroup;
  public categories: CategoryDto[] = [];
  public inputViewable: boolean = true;
  public childCategories: CategoryDto[] = [];
  private departmentId = this.departmentService.getDepartmentnState().id ?? 0;

  constructor(
    private activatedRoute : ActivatedRoute,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private departmentService: DepartmentService
  ) {
    super();
    this.categoryForm = this.fb.group({
      categoryName: [, Validators.required],
      weighting: [0, Validators.required]
    })
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? '1';

    if (this.id != ":id"){
      this.categoryService.getCategoryByParentId({
        departmentId: this.departmentId,
        parentId: parseInt(this.id)
      }).pipe(
        tap((childCategories: CategoryDto[]) => {
          this.categories = childCategories;
        }),
        catchError((err) => of(err))
      ).subscribe();
    }
  }

  showDialog() {
    this.visible = true;
  }

  addCategoryTemp(){
    if (this.categoryForm.valid){
      this.categories.push({
        name: this.categoryForm.value.categoryName,
        weighting: this.categoryForm.value.weighting,
        departmentId: this.departmentId,
        parentId: parseInt(this.id),
      })
      this.categoryForm.patchValue({categoryName: "", weighting: 0})
      this.inputViewable = false;
      this.visible = false;
    }
  }

  postCategory(){
    this.categoryService.createCategory(this.categories).pipe(
      tap((res) => {
        console.log(res);
        this.inputViewable = true;
      }),
      catchError((err) => of(err))
    ).subscribe();
  }
  
  cancelEditCategory(){
    this.inputViewable = true;
  }

  navigateToChild(id: number | null){
    this.router.navigateByUrl(`/child-category/${id}`);

    if (id !== null) {
      window.location.href = `/child-category/${id}`;
    } else {
      this.router.navigate(['/category']);
    }
  }
}
