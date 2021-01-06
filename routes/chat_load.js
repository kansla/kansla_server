const mysql = require("mysql");
var express = require("express");
var router = express.Router();
const dbconfig = require("../config/dbconfig");
const conn = mysql.createConnection(dbconfig);

router.post("/", function (req, res, next)  {
    let data = req.body;
    console.log("23423234234234");
    console.log("chat_load");
    console.log('first');
    console.log(data);
    let first_email = data.first_email;
    let second_email = data.second_email;
    //let room = data.room;

    conn.query(
        `select user_id from users where email in("${first_email}","${second_email}");`,
        function (err, rows, field) {
            if (err)  console.log(err);
            else{
              console.log(rows);
              conn.query(
                `select friend_id from friend where first_user = ${rows[0].user_id} and second_user =${rows[1].user_id};`,
                function (err, rows, field) {
                    if (err)  console.log(err);
                    else{
                      console.log(rows);
                      console.log("roomName : ",rows[0].friend_id);
                    }
                    conn.query(
                        `select name, line_text,created_at from chat_line where friend_id = ${rows[0].friend_id} order by created_at ASC;`,
                        function (err, chat_line, field) {
                          if (err) {
                              console.log(err);
                              res.json(null);
                          }
                          console.log(chat_line[0]);
                          //여기서 응답
                          //res.redirect("/");
                          console.log("chat_load room",rows[0].friend_id);
                          res.send({"code":200,
                                    "room": String(rows[0].friend_id),
                                    "count":chat_line.length,
                                    "chat_line":chat_line});
                        }
                      );
                } 
              );
            }
        } 
      );
});

module.exports = router;