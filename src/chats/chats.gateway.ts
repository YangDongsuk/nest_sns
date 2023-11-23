import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; //꼭 이 소켓을 사용해야함
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
import { EnterChatDto } from './dto/enter-chat.dto';
import { CreateMessageDto } from './messages/dto/create-messages.dto';
import { ChatsMessagesService } from './messages/messages.service';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SocketCatchHttpExceptionFilter } from 'src/common/exception-filter/socket-catch-http.exception-filter';
import { SocketBearerTokenGuard } from 'src/auth/guard/socket/socket-bearer-token.guard';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({
  // ws://localhost:3000/chats
  namespace: '/chats',
})
export class ChatsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: ChatsMessagesService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  // 처음 웹소켓이 등록될 때 실행됨
  afterInit(server: any) {
    console.log('afterInit');
  }

  // 웹소켓이 끊겼을 때 실행됨
  handleDisconnect(socket: any) {
    console.log(`on disconnect ${socket.id}`);
  }

  // 웹소켓이 연결됐을 때 실행됨
  // 연결 했을 때 사용자 정보를 socket.user에 넣어줌
  async handleConnection(socket: Socket & { user: UsersModel }) {
    console.log(`on connection ${socket.id}`);

    // const headers = socket.handshake.headers;

    // // Bearer xxxx
    // const rawToken = headers['authorization'];

    // if (!rawToken) {
    //   //   throw new WsException('토큰이 없습니다.');
    //   socket.disconnect();
    // }
    // try {
    //   const token = this.authService.extractTokenFromHeader(rawToken, true);

    //   const payload = this.authService.verifyToken(token);

    //   const user = await this.usersService.getUserByEmail(payload.email);

    //   socket.user = user;

    //   return true;
    // } catch (error) {
    //   console.log(error);
    //   // 기존 에러는 http 에러이기 때문에 ws 에러로 바꿔줘야함
    //   //   throw new WsException('토큰이 유효하지 않습니다.');
    //   socket.disconnect();
    // }
  }

  @SubscribeMessage('enter_chat')
  //   @UseGuards(SocketBearerTokenGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true, // 요청에서 넘어온 자료들의 형변환을 자동으로 해줌
      transformOptions: {
        enableImplicitConversion: true, // true로 설정하면, 자동 형변환을 허용함
      },
      whitelist: true, // 데코레이터가 없는 속성들은 제거해줌
      forbidNonWhitelisted: true, // 데코레이터가 없는 속성이 있으면 요청 자체를 막아버림
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  async enterChat(
    // 방의 ID들을 리스트로 받는다.
    @MessageBody() data: EnterChatDto,
    // 현재 소켓
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    // for (const chatId of data) {
    //   //socket.join
    //   socket.join(chatId.toString());
    // }
    for (const chatId of data.chatIds) {
      const exists = await this.chatsService.checkIfChatExists(chatId);
      if (!exists) {
        throw new WsException({
          code: 100,
          message: `존재하지 않는 채팅방입니다. chatId: ${chatId}`,
        });
      }
    }

    socket.join(data.chatIds.map((chatId) => chatId.toString()));
  }

  @SubscribeMessage('create_chat')
  @UsePipes(
    new ValidationPipe({
      transform: true, // 요청에서 넘어온 자료들의 형변환을 자동으로 해줌
      transformOptions: {
        enableImplicitConversion: true, // true로 설정하면, 자동 형변환을 허용함
      },
      whitelist: true, // 데코레이터가 없는 속성들은 제거해줌
      forbidNonWhitelisted: true, // 데코레이터가 없는 속성이 있으면 요청 자체를 막아버림
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  //   @UseGuards(SocketBearerTokenGuard)
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const chat = await this.chatsService.createChat(data);
  }

  // socket.on('send_message', (message) => {console.log(message)})
  @SubscribeMessage('send_message')
  //   @UseGuards(SocketBearerTokenGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true, // 요청에서 넘어온 자료들의 형변환을 자동으로 해줌
      transformOptions: {
        enableImplicitConversion: true, // true로 설정하면, 자동 형변환을 허용함
      },
      whitelist: true, // 데코레이터가 없는 속성들은 제거해줌
      forbidNonWhitelisted: true, // 데코레이터가 없는 속성이 있으면 요청 자체를 막아버림
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  async sendMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);
    if (!chatExists) {
      throw new WsException({
        code: 100,
        message: `존재하지 않는 채팅방입니다. chatId: ${dto.chatId}`,
      });
    }

    const message = await this.messagesService.createMessage(
      dto,
      socket.user.id,
    );
    // 모두한테 보내는 것
    // this.server
    //   .in(message.chatId.toString())
    //   .emit('receive_message', message.message);
    // 나를 빼고 모두한테 보내는 것
    socket
      .to(message.chat.id.toString())
      .emit('receive_message', message.message);
  }
}
