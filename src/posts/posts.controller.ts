import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  // ParseIntPipe는 숫자로 변환할 수 없는 값이 들어오면 에러를 발생시킨다.
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  // DefaultValuePipe는 값이 없을 때 기본값을 설정해준다.
  // 참고로 이는 네스트에서 인젝션을 해주는 것이 아닌 여기서 바로 인스턴스를 생성해주는 것이다.
  @Post()
  @UseGuards(AccessTokenGuard)
  postPosts(
    @Request() req,
    @Body('title') title: string,
    @Body('content') content: string,
    // @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ) {
    const authorId = req.user.id;
    return this.postsService.createPost(authorId, title, content);
  }

  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.updatePost(id, title, content);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
