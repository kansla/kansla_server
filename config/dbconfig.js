require("dotenv").config();

var dbconfig = {
  host: process.env.host,
  user: process.env.user,
  port: process.env.db_port,
  password: process.env.password,
  database: process.env.database,
};

module.exports = dbconfig;
