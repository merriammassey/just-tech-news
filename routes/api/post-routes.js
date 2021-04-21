const router = require('express').Router();
const { Post, User } = require('../../models');

// get all posts
router.get('/', (req, res) => {
    Post.findAll({
        //identify the columns to retrieve in this query
      attributes: ['id', 'post_url', 'title', 'created_at'],
      //JOIN user table
      include: [
        {
            //definte this object by referencing mode and attributes
          model: User,
          attributes: ['username']
        }
      ]
    })
    //capture response in a Promise
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  module.exports = router;