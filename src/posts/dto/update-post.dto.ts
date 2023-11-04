import { IsOptional, IsString } from 'class-validator';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';

// PartialType을 사용하면 CreatePostDto에서 필수로 받아야 하는 title, content를 선택적으로 받을 수 있다.
// 근데 굳이 왜...?
// 1) 나중에 CreatePostDto에서 필수 값이 추가되었을 때 이를 상속받기 쉽다.
// 2) 다른 개발자들이 볼때 UpdatePostDto가 CreatePostDto를 기반으로 만들어졌다는 것을 알 수 있다.
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString({
    message: stringValidationMessage,
  })
  @IsOptional()
  title?: string;

  @IsString({ message: stringValidationMessage })
  @IsOptional()
  content?: string;
}
