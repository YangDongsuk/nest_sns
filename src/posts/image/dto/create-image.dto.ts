import { PickType } from '@nestjs/mapped-types';
import { ImageModel } from 'src/common/entity/image.entity';

export class createPostImageDto extends PickType(ImageModel, [
  'path',
  'post',
  'order',
  'type',
]) {}
