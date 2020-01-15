import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { Roles } from '../../const/roles';

@Injectable()
export class UserService {
  async createUSer(email: string, password: string, displayName: string, role: Roles) {
    try {
      const user = await auth().createUser({
        email,
        password,
        displayName,
      });
      auth().setCustomUserClaims(user.uid, { role });
      return user;
    } catch (e) {
      const { errorInfo } = e;
      throw new HttpException(errorInfo.message, HttpStatus.BAD_REQUEST);
    }
  }
}
