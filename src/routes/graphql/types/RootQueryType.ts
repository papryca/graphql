import {GraphQLList, GraphQLObjectType, GraphQLResolveInfo} from "graphql";
import {UserType} from "./UserType.js";
import {User} from '@prisma/client';
import {GraphQLNonNull} from "graphql/index.js";
import {UUIDType} from "./uuid.js";
import {ProfileType} from "./ProfileType.js";
import {PostType} from "./PostType.js";
import {Profile, Post} from '@prisma/client';
import {Context} from "../interfaces.js";
import {MemberTypeIdType, MemberTypeType} from "./MemberTypeType.js";

import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (obj, args, ctx: Context, info: GraphQLResolveInfo): Promise<User[]> => {

        const parsedInfoObject: ResolveTree = parseResolveInfo(info) as ResolveTree;
        const { fields } = simplifyParsedResolveInfoFragmentWithType(
          parsedInfoObject,
          info.returnType,
        );
        const userSubscribedTo = fields['userSubscribedTo'] != undefined;
        const subscribedToUser = fields['subscribedToUser'] != undefined;

        const users = await ctx.prisma.user.findMany({
          include: { userSubscribedTo, subscribedToUser },
        });

        users.forEach((user) => {
          ctx.userLoader.prime(user.id, user);
        });

        return users;
      },
    },

    user: {
      type: UserType,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: async (obj, args: object, ctx: Context): Promise<User | null> => {
        return ctx.prisma.user.findUnique({
          where: {id: args['id'] as string},
          include: { userSubscribedTo: true, subscribedToUser: true },
        });
      },
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (obj, args: object, ctx: Context): Promise<Profile[] | null> => {
        return ctx.prisma.profile.findMany();
      },
    },

    profile: {
      type: ProfileType,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: async (obj, args: object, ctx: Context): Promise<Profile | null> => {
        return ctx.prisma.profile.findUnique({
          where: {id: args['id'] as string},
        });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (obj, args: object, ctx: Context): Promise<Post[]> => {
        return ctx.prisma.post.findMany();
      },
    },

    post: {
      type: PostType,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: async (obj, args: object, ctx: Context): Promise<Post | null> => {
        return ctx.prisma.post.findUnique({
          where: {id: args['id'] as string},
        });
      },
    },

    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      async resolve(_, __, ctx: Context) {
        return ctx.prisma.memberType.findMany();
      },
    },

    memberType: {
      type: MemberTypeType,
      args: { id: { type: MemberTypeIdType } },
      async resolve(_, args: object, ctx: Context) {
        const id: string = args['id'] as string;
        return ctx.prisma.memberType.findUnique({
          where: {
            id: id,
          },
        });
      },
    },
  },
});
