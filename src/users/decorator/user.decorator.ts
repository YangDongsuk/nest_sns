import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { UsersModel } from '../entities/users.entity';

export const User = createParamDecorator(
  (data: keyof UsersModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const user = req.user as UsersModel;

    if (!user) {
      throw new InternalServerErrorException(
        'User 데코레이터는 AccessTokenGuard가 실행된 후에 사용할 수 있습니다.',
      );
    }
    // User 데코레이터에 인자가 있다면 해당하는 속성만 반환
    if (data) {
      return user[data];
    }
    return user;
  },
);
