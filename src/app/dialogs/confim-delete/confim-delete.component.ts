import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfimDeleteDialogI } from './confim-delete.interface';

@Component({
  standalone:true,
  selector: 'app-confim-delete',
  templateUrl: './confim-delete.component.html',
  styleUrls: ['./confim-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class ConfimDeleteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfimDeleteDialogI,
    private dialogRef: MatDialogRef<ConfimDeleteComponent>,
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
