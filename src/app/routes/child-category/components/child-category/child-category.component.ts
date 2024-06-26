import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { BaseComponent } from '../../../../core/components/base.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDto } from '../../../../data/types/category.dto';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../data/services/category.service';
import { catchError, of, tap } from 'rxjs';
import { CategoryResponseDto } from '../../../../data/types/category-response.dto';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-child-category',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    DialogModule,
    InputNumberModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule
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

  constructor(
    private activatedRoute : ActivatedRoute,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router
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
      this.categoryService.getCategory(2, parseInt(this.id)).pipe(
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
        departmentId: 2, // Fix cứng
        parentId: parseInt(this.id)
      })
      this.categoryForm.patchValue({categoryName: "", weighting: 0})
      this.inputViewable = false;
      this.visible = false;
    }
  }

  postCategory(){
    this.categoryService.postCategory(this.categories).pipe(
      tap((res) => {
        console.log(res);
        this.inputViewable = true;
      }),
      catchError((err) => of(err))
    ).subscribe();
  }

  editCategory(){
    this.inputViewable = false;
  }

  cancelEditCategory(){
    this.inputViewable = true;
  }

  navigateToChild(id: number | null){
    this.router.navigateByUrl(`/child-category/${id}`);

    //Fix cứng
    this.categoryService.getCategory(2, id).pipe(
      catchError((err) => of(err))
    ).subscribe();
  }
}
