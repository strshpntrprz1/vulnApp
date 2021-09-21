var express = require('express');
var router = express.Router();
var app = express()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: req.query.name });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login',)
});

/*POST login page. */
router.post('/login', function(req, res, next) {
  if (req.body.uName == 'test' && req.body.passWD == 'test'){
    req.session.userId = req.body.uName;
      res.render('profile');
    return;
    console.log(userId);
  }
  else {
    res.send(400);
  }
  console.log('Status: ${res.statusCode}');
  res.render('login', {
    error: 'Invalid password'
  })
});

module.exports = router;
