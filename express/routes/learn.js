
var express = require('express');
var router = express.Router();

router.all('*',function (req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});

/* GET home page. */
router.get('/api', function(req, res, next) {
  // res.render('index', { title: 'Express Good' });
  res.json({
      status:1,
      query:req.query
  })
});

router.post('/api', function(req, res, next) {
  res.json({
      status:1,
      query:req.body // post和get不一样
  })
});

router.get('/xhr',function(req,res,next){
  res.sendfile('./views/xhr/jq-xhr.html');
});

module.exports = router;