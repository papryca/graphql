import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat, GraphQLList, GraphQLInputObjectType, GraphQLNonNull,
} from 'graphql';
import {ProfileType} from "./ProfileType.js";
import {PostType} from "./PostType.js";
import {UUIDType} from "./uuid.js";
import {Context} from "../interfaces.js";

export interface User {
  id?: string;
  name: string;
  balance: number;
  userSubscribedTo?: {
    subscriberId: string;
    authorId: string;
  }[];
  subscribedToUser?: {
    subscriberId: string;
    authorId: string;
  }[];
}

export const UserType: GraphQLObjectType = new GraphQLObjectType<User>({
  name: 'User',
  fields: () => ({
    id: {type: UUIDType},
    name: {type: GraphQLString},
    balance: {type: GraphQLFloat},
    profile: {
      type: ProfileType,
      resolve: async (obj: User, args, ctx: Context) => {
        return ctx.profileLoader.load(obj.id as string);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (obj: User, args, ctx: Context) => {
        return ctx.postLoader.load(obj.id as string);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (obj: User, args, ctx: Context) => {
        let ids = obj.userSubscribedTo?.map((s) => s.authorId)
        if (!ids) {
          ids = [];
        }
        return ctx.userLoader.loadMany(ids)
      }
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (obj: User, args, ctx: Context) => {
        let ids = obj.subscribedToUser?.map((s) => s.subscriberId)
        if (!ids) {
          ids = [];
        }
        return ctx.userLoader.loadMany(ids)
      }
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: {type: new GraphQLNonNull(GraphQLString)},
    balance: {type: new GraphQLNonNull(GraphQLFloat)},
  },
});
export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: {type: GraphQLString},
    balance: {type: GraphQLFloat},
  },
});
