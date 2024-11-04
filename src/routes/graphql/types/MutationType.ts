import {GraphQLObjectType, GraphQLString} from "graphql";
import {ChangeUserInputType, CreateUserInput, UserType} from "./UserType.js";
import {GraphQLNonNull} from "graphql/index.js";
import {CreateProfileInput, ProfileType,ChangeProfileInput} from "./ProfileType.js";
import {CreatePostInput, PostType, ChangePostInput} from "./PostType.js";
import {UUIDType} from "./uuid.js";
import {
  ChangePostInputDto, ChangeProfileInputDto,
  ChangeUserDto,
  Context,
  CreatePostDto,
  CreateProfileDto,
  CreateUserDto
} from "../interfaces.js";

export const MutationType = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: UserType,
      args: {dto: {type: new GraphQLNonNull(CreateUserInput)}},
      resolve: async (obj, args: object, ctx: Context) => {
        const dto = args['dto'] as CreateUserDto;
        return ctx.prisma.user.create({
          data: dto,
        });
      },
    },
    createProfile: {
      type: ProfileType,
      args: {dto: {type: new GraphQLNonNull(CreateProfileInput)}},
      resolve: async (obj, args: object, ctx: Context) => {
        const dto = args['dto'] as CreateProfileDto;
        return ctx.prisma.profile.create({
          data: dto,
        });
      },
    },
    createPost: {
      type: PostType,
      args: {dto: {type: new GraphQLNonNull(CreatePostInput)}},
      resolve: async (obj, args: object, ctx: Context) => {
        const dto = args['dto'] as CreatePostDto;
        return ctx.prisma.post.create({
          data: dto,
        });
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (obj, args: object, ctx: Context) => {
        const id = args['id'] as string;
        const dto = args['dto'] as ChangePostInputDto;
        return ctx.prisma.post.update({
          where: { id },
          data: dto,
        });
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (obj, args: object, ctx: Context) => {
        const id = args['id'] as string;
        const dto = args['dto'] as ChangeProfileInputDto;
        return ctx.prisma.profile.update({
          where: { id },
          data: dto,
        });
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: {type: new GraphQLNonNull(UUIDType)},
        dto: {type: new GraphQLNonNull(ChangeUserInputType)},
      },
      resolve: async (obj, args: object, ctx: Context) => {
        const id = args['id'] as string;
        const dto = args['dto'] as ChangeUserDto;
        return ctx.prisma.user.update({
          where: {id},
          data: dto,
        });
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, ctx: Context) => {
        await ctx.prisma.user.delete({
          where: { id },
        });
      },
    },
    deletePost: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, ctx: Context) => {
        await ctx.prisma.post.delete({
          where: { id },
        });
      },
    },
    deleteProfile: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, ctx: Context) => {
        await ctx.prisma.profile.delete({
          where: { id },
        });
      },
    },
    subscribeTo: {
      type: GraphQLString,
      args: {
        userId: {type: new GraphQLNonNull(UUIDType)},
        authorId: {type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_, { userId, authorId }: { userId: string; authorId: string }, ctx: Context) => {
        await ctx.prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId,
          },
        });
      },
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: {type: new GraphQLNonNull(UUIDType)},
        authorId: {type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_, { userId, authorId }: { userId: string; authorId: string }, ctx: Context) => {
        await ctx.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
      },
    },
  },
});
