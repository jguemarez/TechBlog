const router = require('express').Router();
const { BlogPost, Blogger, Comment } = require('../models');

//Render the homepage of the CMS blog. No need to log-in. In that case, everything is read-only.
router.get('/', async (req, res) => {
  try {
    const blogPostData = await BlogPost.findAll({
      include: [
        {
          model: Blogger,
          attributes: ['username'],
        }, { model: Comment}
      ],
    });
    const blogPosts = blogPostData.map((blogPost) => blogPost.get({ plain: true }));
    blogPosts.forEach((post) => post.loggedIn = req.session.loggedIn);
    res.render('homepage', {
      blogPosts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

  //Get one post together with all of the comments on it
  router.get('/posts/:id', async (req, res) => {
    try {
      const postData = await BlogPost.findByPk(req.params.id, {
        include: [Comment]
      });
  
      if (!postData) res.status(404).json({ message: "No post found with that id." });
  
      const post = postData.get({ plain: true });
      const authorData = await Blogger.findByPk(postData.blogger_id);
      post.author = authorData.username;
  
      for(const comment of post.comments){
        const authorData = await Blogger.findByPk(comment.blogger_id);
        const author = authorData.username;
        comment.author = author;
      }
      res.render('comments', { ...post, loggedIn: req.session.loggedIn });
    } catch (err) {
      res.status(500).json(err); 1
    }
  });

module.exports = router;