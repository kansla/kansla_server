const express = require('express');
const path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const mysql = require("mysql");
const dbconfig = require("./config/dbconfig");
const http_req  = require('http');

var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var modifiRouter = require('./routes/modify');
var friendRouter = require('./routes/friend');
var roomRouter = require('./routes/room_list');
var pwdRouter = require('./routes/password');
var loadRouter = require('./routes/chat_load');
var startRouter = require('./routes/chat_start');
const { json } = require('express');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.json({limit: '10mb', extended: true}))
app.use(express.urlencoded({limit: '10mb', extended: true}))
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const conn = mysql.createConnection(dbconfig);

app.set('port', (process.env.PORT || 5000));
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/modify',modifiRouter);
app.use('/friend',friendRouter);
app.use('/chat_room',roomRouter);
app.use('/password',pwdRouter);
app.use('/chat_load',loadRouter);
app.use('/chat_start',startRouter);
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//서버연결하기 직전에뜸
console.log("outside io");

io.on('connection', function(socket){
  //로그인하면 이거 밑에 두개뜸
  console.log('User Conncetion');

  socket.on('connect user', function(user){
    console.log('실행');
    console.log('second');
    console.log(user);  
    socket.join(user['room']);
    console.log("roomName : ",user['room']);
    console.log("state : ",socket.adapter.rooms);
    //io.to(user['room']).emit('connect user', user);
    // conn.query(
    //   `INSERT INTO room(room_id, last_msg) values(?, ?);`,
    //   [email, pwd, name, birth],
    //   function (err, rows, field) {
    //     if (err) {
    //         console.log(err);
    //         res.json(null);
    //     }
    //     console.log(rows[0]);
    //     //여기서 응답
    //     //res.redirect("/");
    //     res.json({code:200});
    //   }
    // );
    // conn.query(
    //   `select user_id from users where email in("${user['first_email']}","${user['second_email']}");`,
    //   function (err, rows, field) {
    //       if (err)  console.log(err);
    //       else{
    //         console.log(rows);
    //         conn.query(
    //           `select friend_id from friend where first_user = ${rows[0].user_id} and second_user =${rows[1].user_id};`,
    //           function (err, rows, field) {
    //               if (err)  console.log(err);
    //               else{
    //                 console.log(rows);
                    
    //               }
    //           } 
    //         );
    //       }
    //   } 
    // );
    
  });

  socket.on('leave', function(data) {
    console.log('leave')
    console.log(data.room);
    socket.leave(data.room); 
    });


  //타이핑중에 이거뜸
  socket.on('on typing', function(typing){
    console.log("Typing.... ");
    io.emit('on typing', typing);
  });

  //메세지 입력하면 서버 로그에 이거뜸
  socket.on('chat message', function(msg){
    console.log("Message " + msg['message']);
    console.log("보내는 메세지 : ",msg['roomName']);
    console.log("Script:",msg['script']);
    console.log(msg);
    conn.query(
      `INSERT INTO chat_line(friend_id, name,line_text,created_at) values(?, ?,?,?);`,
      [msg['room'],msg['name'],msg['script'],msg['date_time']],
      function (err, rows, field) {
        if (err) {
            console.log(err);
        }
        console.log(rows[0]);
        //여기서 응답
        //res.redirect("/");
      }
    );

    conn.query(
      `update room set last_msg = "${msg['script']}" where room_id = ${msg['room']};`,
      function (err, rows, field) {
        if (err) {
            console.log(err);
        }
        console.log(rows[0]);
        //여기서 응답
        //res.redirect("/");
      }
    );

    http_req.get(`http://api.adams.ai/datamixiApi/omAnalysis?query=${msg['script']}.&type=1&key=4072973050548806769`, res =>{
      let data = '';
      let json_data ;
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(data);
        json_data = JSON.parse(data);
        console.log(json_data);
        
        if(json_data['return_object']['Result']['0'][0]>0.7){
          msg.emotion = json_data['return_object']['Result']['0'][1];
          
        }
        else{
          msg.emotion = '중립';
        }
        console.log(msg);
        io.to(msg['room']).emit('chat message', msg);
      });

      

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  });
});

//맨처음에 서버 연결하면 몇번포트에 서버 연결되어있는지 ㅇㅇ
http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
