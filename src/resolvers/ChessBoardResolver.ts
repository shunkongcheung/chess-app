import { Resolver, Query, Arg, FieldResolver, Root } from "type-graphql";
import { getConnection } from "typeorm";

import { getBoardFromHash } from "../chess";
import { ChessBoard, ChessMove } from "../entities";

@Resolver(() => ChessBoard)
class ChessBoardResolver {
  @Query(() => ChessBoard)
  async chessBoard(@Arg("shortHash") shortHash: string) {
    const INITIAL_BOARD_HASH = "33208e25";
    shortHash = shortHash || INITIAL_BOARD_HASH;
    const conn = getConnection();
    return conn.getRepository(ChessBoard).findOne({ shortHash });
  }

  @FieldResolver(() => [[String]])
  board(@Root() chessBoard: ChessBoard) {
    return getBoardFromHash(chessBoard.board);
  }

  @FieldResolver(() => [ChessMove])
  async froms(@Root() chessBoard: ChessBoard) {
    const conn = getConnection();
    return conn.getRepository(ChessMove).find({
      where: { toBoard: { id: chessBoard.id } },
      relations: ["fromBoard", "toBoard"],
    });
  }

  @FieldResolver(() => [ChessMove])
  async tos(@Root() chessBoard: ChessBoard) {
    const conn = getConnection();
    return conn.getRepository(ChessMove).find({
      where: { fromBoard: { id: chessBoard.id } },
      relations: ["fromBoard", "toBoard"],
    });
  }
}

export default ChessBoardResolver;
