const mysql = require("mysql");
var express = require("express");
var router = express.Router();
const dbconfig = require("../config/dbconfig");
const conn = mysql.createConnection(dbconfig);

router.post("/friend_req", function (req, res, next)  {
    let data = req.body;
    console.log(data);
    let first_email = data.first_email;
    let second_email = data.second_email;

    conn.query(
        `INSERT INTO friend(first_user, second_user) values(?, ?)`,
        [first_email,second_email],
        function (err, rows, field) {
          if (err) {
              console.log(err);
              res.send({"code": 200});
          }
          console.log(rows[0]);
          //여기서 응답
          //res.redirect("/");
          res.json({code:200});
        }
      );
});

router.post("/friend_list", function (req, res, next)  {
  let data = req.body;
  console.log(data);
  let email = data.email;

  conn.query(
      `select users.name,users.email,users.image,users.status_msg from users Inner join (select second_user from friend where first_user = "${email}") as B On users.email = B.second_user;`,
      function (err, rows, field) {
          if (err)  res.status(204).send({"code":204});
          if(rows.length == 0){
              res.send("친구없음");
          }
          else{
            res.send({"code":200,
                        "count":rows.length,
                        friend:rows});
          }
          
      } 
      
  );
  
  
});


module.exports = router;    