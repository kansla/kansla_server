const mysql = require("mysql");
var express = require("express");
var router = express.Router();
const dbconfig = require("../config/dbconfig");
const conn = mysql.createConnection(dbconfig);

router.post('/check_pwd',function(req,res,next){
    let data = req.data;
    let email = data.email;
    let pwd = data.pwd;

    conn.query(
        `select pwd from kansla.users where email = "${email}";`,
        function (err, rows, field) {
            if (err)  res.status(204).send({"code":204});
            if(rows.length == 0){
                res.status(204).send({"code":204});
            }
            else{
                if (rows[0].pwd == pwd) {
                    console.log("pass");
                    res.send({"code":200});
                }
                else{
                    res.status(204).send({"code":204}); 
                }
            }
        } 
        
    );
});

router.post("/", function (req, res, next)  {
    let data = req.body;
    console.log(data);
    let origin = data.origin_email;
    let email = data.email;
    let pwd = data.pwd;
    let name = data.name;
    let birth = data.birth;
    let status_msg = data.status_msg;
    let image = data.image;

    conn.query(
        `update kansla.users set email="${email}", pwd="${pwd}",name="${name}",birth="${birth}",status_msg="${status_msg}" where email="${origin}";`,
        function (err, rows, field) {
            if (err){
                res.status(204).send({"code":204});
                console.log(err);  
            } 
            else{
                res.send({"code": 200});
            }
        }   
    );    
});

module.exports = router;