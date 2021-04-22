const router = require('express').Router();
const { Post, User, Vote } = require('../../models');

// get all posts
router.get('/', (req, res) => {
    Post.findAll({
        //identify the columns to retrieve in this query
      attributes: ['id', 'post_url', 'title', 'created_at'],
      order: [['created_at', 'DESC']],
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


router.get('/:id', (req, res) => {
Post.findOne({
    where: {
    id: req.params.id
    },
    attributes: ['id', 'post_url', 'title', 'created_at'],
    include: [
    {
        model: User,
        attributes: ['username']
    }
    ]
})
    .then(dbPostData => {
    if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
    }
    res.json(dbPostData);
    })
    .catch(err => {
    console.log(err);
    res.status(500).json(err);
    });
});

//route to create a post
router.post('/', (req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
      title: req.body.title,
      post_url: req.body.post_url,
      user_id: req.body.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// PUT /api/posts/upvote
router.put('/upvote', (req, res) => {
//using the Vote model to create a vote
Vote.create({
    user_id: req.body.user_id,
    post_id: req.body.post_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => res.json(err));
//then querying on that post to get an updated vote count.
});
  //replace the title of the post
  router.put('/:id', (req, res) => {
    Post.update(
      {
        title: req.body.title
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        //send back data that has been modified and stored in the database
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.delete('/:id', (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  module.exports = router;