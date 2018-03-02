const User = require('../models/user'); 
const Memento = require('../models/memento'); 
const jwt = require('jsonwebtoken'); 
const config = require('../config/database'); 

module.exports = (router) => {


  router.post('/newMemento', (req, res) => {
    if (!req.body.title) {
      res.json({ success: false, message: 'Memento title is required.' }); 
    } else {
      if (!req.body.body) {
        res.json({ success: false, message: 'Memento body is required.' });
      } else {
        if (!req.body.createdBy) {
          res.json({ success: false, message: 'Memento creator is required.' }); 
        } else {
          const memento = new Memento({
            title: req.body.title,
            body: req.body.body, 
            img: req.body.img,
            createdBy: req.body.createdBy 
          });
          memento.save((err) => {
            if (err) {
              if (err.errors) {
                if (err.errors.title) {
                  res.json({ success: false, message: err.errors.title.message }); 
                } else {
                  if (err.errors.body) {
                    res.json({ success: false, message: err.errors.body.message }); 
                  } else {
                    res.json({ success: false, message: err }); 
                  }
                }
              } else {
                res.json({ success: false, message: err }); 
              }
            } else {
              res.json({ success: true, message: 'Memento saved!' }); 
            }
          });
        }
      }
    }
  });

  router.get('/allMementos', (req, res) => {
    Memento.find({}, (err, mementos) => {
      if (err) {
        res.json({ success: false, message: err });
      } else {
        if (!mementos) {
          res.json({ success: false, message: 'No mementos found.' }); 
        } else {
          res.json({ success: true, mementos: mementos }); 
        }
      }
    }).sort({ '_id': -1 });
});

  return router;
};
