import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();

 export const db = new sqlite.Database(
  "C:/Users/vivek/Downloads/portfolio.db",
  (error: Error | null) => {
    if (error) {
      console.error("Error connecting to database:", error.message);
    } else {
      console.log("Connected to SQLite");
    }
  }
);

 