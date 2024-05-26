import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisplayIfPredicatePipe } from './../../../pipes/display-if-predicate.pipe';
import { MaterialModule } from './../../../core/material/material.module';
import { CheckboxComponent } from './../../../components/checkbox/checkbox.component';
import { UserI } from 'src/app/interfaces/clients/clients.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-users',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, DisplayIfPredicatePipe, CheckboxComponent, MatSortModule],
  templateUrl: './table-users.component.html',
  styleUrls: ['./table-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableUsersComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() dataSource: UserI[] = [];
  @Input() selectedUsers: UserI[] = [];

  @Output() selectedUsersChange = new EventEmitter<UserI[]>();
  @Output() removeEndpoint = new EventEmitter<number>();
  @Output() edit = new EventEmitter<UserI>();

  @ViewChild(MatSort) sort!: MatSort;
  public dataSourceWithSort = new MatTableDataSource<UserI>([]);

  public selectedUser: UserI[] = [];

  public displayedColumns: string[] = ['checkbox', 'name', 'surname', 'email', 'phone'];

  ngAfterViewInit(): void {
    this.dataSourceWithSort.sort = this.sort;
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      this.dataSourceWithSort.data = this.dataSource;
    }
  }
  
  onEdit(el: UserI): void {
    this.edit.emit(el);
  }

  public isUserSelected = (selectedUsers: UserI[], user: UserI) => {
    return selectedUsers.some(({ email }) => email === user.email);
  };

  public rowSelect(user: any): boolean {
    return this.selectedUsers.includes(user);
  }

  public onSelectAll() {
    const users = this.dataSourceWithSort.data ?? [];
    const localSelectedUsers = this.getLocalSelectedUsers(users, this.selectedUsers);

    if (localSelectedUsers.length) {
      const set = new Set(users.map(user => user.email ?? 0));
      const result = this.selectedUsers.filter(user => !set.has(user.email ?? 0));
      this.selectedUsers = result;
      return;
    }

    const result = [...this.selectedUsers, ...users];
    this.selectedUsers = result;
    this.selectedUsersChange.emit(this.selectedUsers);
  }

  private getLocalSelectedUsers(users: UserI[], selectedUsers: UserI[]) {
    const set = new Set(users.map(user => user.email ?? 0));
    return selectedUsers.filter(user => set.has(user.email ?? 0));
  }

  public onUserSelect(user: UserI) {
    event?.stopPropagation();
    if (!this.dataSourceWithSort.data.length) return;

    const userFromCollection = this.selectedUsers.find(({ email }) => email === user.email);

    if (userFromCollection) {
      const selectedUsers = this.selectedUsers.filter(({ email }) => email !== user.email);
      this.selectedUsersChange.emit(selectedUsers);
      return;
    }

    const selectedUsers = [...this.selectedUsers, user];
    this.selectedUsersChange.emit(selectedUsers);
  }
}
