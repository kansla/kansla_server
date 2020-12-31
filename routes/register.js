const mysql = require("mysql");
var express = require("express");
var router = express.Router();
const dbconfig = require("../config/dbconfig");
const conn = mysql.createConnection(dbconfig);

router.post("/", function (req, res, next)  {
    let data = req.body;
    console.log(data);
    let email = data.email;
    let pwd = data.pwd;
    let name = data.name;
    let birth = data.birth;

    conn.query(
        `INSERT INTO users(email, pwd, name, birth) values(?, ?, ?,?)`,
        [email, pwd, name, birth],
        function (err, rows, field) {
          if (err) {
              console.log(err);
              res.json(null);
          }
          console.log(rows[0]);
          //여기서 응답
          //res.redirect("/");
          res.json({code:200});
        }
      );
});

router.post("/check_email", function (req, res, next)  {
  let data = req.body;
  console.log(data);
  let email = data.email;

  conn.query(
      `select email from kansla_db.users where email = "${email}";`,
      function (err, rows, field) {
          if (err)  res.status(204).send({"code":204});
          if(rows.length == 0){
              res.send({"code":200});
          }
          else{
             res.status(204).send({"code":204});
          }
      } 
      
  );
  
  
});


module.exports = router;