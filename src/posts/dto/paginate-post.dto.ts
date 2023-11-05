import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginatePostDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  where__id_less_than?: number;

  // 이전 마지막 데이터의 ID
  // 이 프로퍼티에 입력된 ID 보다 높은 ID 부터 값을 가져오기
  // 기본적으로 쿼리는 스트링이기에 타입을 숫자로 바꿔줘야 한다.
  //   @Type(() => Number) 하지만 이건 잘 안쓴다. 그냥 main에서 처리한다.
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  // 정렬
  // createdAt -> 생성된 시간의 내림차/오름차 순으로 정렬
  // 해당 값만 통과가 된다.
  // 이렇게 기본값을 적용해도 만약 쿼리가 안 들어오면 적용이 안 된다.
  // 그냥 이 값이 없다.
  // 이를 해결해기 위해서는 main에서 transform을 사용해야 한다.
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC' = 'ASC';

  // 몇개의 데이터를 응답으로 받을지
  @IsNumber()
  @IsOptional()
  take: number = 20;
}
