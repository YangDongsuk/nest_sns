import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import {
  IsEmail,
  IsString,
  Length,
  ValidationArguments,
} from 'class-validator';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';

@Entity()
export class UsersModel extends BaseModel {
  // 1) 길이가 20을 넘지 않는다.
  // 2) 유일무이한 값이다.
  @Column({
    length: 20,
    unique: true,
  })
  @IsString({ message: stringValidationMessage })
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;

  @Column({
    unique: true,
  })
  // 1) 유일무이한 값이다.
  @IsString({ message: stringValidationMessage })
  @IsEmail(
    {},
    {
      // 이메일은 인자를 하나 더 받아서 {} 넣어줘야 한다.
      message: emailValidationMessage,
    },
  )
  email: string;

  @Column()
  @IsString({ message: stringValidationMessage })
  @Length(3, 8, {
    message: lengthValidationMessage,
  })
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
}
