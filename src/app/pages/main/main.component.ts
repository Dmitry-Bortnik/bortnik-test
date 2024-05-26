import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MatTableModule } from '@angular/material/table' 
import {MatButtonModule} from '@angular/material/button';
import { MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatCommonModule} from '@angular/material/core';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { ConfimDeleteComponent } from 'src/app/dialogs/confim-delete/confim-delete.component';
import { BehaviorSubject, ReplaySubject, Subject, catchError, map, of, switchMap, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api-service';
import { UserI } from 'src/app/interfaces/clients/clients.interface';
import { TableUsersComponent } from './table-users/table-users.component'
import { TableColumnI } from 'src/app/interfaces/table/table.interaface';

@Component({
  standalone: true,
  selector: 'app-main',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatIconModule,
    MatCommonModule,
    TableUsersComponent
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent  implements OnInit {

  private fetchData$ = new ReplaySubject<void>();
  public columns$ = new BehaviorSubject<TableColumnI<UserI>[]>([]);
  public loading$ = new BehaviorSubject<boolean>(true);
  public users$ = new BehaviorSubject<UserI[] | null>(null);
  private destroy$ = new Subject<void>();
  public selectedUsers: UserI[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.initTable();

    const cachedUsers = this.localStorageService.getUsers();
    if (cachedUsers) {
      this.users$.next(cachedUsers);
      this.loading$.next(false);
    } else {
      this.fetchData$.next();
    }

    this.fetchData$
    .pipe(
      map(() => {
        this.loading$.next(true);
      }),
      switchMap(() => this.apiService.getClients().pipe(catchError(() => of(null)))),
      takeUntil(this.destroy$),
    )
    .subscribe(res => {
      this.loading$.next(false);
      this.users$.next(res?.users || null);
      this.localStorageService.setUsers(res.users);
    });
    
  } 

  // select

  public onSelectedUsersChange(selectedUsers: UserI[]) {
    this.selectedUsers = selectedUsers;
  }

  public isAnyUserSelected = (selectedUsers: UserI[], users: UserI[]) => {
    const localSelectedUsers = this.getLocalSelectedUsers(users ?? [], selectedUsers);
    return localSelectedUsers.length > 0;
  };

  public onSelectAll() {
    const users = this.users$.getValue() ?? [];
    const localSelectedUsers = this.getLocalSelectedUsers(users, this.selectedUsers);

    if (localSelectedUsers.length) {
      const set = new Set(users.map(user => user.email ?? 0));
      const result = this.selectedUsers.filter(user => !set.has(user.email ?? 0));
      this.selectedUsers = result;
      return;
    }

    const result = [...this.selectedUsers, ...users];
    this.selectedUsers = result;
  }

  private getLocalSelectedUsers(users: UserI[], selectedUsers: UserI[]) {
    const set = new Set(users.map(message => message.email ?? 0));
    return selectedUsers.filter(user => set.has(user.email ?? 0));
  }

  //

  public onAdd() {
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      panelClass: ['dialog-main'],
      width: '100%',
      maxWidth: '448px',
      autoFocus: false,
      data: {
        title: 'Новый клиент',
      },
    });
    dialogRef
      .afterClosed()
      .subscribe(result => {
        if (result?.add) {
          const newUser = result.add;
          const currentUsers = this.localStorageService.getUsers() || [];
          currentUsers.push(newUser);
          this.localStorageService.setUsers(currentUsers);
          this.users$.next(currentUsers);
        }
      });
  }

  onEdit = (user: UserI) => {
    console.log(user)
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      panelClass: ['dialog-main'],
      width: '100%',
      maxWidth: '448px',
      autoFocus: false,
      data: {
        user: user,
        title: 'Редактирование',
      },
    });
    dialogRef
      .afterClosed()
      .subscribe(result => {
        if (result?.edit) {
          const updatedUser = result.edit as UserI;
          let currentUsers = this.users$.getValue() ?? [];
          currentUsers = currentUsers.map(u => u.email === updatedUser.email ? updatedUser : u);
          this.localStorageService.setUsers(currentUsers);
          this.users$.next(currentUsers);
        }
      });
  }

  onDelete = () => {
    const selectedCount = this.selectedUsers.length;
    const dialogRef = this.dialog.open(ConfimDeleteComponent, {
      panelClass: ['dialog-main', 'delete-dialog'],
      width: '100%',
      maxWidth: '448px',
      minHeight: '300px',
      data: {
        dialogTitle: 'Удаление строк',
        info: `Удалить выбранные строки (${selectedCount})?`,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUsers(this.selectedUsers);
      }
    });
  }

  private deleteUsers(users: UserI[]) {
    let currentUsers = this.users$.getValue() ?? [];
    const emailsToDelete = new Set(users.map(user => user.email));
    currentUsers = currentUsers.filter(user => !emailsToDelete.has(user.email));
    this.localStorageService.setUsers(currentUsers);
    this.users$.next(currentUsers);
    this.selectedUsers = [];
  }


  private initTable() {
    this.columns$.next([
      {
        key: 'name',
        label: 'Имя',
      },
      {
        key: 'surname',
        label: 'Фамилия',
      },
      {
        key: 'email',
        label: 'E-mail',
      },
      {
        key: 'phone',
        label: 'Телефон',
      },
    ]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}