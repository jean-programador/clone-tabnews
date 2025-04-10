import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const versionResult = await database.query("SHOW server_version;");
  const versionValue = versionResult.rows[0].server_version;

  const maxConnectionResult = await database.query("SHOW max_connections;");
  const maxConnectionValue = maxConnectionResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const openedConnectionResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const openedConnectionValue = openedConnectionResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    database: {
      dependencies: {
        version: versionValue,
        max_connections: Number(maxConnectionValue),
        opened_connections: openedConnectionValue,
      },
    },
  });
}

export default status;
