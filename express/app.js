var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var learn = require('./routes/learn');
var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods'); // 注册二级路由

var app = express();

var ejs = require('ejs');
// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.engine('.html',ejs.__express);
// app.set('view engine', 'jade');
app.set('view engine','html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public'))); // 静态文件

app.use((req,res,next) => {
	if(req.cookies.userId) {
	  next();
	} else {
		if( req.path==='/' ||req.originalUrl==='/users' || req.originalUrl==='/users/logout'|| req.path==='/goods') {
			next();
		} else {
			res.json({
				status:"10001",
				msg:"当前未登陆",
				result:""
			})
		}
	}
} );

app.use('/', index); // 进入首页
app.use('/users', users);
app.use('/goods',goods); // 注册二级路由
app.use('/learn',learn); // 用于js学习


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
