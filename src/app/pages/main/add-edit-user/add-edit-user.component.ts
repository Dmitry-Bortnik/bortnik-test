import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { fromAddForm } from './add.form'
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule} from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserI } from 'src/app/interfaces/clients/clients.interface';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCommonModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatSelectModule
  ],
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditUserComponent {
  public form!: FormGroup;
  supervisors: string[] = [];
  user$!: Observable<UserI>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: UserI, title: string },
    private dialogRef: MatDialogRef<AddEditUserComponent>,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.initForm();

    if (this.data.user) {
      this.patchFormData(this.data.user);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      surname: [null],
      email: [null, [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
      phone: [null],
    });
  }

  patchFormData(user: UserI): void {
    this.form.patchValue({
      name: user?.name || null,
      surname: user?.surname || null,
      email: user?.email || null,
      phone: user.phone || null
    });

    this.form.updateValueAndValidity();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const reqData: UserI = fromAddForm(this.form.value);
      if (this.data.user) {
        this.dialogRef.close({ edit: reqData });
      } else {
        this.dialogRef.close({ add: reqData });
      }
    }
  }
}
