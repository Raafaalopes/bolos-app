import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("bolos-app.db");
db.execSync("PRAGMA foreign_keys = ON;");
