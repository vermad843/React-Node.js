const express = require('express');

const db = require('../db/connection');
const notes = db.get('notes');

const router = express.Router();

router.get('/', (req,res) => {
   notes.find({
      user_id : req.user._id
   }).then(notes => {
      res.json(notes);
   })
});

router.post('/', (req,res) => {
   const result = req.body;
   if(result) {
      const note = {
         ...req.body,
         user_id : req.user._id
      };
      notes.insert(note).then(note => {
        res.json(note);
      });
   }else {
      const error = new Error(result);
      res.status(422);
      next(error);
   }
});


module.exports = router;