import sqlite3 from 'sqlite3';

const HOUR_END_OF_DAY = 4;

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
  async get(): Promise<number> {
    const startOfDay = new Date();
    const endOfDay = new Date();

    if (startOfDay.getHours() < HOUR_END_OF_DAY) {
      startOfDay.setHours(-24+HOUR_END_OF_DAY,0,0,0);
      endOfDay.setHours(HOUR_END_OF_DAY,0,0,0);
    } else {
      startOfDay.setHours(HOUR_END_OF_DAY,0,0,0);
      endOfDay.setHours(24+HOUR_END_OF_DAY,0,0,0);
    }

    return new Promise((promise, reject) => {
      this.database.all(`SELECT * FROM log WHERE datetime("${startOfDay.toISOString()}", "localtime") <= date AND date < datetime("${endOfDay.toISOString()}", "localtime") AND is_on = true ORDER BY date DESC`, (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }

        const result = rows.length;

        return promise(result);
      });
    });
  }
};