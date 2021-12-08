/* istanbul ignore file */

// external agency
import Jwt from '@hapi/jwt';
import bcrypt from 'bcrypt';
import { createContainer } from 'instances-container';
import { nanoid } from 'nanoid';

import pool from './database/postgres/pool';
import AuthenticationRepositoryPostgres from './repository/AuthenticationRepositoryPostgres';
import CommentLikeRepositoryPostgres from './repository/CommentLikeRepositoryPostgres';
import CommentRepositoryPostgres from './repository/CommentRepositoryPostgres';
import ReplyRepositoryPostgres from './repository/ReplyRepositoryPostgres';
import ThreadRepositoryPostgres from './repository/ThreadRepositoryPostgres';
import UserRepositoryPostgres from './repository/UserRepositoryPostgres';
import BcryptPasswordHash from './security/BcryptPasswordHash';
import JwtTokenManager from './security/JwtTokenManager';

import AuthenticationTokenManager from '../Applications/security/AuthenticationTokenManager';
import PasswordHash from '../Applications/security/PasswordHash';
import AddCommentUseCase from '../Applications/use_case/AddCommentUseCase';
import AddReplyUseCase from '../Applications/use_case/AddReplyUseCase';
import AddThreadUseCase from '../Applications/use_case/AddThreadUseCase';
import AddUserUseCase from '../Applications/use_case/AddUserUseCase';
import DeleteCommentUseCase from '../Applications/use_case/DeleteCommentUseCase';
import DeleteReplyUseCase from '../Applications/use_case/DeleteReplyUseCase';
import GetThreadUseCase from '../Applications/use_case/GetThreadUseCase';
import LoginUserUseCase from '../Applications/use_case/LoginUserUseCase';
import LogoutUserUseCase from '../Applications/use_case/LogoutUserUseCase';
import RefreshAuthenticationUseCase from '../Applications/use_case/RefreshAuthenticationUseCase';
import ToggleCommentLikeUseCase from '../Applications/use_case/ToggleCommentLikeUseCase';
import AuthenticationRepository from '../Domains/authentications/AuthenticationRepository';
import CommentLikeRepository from '../Domains/commentlikes/CommentLikeRepository';
import CommentRepository from '../Domains/comments/CommentRepository';
import ReplyRepository from '../Domains/replies/ReplyRepository';
import ThreadRepository from '../Domains/threads/ThreadRepository';
import UserRepository from '../Domains/users/UserRepository';

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [{ concrete: pool }, { concrete: nanoid }],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [{ concrete: pool }, { concrete: nanoid }],
    },
  },
  {
    key: ReplyRepository.name,
    Class: ReplyRepositoryPostgres,
    parameter: {
      dependencies: [{ concrete: pool }, { concrete: nanoid }],
    },
  },
  {
    key: CommentLikeRepository.name,
    Class: CommentLikeRepositoryPostgres,
    parameter: {
      dependencies: [{ concrete: pool }, { concrete: nanoid }],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadRepository', internal: ThreadRepository.name },
      ],
    },
  },
  {
    key: GetThreadUseCase.name,
    Class: GetThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadRepository', internal: ThreadRepository.name },
        { name: 'commentRepository', internal: CommentRepository.name },
        { name: 'replyRepository', internal: ReplyRepository.name },
        { name: 'commentLikeRepository', internal: CommentLikeRepository.name },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'commentRepository', internal: CommentRepository.name },
        { name: 'threadRepository', internal: ThreadRepository.name },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'commentRepository', internal: CommentRepository.name },
      ],
    },
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'replyRepository', internal: ReplyRepository.name },
        { name: 'commentRepository', internal: CommentRepository.name },
        { name: 'threadRepository', internal: ThreadRepository.name },
      ],
    },
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'replyRepository', internal: ReplyRepository.name },
      ],
    },
  },
  {
    key: ToggleCommentLikeUseCase.name,
    Class: ToggleCommentLikeUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadRepository', internal: ThreadRepository.name },
        { name: 'commentRepository', internal: CommentRepository.name },
        { name: 'commentLikeRepository', internal: CommentLikeRepository.name },
      ],
    },
  },
]);

export default container;
