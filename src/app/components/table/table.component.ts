import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './../../core/material/material.module';
import { RowActionI, TableActionI, TableColumnI } from './../../interfaces/table/table.interaface';
import { FormsModule } from '@angular/forms';
import { UserI } from 'src/app/interfaces/clients/clients.interface';
import { DisplayIfPredicatePipe } from './../../pipes/display-if-predicate.pipe';
import { CheckboxComponent } from './../checkbox/checkbox.component';

@Component({
  standalone: true,
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    DisplayIfPredicatePipe,
    CheckboxComponent
  ],
})

export class TableComponent<T> implements OnInit, OnChanges {
  @Input() dataSource: T[] = [];
  @Input() columns: TableColumnI<T>[] = [];
  @Input() tableClass!: string;
  @Input() selectedUsers: UserI[] = [];

  @Output() selectedUsersChange = new EventEmitter<UserI[]>();
  @Output() rowAction = new EventEmitter<RowActionI<T>>();
  @Output() rowData = new EventEmitter<T>();
  
  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.setDisplayedColumns();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('columns' in changes) {
      this.setDisplayedColumns();
    }
  }

  setDisplayedColumns(): void {
    this.displayedColumns.push('checkbox');
    this.displayedColumns = this.columns.filter(col => col).map((el: TableColumnI<T>) => el.key);
  }

  onSelectAction(el: T, action: TableActionI): void {
    this.rowAction.emit({ key: action.key, row: el });
  }

  public isUserSelected = (selectedUsers: UserI[], user: UserI) => {
    return selectedUsers.some(({ email }) => email === user.email);
  };

  public onUserSelect(user: UserI) {
    if (!this.dataSource.length) return;

    const userFromCollection = this.selectedUsers.find(({ email }) => email === user.email);

    if (userFromCollection) {
      const selectedUsers = this.selectedUsers.filter(({ email }) => email !== user.email);

      this.selectedUsersChange.emit(selectedUsers);

      return;
    }

    const selectedUsers = [...this.selectedUsers, user];

    this.selectedUsersChange.emit(selectedUsers);
  }

  onRowClick(el: T): void {
    this.rowData.emit(el);
  }
}
