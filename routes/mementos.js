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

router.get('/singleMemento/:id', (req, res) => {
  if (!req.params.id) {
    res.json({ success: false, message: 'No memento ID was provided.' }); 
  } else {
    Memento.findOne({ _id: req.params.id }, (err, memento) => {
      if (err) {
        res.json({ success: false, message: 'Not a valid memento id' }); 
      } else {
        if (!memento) {
          res.json({ success: false, message: 'Memento not found.' }); 
        } else {
          User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err }); 
            } else {
              if (!user) {
                res.json({ success: false, message: 'Unable to authenticate user' }); 
              } else {
                if (user.username !== memento.createdBy) {
                  res.json({ success: false, message: 'You are not authorized to edit this memento.' }); 
                } else {
                  res.json({ success: true, memento: memento }); 
                }
              }
            }
          });
        }
      }
    });
  }
});

router.put('/updateMemento', (req, res) => {
  if (!req.body._id) {
    res.json({ success: false, message: 'No memento id provided' }); 
  } else {
    Memento.findOne({ _id: req.body._id }, (err, memento) => {
      if (err) {
        res.json({ success: false, message: 'Not a valid memento id' }); 
      } else {
        if (!memento) {
          res.json({ success: false, message: 'Memento id was not found.' }); 
        } else {
          User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err }); 
            } else {
              if (!user) {
                res.json({ success: false, message: 'Unable to authenticate user.' }); 
              } else {
                if (user.username !== memento.createdBy) {
                  res.json({ success: false, message: 'You are not authorized to edit this memento post.' }); 
                } else {
                  memento.title = req.body.title; 
                  memento.body = req.body.body; 
                  memento.save((err) => {
                    if (err) {
                      if (err.errors) {
                        res.json({ success: false, message: 'Please ensure form is filled out properly' });
                      } else {
                        res.json({ success: false, message: err });
                      }
                    } else {
                      res.json({ success: true, message: 'Memento Updated!' }); 
                    }
                  });
                }
              }
            }
          });
        }
      }
    });
  }
});

  return router;
};
