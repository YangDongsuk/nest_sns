import { PostsModel } from '../entities/posts.entity';
import { PickType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';

// Pick, Omit, Partial -> Type 반환
// PickType, OmitType, ParitalType -> 값을 반환

// PickType을 사용하면 PostsModel에서 title, content만 뽑아서 CreatePostDto를 만들 수 있다.
export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {
  @IsString({
    each: true,
  })
  @IsOptional()
  images: string[] = [];
}
