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
import { Exclude, Expose } from 'class-transformer';

@Entity()
// 만약에 이게 보안상의 이유로 노출되면 안되는 정보라면
// @Exclude()를 붙여주면 된다.
// 그리고 보여주고 싶은 정보만 @Expose()를 붙여주면 된다.
// 기존의 반대로 하면 된다.
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

  // 원래 겟터는 클라이언트에게 전달되지 않는다.
  // 하지만 @Expose()를 붙여주면 클라이언트에게 전달된다.
  // @Expose()
  // get nicknameAndEmail(): string {
  //   return `${this.nickname}/${this.email}`;
  // }

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
  /**
   * Exclude
   *
   * Request
   * frontend -> backend
   * plain object (JSON) -> class instance (dto)
   *
   * Response
   * backend -> frontend
   * class instance (dto) -> plain object (JSON)
   *
   * toClassOnly -> class instance로 변환할 때만 적용 -> Request일 때만
   * toPlainOnly -> plain object로 변환할 때만 적용 -> Response일 때만
   */
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
}
