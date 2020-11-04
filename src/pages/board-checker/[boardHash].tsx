import { GetServerSidePropsContext } from "next";
import axios from "axios";

import { getBoardFromHash } from "../../chess";
import BoardChecker from "../../containers/BoardChecker";

export default function BoardCheckerPage({ boardHash, chessMoves }) {
  const initialBoard = getBoardFromHash(boardHash);
  return <BoardChecker chessMoves={chessMoves} initialBoard={initialBoard} />;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { headers } = ctx.req;
  const { boardHash } = ctx.params;
  const { host } = headers;

  try {
    const chessMoves = await new Promise((resolve, reject) => {
      axios
        .get(`http://${host}/api/chess-moves?board=${boardHash}`)
        .then(({ data }) => resolve(data.results))
        .catch(reject);
    });
    return { props: { chessMoves, boardHash } };
  } catch (err) {
    return { props: { chessMoves: [], boardHash } };
  }
};
