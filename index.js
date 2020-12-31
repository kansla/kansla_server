const express = require('express');
const path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const mysql = require("mysql");
const dbconfig = require("./config/dbconfig");

var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var modifiRouter = require('./routes/modify');
var friendRouter = require('./routes/friend');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const conn = mysql.createConnection(dbconfig);

app.set('port', (process.env.PORT || 5000));
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/modify',modifiRouter);
app.use('/friend',friendRouter);
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
    console.log("Connected user ");
    socket.join(user['roomName']);
    console.log("roomName : ",user['roomName']);
    console.log("state : ",socket.adapter.rooms);
    io.emit('connect user', user);
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
    msg.emotion = 1;
    io.to(msg['roomName']).emit('chat message', msg);
  });
});

//맨처음에 서버 연결하면 몇번포트에 서버 연결되어있는지 ㅇㅇ
http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
