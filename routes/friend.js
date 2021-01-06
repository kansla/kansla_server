const mysql = require("mysql");
var express = require("express");
var router = express.Router();
const dbconfig = require("../config/dbconfig");
const { user } = require("../config/dbconfig");
const conn = mysql.createConnection(dbconfig);

router.post("/friend_req", function (req, res, next)  {
    let data = req.body;
    console.log(data);
    let first_email = data.first_email;
    let second_email = data.second_email;
    let first_user_id;
    let second_user_id;

    conn.query(
      `select user_id from users where email in("${first_email}","${second_email}");`,
      function (err, rows, field) {
        if (err) {
            console.log(err);
        }
        try{
        first_user_id = rows[0].user_id;
        console.log(first_user_id);
        second_user_id = rows[1].user_id;
        }
        catch(e){
          console.log(e);
          res.status(204).send({"code":204});
          return;
        }
        conn.query(
          `select friend_id from friend where ${first_user_id} in(first_user,second_user) and ${second_user_id} in (first_user,second_user); `,
          function (err, rows, field) {
            if (err) {
                console.log(err);
                res.status(204).send({"code":204});
            }
            else{
                if(rows.length>0){
                  res.status(204).send({"code":204})
                }
                else{
                  conn.query(
                    `INSERT INTO friend(first_user, second_user) values(?, ?)`,
                    [first_user_id,second_user_id],
                    function (err, rows, field) {
                      if (err) {
                          console.log(err);
                          res.status(204).send({"code": 204});
                      }
                      console.log(rows[0]);
                      //여기서 응답
                      //res.redirect("/");
                      res.json({code:200});
                    }
                  );
                }
            }
          }
        );
        
      }
    );
});

router.post("/friend_list", function (req, res, next)  {
  let data = req.body;
  console.log(data);
  let email = data.email;
  let user_id;

  conn.query(
    `select user_id from users where email="${email}";`,
    function (err, rows, field) {
        if (err)  res.status(204).send({"code":204});
        
        console.log(rows);
        user_id = rows[0].user_id;

        conn.query(
          `select users.user_id, users.name,users.email,users.image,users.status_msg from kansla.users where users.user_id in (select second_user from friend where first_user=${user_id}) or users.user_id in (select first_user from friend where second_user=${user_id});`,
          function (err, rows, field) {
              if (err)  res.status(204).send({"code":204});
              if(rows.length == 0){
                  res.send("친구없음");
              }
              else{
                res.send({"code":200,
                        "count":rows.length,
                            "friend":rows});
              }
              console.log(rows);
              
          } 
      );
        
    } 
    
    
);
  
  
});


module.exports = router;    