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

    function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    router.get('/allMementos', (req, res) => {
        if (req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            Memento.find({ "title": regex }, (err, mementos) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    res.json({ success: true, mementos: mementos });
                }
            })
        } else {
            Memento.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "createdBy",
                        foreignField: "username",
                        as: "user"
                    }
                },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$user", 0] }, "$$ROOT"] } }
                },
                // { $project: { fromItems: 0 } }
            ], (err, mementos) => {
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
        }
    });

    // router.get('/allMementos', (req, res) => {
    //     if (req.query.search) {
    //         Memento.find({ $text: { $search: req.query.search } }, (err, mementos) => {
    //             if (err) {
    //                 res.json({ success: false, message: err });
    //             } else {
    //                 res.json({ success: true, mementos: mementos });
    //             }
    //         })
    //     } else {
    //         Memento.find({}, (err, mementos) => {
    //             if (err) {
    //                 res.json({ success: false, message: err });
    //             } else {
    //                 if (!mementos) {
    //                     res.json({ success: false, message: 'No mementos found.' });
    //                 } else {
    //                     res.json({ success: true, mementos: mementos });
    //                 }
    //             }
    //         }).sort({ '_id': -1 });
    //     }
    // });

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

    router.delete('/deleteMemento/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'No id provided' });
        } else {
            Memento.findOne({ _id: req.params.id }, (err, memento) => {
                if (err) {
                    res.json({ success: false, message: 'Invalid id' });
                } else {
                    if (!memento) {
                        res.json({ success: false, messasge: 'Memento was not found' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate user.' });
                                } else {
                                    if (user.username !== memento.createdBy) {
                                        res.json({ success: false, message: 'You are not authorized to delete this memento post' });
                                    } else {
                                        memento.remove((err) => {
                                            if (err) {
                                                res.json({ success: false, message: err });
                                            } else {
                                                res.json({ success: true, message: 'Memento deleted!' });
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

    router.put('/likeMemento', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: 'No id was provided.' });
        } else {
            Memento.findOne({ _id: req.body.id }, (err, memento) => {
                if (err) {
                    res.json({ success: false, message: 'Invalid memento id' });
                } else {
                    if (!memento) {
                        res.json({ success: false, message: 'That memento was not found.' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: 'Something went wrong.' });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Could not authenticate user.' });
                                } else {
                                    if (user.username === memento.createdBy) {
                                        res.json({ success: false, messagse: 'Cannot like your own post.' });
                                    } else {
                                        if (memento.likedBy.includes(user.username)) {
                                            res.json({ success: false, message: 'You already liked this post.' });
                                        } else {
                                            if (memento.dislikedBy.includes(user.username)) {
                                                memento.dislikes--;
                                                const arrayIndex = memento.dislikedBy.indexOf(user.username);
                                                memento.dislikedBy.splice(arrayIndex, 1);
                                                memento.likes++;
                                                memento.likedBy.push(user.username);
                                                memento.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: 'Something went wrong.' });
                                                    } else {
                                                        res.json({ success: true, message: 'Memento liked!' });
                                                    }
                                                });
                                            } else {
                                                memento.likes++;
                                                memento.likedBy.push(user.username);
                                                memento.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: 'Something went wrong.' });
                                                    } else {
                                                        res.json({ success: true, message: 'Memento liked!' });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });


    router.put('/dislikeMemento', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: 'No id was provided.' });
        } else {
            Memento.findOne({ _id: req.body.id }, (err, memento) => {
                if (err) {
                    res.json({ success: false, message: 'Invalid memento id' });
                } else {
                    if (!memento) {
                        res.json({ success: false, message: 'That memento was not found.' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: 'Something went wrong.' });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Could not authenticate user.' });
                                } else {
                                    if (user.username === memento.createdBy) {
                                        res.json({ success: false, messagse: 'Cannot dislike your own post.' });
                                    } else {
                                        if (memento.dislikedBy.includes(user.username)) {
                                            res.json({ success: false, message: 'You already disliked this post.' });
                                        } else {
                                            if (memento.likedBy.includes(user.username)) {
                                                memento.likes--;
                                                const arrayIndex = memento.likedBy.indexOf(user.username);
                                                memento.likedBy.splice(arrayIndex, 1);
                                                memento.dislikes++;
                                                memento.dislikedBy.push(user.username);
                                                memento.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: 'Something went wrong.' });
                                                    } else {
                                                        res.json({ success: true, message: 'Memento disliked!' });
                                                    }
                                                });
                                            } else {
                                                memento.dislikes++;
                                                memento.dislikedBy.push(user.username);
                                                memento.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: 'Something went wrong.' });
                                                    } else {
                                                        res.json({ success: true, message: 'Memento disliked!' });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    router.post('/comment', (req, res) => {
        if (!req.body.comment) {
            res.json({ success: false, message: 'No comment provided' });
        } else {
            if (!req.body.id) {
                res.json({ success: false, message: 'No id was provided' });
            } else {
                Memento.findOne({ _id: req.body.id }, (err, memento) => {
                    if (err) {
                        res.json({ success: false, message: 'Invalid memento id' });
                    } else {
                        if (!memento) {
                            res.json({ success: false, message: 'Memento not found.' });
                        } else {
                            User.findOne({ _id: req.decoded.userId }, (err, user) => {
                                if (err) {
                                    res.json({ success: false, message: 'Something went wrong' });
                                } else {
                                    if (!user) {
                                        res.json({ success: false, message: 'User not found.' });
                                    } else {
                                        memento.comments.push({
                                            comment: req.body.comment,
                                            commentator: user.username
                                        });
                                        memento.save((err) => {
                                            if (err) {
                                                res.json({ success: false, message: 'Something went wrong.' });
                                            } else {
                                                res.json({ success: true, message: 'Comment saved' });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });



    return router;
};
