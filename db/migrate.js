const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

(async () => {
  sqlite3.verbose();

  const db = await open({
    filename: "./db/test.db",
    driver: sqlite3.Database,
    mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  });

  await db.migrate({
    migrationsPath: "./db/migrations",
  });
})();
