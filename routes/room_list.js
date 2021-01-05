const mysql = require("mysql");
var express = require("express");
var router = express.Router();
const dbconfig = require("../config/dbconfig");
const conn = mysql.createConnection(dbconfig);

router.post("/", function (req, res, next)  {
    let data = req.body;
    console.log(data);
    let email = data.email;
    let msg;
    conn.query(
        `select users.user_id from users where users.email = "${email}";`,
        function (err, rows, field) {
          if (err) {
              console.log(err);
              res.json(null);
          }
          console.log(rows[0]);
          let user_id = rows[0].user_id;
          conn.query(
            `select * from room where room_id in (select friend.friend_id from friend where ${user_id} = friend.first_user or ${user_id} = friend.second_user);`,
            function (err, rows, field) {
              if (err) {
                  console.log(err);
                  res.json(null);
              }
               msg = rows;
              
                console.log(msg);

              //여기서 응답
              //res.redirect("/");
              
            }
          );

          conn.query(
            `select users.name,users.email from kansla.users where users.user_id in (select second_user from friend where first_user=${user_id}) or users.user_id in (select first_user from friend where second_user=${user_id});`,
            function (err, rows, field) {
              if (err) {
                  console.log(err);
                  res.json(null);
              }
              console.log(rows[0]);
              //여기서 응답 
              //res.redirect("/");
              name = rows;
              json = {"code": 200,"count":rows.length,msg ,name};
              //console.log(json);
              res.send(json);
            }
          );
          
        }
      );
});



module.exports = router;