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
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entities/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(@Query() query: PaginatePostDto) {
    // return this.postsService.getAllPosts();
    return this.postsService.paginatePosts(query);
  }

  // POST /posts/random
  @Post('random')
  @UseGuards(AccessTokenGuard)
  async postPostsRandom(@User() user: UsersModel) {
    await this.postsService.generatePosts(user.id);
    return true;
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
  // @UseInterceptors(FileInterceptor('image'))
  async postPosts(
    @User('id') userId: number,
    @Body() body: CreatePostDto,
    // @UploadedFile() file?: Express.Multer.File,

    // @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ) {
    await this.postsService.createPostImage(body);

    return this.postsService.createPost(userId, body);
  }

  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, body);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
