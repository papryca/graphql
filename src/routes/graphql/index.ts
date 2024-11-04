import {FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox';
import {createGqlResponseSchema, gqlResponseSchema, schema} from './schemas.js';
import {graphql, parse, validate} from 'graphql';
import DataLoader from "dataloader";
import depthLimit from "graphql-depth-limit";
import {Context} from "./interfaces.js";
import {MemberType, Post, Profile} from "@prisma/client";
import {User} from "./types/UserType.js"



const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const {prisma} = fastify;

  const userLoader = new DataLoader<string, User | null>(async (ids: readonly string[]) => {
    let usersByIds = await prisma.user.findMany({
      where: { id: { in: ids as string[] } },
      include: { userSubscribedTo: true, subscribedToUser: true },
    });

    if (!usersByIds) {
      usersByIds = []
    }

    const usersById = new Map<string, User>();
    const sortedByIds: Array<User | null> = [];

    usersByIds.forEach((user) => {
      usersById.set(user.id, user);
    });

    ids.forEach((id) => {
      sortedByIds.push(usersById.get(id) || null);
    });

    return sortedByIds;
  });

  const profileLoader = new DataLoader<string, Profile | null>(async (ids: readonly string[]) => {
    let result = await prisma.profile.findMany({
      where: {userId: {in: ids as string[] | undefined}},
    });

    if (!result) {
      result = []
    }

    return ids.map((id) => result.find((x) => x.userId === id) || null);
  });

  const postLoader = new DataLoader<string, Post[] | null>(async (ids: readonly string[]) => {
    const postsByIds = await prisma.post.findMany({
      where: { authorId: { in: ids as string[] | undefined } },
    });

    const postsByAuthorId = new Map<string, Post[]>();
    const sortedByIds: Array<Post[] | null> = [];

    postsByIds.forEach((post) => {
      const authorPosts = postsByAuthorId.get(post.authorId) || [];
      authorPosts.push(post);
      postsByAuthorId.set(post.authorId, authorPosts);
    });

    ids.forEach((id) => {
      sortedByIds.push(postsByAuthorId.get(id) || null);
    });

    return sortedByIds;
  });

  const memberLoader = new DataLoader<string, MemberType | null>(async (ids: readonly string[]) => {
    const result = await prisma.memberType.findMany({
      where: { id: { in: ids as string[] | undefined } },
    });
    return ids.map((id) => result.find((x) => x.id === id) || null);
  });

  const ctx: Context = {
    prisma,
    userLoader,
    profileLoader,
    postLoader,
    memberLoader
  };

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const {query, variables} = req.body;

      const validationRules = [depthLimit(5)];
      const errors = validate(schema, parse(query), validationRules);

      if (errors.length > 0) {
        return {errors: errors};
      }

      const res =  await graphql({
        schema: schema,
        source: query,
        variableValues: variables,
        contextValue: ctx,
      });

      return res
    },
  });
};

export default plugin;
