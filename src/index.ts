import getDbConnection from './getDbConnection'

const start = async () => {
  await getDbConnection();
}

start();
