const mysql = require("mysql");
var express = require("express");
var router = express.Router();
const dbconfig = require("../config/dbconfig");
const conn = mysql.createConnection(dbconfig);

router.post("/", function (req, res, next)  {
    let data = req.body;
    console.log(data);
    let room = data.room;

    conn.query(
        `select name, line_text,created_at from chat_line where friend_id = ${room} order by created_at ASC;`,
        function (err, chat_line, field) {
          if (err) {
              console.log(err);
              res.json(null);
          }
          console.log(chat_line[0]);
          //여기서 응답
          //res.redirect("/");
          res.json({"code":200,
                    "count":chat_line.length,
                    "chat_line":chat_line});
        }
      );
});

module.exports = router;