const mysql = require("mysql");
var express = require("express");
var router = express.Router();
const dbconfig = require("../config/dbconfig");
const conn = mysql.createConnection(dbconfig);

router.post("/", function (req, res, next)  {
    let data = req.body;
    console.log(data);
    let email = data.email;

    conn.query(
        `select pwd from users where email = "${email}";`,
        function (err, rows, field) {
          if (err) {
              console.log(err);
              res.json(null);
          }
          console.log(rows[0]);
          //여기서 응답
          //res.redirect("/");
          res.send({"code":200,
            "pwd":rows[0].pwd} );
        }
      );
});



module.exports = router;