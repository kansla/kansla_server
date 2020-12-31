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

    conn.query(
        `select * from kansla_db.users where email = "${email}";`,
        function (err, rows, field) {
        if (err)  res.status(204).send({"code":204});
        if(rows.length == 0){
            res.status(204).send({"code":204});
        }
        else{   
            if (rows[0].pwd == pwd) {
                console.log("pass");
                res.status(200).json({"name":rows[0].name,"birth":rows[0].birth,"status_msg":rows[0].status_msg});
            }
            else{
                res.status(204).send({"code":204}); 
            }
        }
    } 
        
    );
    
    
});

module.exports = router;