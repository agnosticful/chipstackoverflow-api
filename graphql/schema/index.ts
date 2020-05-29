import { gql } from "apollo-server-fastify";

export default gql`
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    """
    Returns the request user by the given authentication token.
    """
    myself: User!

    """
    Returns the post by the given id.
    """
    post(id: ID!): Post

    """
    Returns posts in popularity order.
    """
    popularPosts: [Post]!

    """
    Returns posts in chronological order.
    """
    recentPosts: [Post]!
  }

  type Mutation {
    """
    Creates a post by the given params and returns it.
    """
    createPost(
      """

      """
      title: String!

      """

      """
      body: String!

      """

      """
      gameType: GameType!

      """

      """
      playerLength: Int!

      """

      """
      playerStackSizes: [Float]!

      """

      """
      playerCards: [[PlayingCardInput]]!

      """

      """
      communityCards: [PlayingCardInput]!

      """

      """
      heroIndex: Int!

      """

      """
      smallBlindSize: Float!

      """

      """
      antiSize: Float!

      """

      """
      preflopActions: [GameStreetActionInput]!

      """

      """
      flopActions: [GameStreetActionInput]!

      """

      """
      turnActions: [GameStreetActionInput]!

      """

      """
      riverActions: [GameStreetActionInput]!
    ): Post!

    """
    Creates an answer to a post with the given params.
    """
    createAnswer(
      """
      ID that points the target Post.
      """
      postId: ID!

      """

      """
      body: String!
    ): Answer!

    """
    Creates an comment to an answer with the given params.
    """
    createComment(
      """
      ID that points the target answer.
      """
      answerId: ID!

      """

      """
      body: String!
    ): Comment!

    """
    Likes an answer. If the request user already disliked the answer, it will be un-disliked.
    """
    likeAnswer(id: ID!): Boolean

    """
    Likes a comment. If the request user already disliked the answer, it will be un-disliked.
    """
    likeComment(id: ID!): Boolean

    """
    Dislikes an answer. If the request user already disliked the answer, it will be un-liked.
    """
    dislikeAnswer(id: ID!): Boolean

    """
    Dislikes a comment. If the request user already disliked the answer, it will be un-liked.
    """
    dislikeComment(id: ID!): Boolean

    """
    Takes back like or dislike on an answer.
    """
    unlikeAnswer(id: ID!): Boolean

    """
    Takes back like or dislike on a comment.
    """
    unlikeComment(id: ID!): Boolean
  }

  type User {
    id: ID!
    email: String
    name: String!
    profileImageURL: String!
  }

  type UserProfile {
    id: ID!
    name: String!
    profileImageURL: String!
  }

  type Post {
    """

    """
    id: ID!

    """

    """
    title: String!

    """

    """
    body: String!

    """

    """
    gameType: GameType!

    """

    """
    playerLength: Int!

    """

    """
    playerStackSizes: [Float]!

    """

    """
    playerCards: [[PlayingCard]]!

    """

    """
    communityCards: [PlayingCard]!

    """

    """
    heroIndex: Int!

    """

    """
    smallBlindSize: Float!

    """

    """
    antiSize: Float!

    """

    """
    preflopActions: [GameStreetAction]!

    """

    """
    flopActions: [GameStreetAction]!

    """

    """
    turnActions: [GameStreetAction]!

    """

    """
    riverActions: [GameStreetAction]!

    """

    """
    likes: Int!

    """

    """
    dislikes: Int!

    """

    """
    author: UserProfile!

    """

    """
    answers: [Answer]!

    """

    """
    createdAt: Timestamp!

    """

    """
    updatedAt: Timestamp!
  }

  enum GameType {
    """

    """
    CASH

    """

    """
    TOURNAMENT
  }

  type PlayingCard {
    rank: Rank!
    suit: Suit!
  }

  enum Rank {
    ACE
    DEUCE
    THREE
    FOUR
    FIVE
    SIX
    SEVEN
    EIGHT
    NINE
    TEN
    JACK
    QUEEN
    KING
  }

  enum Suit {
    SPADE
    HEART
    DIAMOND
    CLUB
  }

  type GameStreetAction {
    type: GameStreetActionType!
    playerIndex: Int!
    betSize: Float!
  }

  enum GameStreetActionType {
    FOLD
    CHECK
    CALL
    BET
    RAISE
  }

  type Answer {
    id: ID!

    """
    Answer body.
    """
    body: String!

    """
    Number of likes to the answer.
    """
    likes: Int!

    """
    Number of dislikes to the answer.
    """
    dislikes: Int!

    """
    Whether the request user liked the answer or not.
    """
    liked: Boolean!

    """
    Whether the request user disliked the answer or not.
    """
    disliked: Boolean!

    """
    The user who created the answer.
    """
    author: UserProfile!

    """
    The post which the answer created for.
    """
    post: Post!

    """
    The comments which are in the answer.
    """
    comments: [Comment]!
  }

  type Comment {
    id: ID!
    body: String!
    likes: Int!
    dislikes: Int!
    liked: Boolean!
    disliked: Boolean!
    author: UserProfile!
    answer: Answer!
  }

  input PlayingCardInput {
    rank: Rank!
    suit: Suit!
  }

  input GameStreetActionInput {
    type: GameStreetActionType!
    playerIndex: Int!
    betSize: Float!
  }

  """
  Date and time expression. Serialized as ISO-8601 string format.
  """
  scalar Timestamp
`;
