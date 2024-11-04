import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean, GraphQLInt,
} from 'graphql';
import {Profile} from '@prisma/client';
import {GraphQLInputObjectType, GraphQLNonNull} from "graphql/index.js";
import {UserType} from "./UserType.js";
import {MemberTypeType, MemberTypeIdType} from "./MemberTypeType.js";
import {UUIDType} from "./uuid.js";
import {Context} from "../interfaces.js";

export const ProfileType = new GraphQLObjectType<Profile>({
  name: 'Profile',
  fields: () => ({
    id: { type: GraphQLString },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdType },
    user: {
      type: UserType,
      async resolve(parent: Profile, _, ctx: Context) {
        const id: string = parent.userId;
        return await ctx.userLoader.load(id);
      },
    },
    memberType: {
      type: MemberTypeType,
      async resolve(parent: Profile, _, ctx: Context) {
        const id: string = parent.memberTypeId;
        return await ctx.memberLoader.load(id);
      },
    },
  }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdType) },
  },
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdType },
  },
});


