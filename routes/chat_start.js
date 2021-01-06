const mysql = require("mysql");
var express = require("express");
var router = express.Router();
const dbconfig = require("../config/dbconfig");
const conn = mysql.createConnection(dbconfig);

router.post("/", function (req, res, next)  {
    let data = req.body;
    console.log(data);
    let first_email = data.first_email;
    let second_email = data.second_email;
    let friend_id;
    conn.query(
        `select user_id from users where email in("${first_email}","${second_email}");`,
        function (err, rows, field) {
          if (err) {
              console.log(err);
          }
          first_user_id = rows[0].user_id;
          console.log(first_user_id);
          second_user_id = rows[1].user_id;
          conn.query(
            `select friend_id from friend where ${first_user_id} in (first_user,second_user) and ${second_user_id} in (first_user,second_user);`,
            function (err, rows, field) {
              if (err) {
                  console.log(err);
                  res.statu(204).send({"code": 204});
              }
              else{
                friend_id = rows[0].friend_id;
                conn.query(
                    `select room_id from room where room_id = ${friend_id};`,
                    function (err, rows, field) {
                      if (err) {
                          console.log(err);
                      }
                      if(rows.length >0){
                          res.status(204).send({"code":204});
                      }
                      else{
                        conn.query(
                            `INSERT INTO room(room_id, last_msg) values(?, ?);`,
                            [friend_id,""],
                            function (err, rows, field) {
                              if (err) {
                                  console.log(err);
                              }
                              else{
                                  res.send({"code":200});
                              }
                            }
                          );
                      }
                    }
                  );
                
              }
            }
          );
        }
      );
});

module.exports = router;