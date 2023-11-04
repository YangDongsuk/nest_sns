import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [JwtModule.register({}), UsersModule], // UsersModule을 import하기 위해서는 UsersModule에 exports를 해줘야 한다.
  exports: [AuthService], // 외부에서 AuthService를 사용할 수 있도록 export
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
