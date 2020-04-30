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

    """
    post(id: ID!): Post

    """

    """
    popularPosts: [Post]!

    """

    """
    recentPosts: [Post]!
  }

  type Mutation {
    """

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

    createAnswer(
      """

      """
      postId: ID!

      """

      """
      body: String!
    ): Answer!

    createComment(
      """

      """
      answerId: ID!

      """

      """
      body: String!
    ): Comment!

    likeAnswer(id: ID!): Boolean

    likeComment(id: ID!): Boolean

    dislikeAnswer(id: ID!): Boolean

    dislikeComment(id: ID!): Boolean
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

  # type Session {
  #   id: ID!
  #   token: String!
  # }

  # type Room {
  #   id: ID!
  #   name: String!
  #   members: [User]
  #   pomodoroSessions: [PomodoroSession]
  # }

  # type PomodoroSession {
  #   id: ID!
  #   type: PomodoroSessionType!
  #   startedAt: Timestamp!
  #   endedAt: Timestamp!
  # }

  # enum PomodoroSessionType {
  #   FOCUS
  #   BREAK
  # }

  # input PomodoroSessionInput {
  #   type: PomodoroSessionType!
  #   durationInSeconds: Int!
  # }

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
    CASH
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
    body: String!
    likes: Int!
    dislikes: Int!
    liked: Boolean!
    disliked: Boolean!
    author: UserProfile!
    post: Post!
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
