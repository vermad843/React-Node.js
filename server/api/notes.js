const express = require('express');

const db = require('../db/connection');
const notes = db.get('notes');

const router = express.Router();

router.get('/', (req,res) => {
   res.json([]);
});

router.post('/', (req,res) => {
   const result = req.body;
   if(result) {
      const note = {
         ...req.body,
         user_id : req.user._id
      };
      notes.insert(req.body).then(note => {
        res.json(note);
      });
   }else {
      const error = new Error(result);
      res.status(422);
      next(error);
   }
});


module.exports = router;