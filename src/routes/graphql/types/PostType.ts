import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {UUIDType} from "./uuid.js";
import {UserType} from "./UserType.js";
import {Context} from "../interfaces.js";
import {GraphQLInputObjectType, GraphQLNonNull} from "graphql/index.js";
import {Post} from "@prisma/client";

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id:  { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
    author: {
      type: UserType,
      resolve: async (parent: Post, _, ctx: Context) => {
        return ctx.userLoader.load(parent.authorId);
      },
    },
  }),
});
export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});
export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});
