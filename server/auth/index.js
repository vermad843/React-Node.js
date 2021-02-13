const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db/connection');
const users = db.get('users');
users.createIndex('username', {unique : true});

const router = express.Router(); 


router.get('/', (req,res) => {
   res.json({
      message : 'LOCKKEY'
   });
});


router.get('/signup', (req, res, next) => {
     users
     .find()
     .then(user => {
       res.json(user);
     }).catch(next);
 });


router.post('/signup' ,(req, res, next) => {
   const result = req.body;
   if(result) {
      users.findOne({
         username : req.body.username
      }).then(username => {
         if(username) {
            const err = new Error('this username already exist');
            res.status(409);
            next(err);
         }else {
            bcrypt.hash(req.body.password, 12).then(hashedPassword => {
               const newUser = {
                  username : req.body.username,
                  password : hashedPassword
                 };
                 users.insert(newUser).then(insertedUser => {
                  res.json(insertedUser);
               });                  
            });
         }
      });
   }else {
      res.status(422);
      next(result.error);
   }
});

function respondError422(res, next){
   res.status(422);
   const error = new Error ('unable to login');
   next(error);
}

router.post('/login', (req,res, next) => {
   const result = req.body;
   if(result) {
      users.findOne({
         username : req.body.username
      }).then(user => {
         if(user) {
            bcrypt
                .compare(req.body.password,user.password)
                .then((result) => {
                   if(result) {
                     const payload = {
                        _id : user._id,
                        username : user.username
                     };
                     jwt.sign(payload, process.env.TOKEN_SECRET, {
                        expiresIn : '7d'
                     }, (err, token) => {
                        if(err) {
                           respondError422(res, next);
                        }else {
                           res.json({
                              token
                           })
                        }
                     });
                   }else {
                      respondError422(res,next);                  
                   }
            });
         }else {
             respondError422(res,next);         
         }
      })
   }else {
     respondError422(res,next);
   }
});


module.exports = router;