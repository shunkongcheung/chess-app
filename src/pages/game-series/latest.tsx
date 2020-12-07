import { GetServerSidePropsContext } from "next";

import { GameSeries } from "../../entities";
import { getDbConnection } from "../../utils";

export default function GameSeriesPage() {
  return <>loading</>;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { res } = ctx;

  const conn = await getDbConnection();
  const latestGameSeries = (
    await conn
      .getRepository(GameSeries)
      .find({ take: 1, order: { id: "DESC" } })
  )[0];

  res.statusCode = 302;
  res.setHeader("Location", `/game-series/${latestGameSeries.id}`);

  return { props: {} };
};
