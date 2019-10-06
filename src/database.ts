import sqlite3 from 'sqlite3';

type RowData = {
  date: string,
  total: number,
}

export default class Database {
  database: any;
  constructor() {
    this.database = new sqlite3.Database('data.db', (err) => {
      if (err) {
        return console.log('sqlite3.Database: ', err.message);
      };
      console.log('connected to the db');
    });
  }
  async get(): Promise<RowData> {
    return new Promise((promise, reject) => {
      this.database.get(`SELECT * FROM log ORDER BY date DESC limit 1`, (err, row) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        console.log(row);
        return promise(row);
      });
    });
  }
};