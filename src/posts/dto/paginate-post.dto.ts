import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

export class PaginatePostDto extends BasePaginationDto {
  // 근데 이것들 주석 처리 해도 잘됨
  // 그러면 헤커가 이런걸로 쿼리를 보내도 잘됨
  // 그래서 이런걸 막기 위해서는 main에서 whitelist를 사용해야 한다.
  @IsNumber()
  @IsOptional()
  where__likeCount__more_than: number;

  @IsString()
  @IsOptional()
  where__title__i_like: string;
}
