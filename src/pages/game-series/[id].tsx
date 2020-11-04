import { GetServerSidePropsContext } from "next";
import axios from "axios";

import GameSeries from "../../containers/GameSeries";

export default function GameSeriesPage({ moveSequences }) {
  return <GameSeries moveSequences={moveSequences} />;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { headers } = ctx.req;
  const { id } = ctx.params;
  const { host } = headers;

  try {
    const moveSequences = await new Promise((resolve, reject) => {
      axios
        .get(`http://${host}/api/move-sequence?gameSeries=${id}`)
        .then(({ data }) => resolve(data.results))
        .catch(reject);
    });
    return { props: { moveSequences } };
  } catch (err) {
    return { props: { moveSequences: [] } };
  }
};
