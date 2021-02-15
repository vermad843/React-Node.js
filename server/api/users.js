const express = require('express');
const db = require('../db/connection');
const users = db.get('users');
const router = express.Router();


router.get('/', async(req, res, next) => {
   try {
    const result = await users.find({}, '-password');
    res.json(result);
   } catch (error) {
    next(error); 
   }
});


router.patch('/:id', (req, res ,next) => {
   const { id : _id } = req.params;
   res.json({ _id});
});

module.exports = router;