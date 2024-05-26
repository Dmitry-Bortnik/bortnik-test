export interface UserI {
    name: string;
    surname: string;
    email: string;
    phone: string;
  }
  
  export interface UsersRes {
    users: UserI[];
  }
  