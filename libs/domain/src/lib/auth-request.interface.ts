import { Request } from 'express';
import { Role } from './role.enum';

export interface IAuthRequest extends Request {
  user: {
    sub: string;
    email: string;
    username: string;
    role: Role;
  };
}
