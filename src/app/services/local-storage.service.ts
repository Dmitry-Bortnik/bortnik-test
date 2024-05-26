import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserI } from '../interfaces/clients/clients.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly usersKey = 'users';

  getUsers(): UserI[] | null {
    const usersJson = localStorage.getItem(this.usersKey);
    return usersJson ? JSON.parse(usersJson) : null;
  }

  setUsers(users: UserI[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  clearUsers(): void {
    localStorage.removeItem(this.usersKey);
  }
}
