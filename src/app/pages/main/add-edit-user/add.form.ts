import { UserI } from 'src/app/interfaces/clients/clients.interface';

interface AddFormI {
    name: string;
    surname: string;
    email: string;
    phone: string;
}

export const fromAddForm = (form: AddFormI): UserI => {
  const req: UserI = {
    name: form.name.trim(),
    surname: form.surname?.trim(),
    email: form.email.trim(),
    phone: form.phone?.trim(),
  };

  return req;
};
