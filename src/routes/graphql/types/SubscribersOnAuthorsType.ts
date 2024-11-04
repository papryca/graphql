import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';


export const SubscribersOnAuthorsType = new GraphQLObjectType({
  name: 'SubscriberOnAuthor',
  fields: {
    subscriberId: { type: GraphQLString },
    authorId: { type: GraphQLString },
  },
});

