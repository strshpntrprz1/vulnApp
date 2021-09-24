var express = require('express');
const md5 = require('md5');
const db = require('../database');
var router = express.Router();
var app = express()
var session = require('express-session');
const { json } = require('express');
var authenticated = false;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: req.query.name });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { 
    title: req.query.name });
});

/* GET register page */
router.get ('/register', function(req, res, next) {
  res.render('register');
});

/* GET profile page */
router.get('/profile', function(req, res, next) {
  if(!authenticated) {
    res.status(403).json("THE DARK FIRE WILL NOT AVAIL YOU, YOU SHALL NOT PASSsssss!");
  } else {
    res.render('profile');
  }
});

/* POST profile page */
router.post('/profile', (req, res, next) => {
  var sql = 'SELECT * FROM user WHERE name = (\"' + req.body.uName + '\")'
  var params = []
  db.all(sql, params, (err, dataU) => {
    console.log('we did a query');
    if (err) {
      res.status(400).json({"FOOL OF A TOOK":err.message});
      return
    } else {
        res.render('profile', {dataU});
    }
  });
});

/* GET messages page */
router.get ('/messages', async function(req, res, next) {
  var sql = 'SELECT message FROM messages'
  var params = []
  if(!authenticated){
    res.status(403).json("THE DARK FIRE WILL NOT AVAIL YOU, YOU SHALL NOT PASSsssss!");
  } else {
      await db.all(sql, params, (err, dataM) => {
      console.log('we did a query');
      if (err) {
        res.status(400).json({"FOOL OF A TOOK":err.message});
        return
      }
      if (!dataM) {
        res.status(400).json("A WIZARD IS NEVER LATE, NOR IS HE EARLY. HE ARRIVES PRECISELY WHEN HE MEANS TO");
      } else {
        res.render('messages', {dataM});
      }
   });
  }
 });

/* POST messages page */
router.post("/messages", (req, res, next) => {
  if(!authenticated) {
    res.status(403).json("THE DARK FIRE WILL NOT AVAIL YOU, YOU SHALL NOT PASSsssss!");
  } else {
    db.run(`INSERT INTO messages (name, message, password) VALUES ($1,$2,$3)`, [req.body.uName, req.body.message, req.body.passWD]);
    res.redirect('messages');
  }
});

/* GET logout page */
router.get('/logout', function(req, res, next) {
  req.session.destroy
  authenticated = false;
  res.redirect('/');
});

/* POST a user account */
router.post("/login", (req, res, next) => {
 var sql = 'SELECT name FROM user WHERE name = (\"' + req.body.uName + '\")'
 var sqlP = 'SELECT password FROM user WHERE password = (\"' + req.body.passWD + '\")'
 var params = []
db.get(sql, params, (err, data) => {
     if (err) {
      res.status(400).json({"FOOL OF A TOOK":err.message});
      return;
    }
    if (!data) {
      res.status(400).json("A WIZARD IS NEVER LATE, NOR IS HE EARLY. HE ARRIVES PRECISELY WHEN HE MEANS TO");  
    } else {
      db.get(sqlP, params, (err, dataP) => {
        if (err) {
          res.status(400).json({"A WIZARD IS NEVER LATE, NOR IS HE EARLY. HE ARRIVES PRECISELY WHEN HE MEANS TO":err.message});
          return;
        } 
        if (!dataP) {
          res.status(400).json("A WIZARD IS NEVER LATE, NOR IS HE EARLY. HE ARRIVES PRECISELY WHEN HE MEANS TO");
        } else {
          req.sessionID = data
        //req.query.name = data
          authenticated = true;
          res.redirect('/');
        }
      })
    }
  });
});

/* POST register page */
router.post('/register', async function(req, res, next) {
  await db.all(`INSERT INTO user (name, password, email) VALUES ($1,$2,$3)`, [req.body.uName, req.body.passWD, req.body.eMail]);
  res.redirect('/login')
});

/* GET Admin page */
router.get('/SauronsAdminPage', function(req, res, next) {
  res.render('SauronsAdminPage')
});

/* POST Admin page */
router.post('/SauronsAdminpage', async(req, res, next) => {
  var sql = 'DELETE FROM user WHERE name = (\"' + req.body.uName + '\")'
  var params = []
  await db.run(sql, params, (err, data) => {
    if (err) {
      res.status(400).json({"MY PRECIOUS":err.message});
      return;
    }
    else {
      res.json({message:"Success: Sauron was become now a Hacker of dreadful power, master of SQLite and of Node.JS"})
    }
  });
});

/* POST Admin page 
router.post('/SauronsAdminpage', async(req, res, next) => {
  var sql = 'DELETE FROM messages WHERE id = (\"' + req.body.id + '\")'
  var params = []
  await db.run(sql, params, (err, data) => {
    if (err) {
      res.status(400).json({"MY PRECIOUS":err.message});
      return;
    }
    else {
      res.json({message:"Success: Sauron was become now a Hacker of dreadful power, master of SQLite and of Node.JS"})
    }
  });
}); */

module.exports = router;
