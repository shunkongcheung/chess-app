import { Resolver, Mutation, ObjectType, Field, Query } from "type-graphql";
import { getConnection } from "typeorm";

import { getBoardFromHash } from "../chess";
import insertNextBoardsAndMoves from "../services/insertNextBoardsAndMoves";
import insertInitialBoard from "../services/insertInitialBoard";
import { Board } from "../types";

@ObjectType()
class ChessBoardResult {
  @Field()
  id: number;

  @Field(() => [[String]])
  board: Array<Board>;
}

@ObjectType()
class InsertResult {
  @Field()
  from: ChessBoardResult;

  @Field(() => [ChessBoardResult])
  to: Array<ChessBoardResult>;
}

@Resolver()
class DataGeneratorResolver {
  @Query(() => String)
  async hello() {
    return "Hello world";
  }

  @Mutation(() => ChessBoardResult)
  async insertInitialBoard() {
    const conn = getConnection();
    const chessBoard = await insertInitialBoard(conn);
    return {
      id: chessBoard.id,
      board: getBoardFromHash(chessBoard.board),
    };
  }

  @Mutation(() => InsertResult)
  async insertNextBoardsAndMoves() {
    const conn = getConnection();
    const result = await insertNextBoardsAndMoves(conn);
    return {
      from: {
        id: result.from.id,
        board: getBoardFromHash(result.from.board),
      },
      to: result.to.map((chessBoard) => ({
        id: chessBoard.id,
        board: getBoardFromHash(chessBoard.board),
      })),
    };
  }
}

export default DataGeneratorResolver;
