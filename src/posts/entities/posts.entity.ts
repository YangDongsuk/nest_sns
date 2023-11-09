import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { join } from 'path';
import { POST_PUBLIC_IMAGE_PATH } from 'src/common/const/path.const';
import { BaseModel } from 'src/common/entity/base.entity';
import { ImageModel } from 'src/common/entity/image.entity';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { UsersModel } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PostsModel extends BaseModel {
  // 1) UserModel과 연동한다. ForeignKey를 이용해서
  // 2) null이 될 수 없다.
  @ManyToOne(() => UsersModel, (user) => user.posts, { nullable: false })
  author: UsersModel;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  title: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  content: string;

  // @Column({
  //   nullable: true,
  // })
  // @Transform(({ value }) => value && `/${join(POST_PUBLIC_IMAGE_PATH, value)}`)
  // image?: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;

  @OneToMany(() => ImageModel, (image) => image.post)
  images: ImageModel[];
}
