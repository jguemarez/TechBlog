const router = require('express').Router();
// Use "withAuth" middleware to prevent unauthorized access to route.
const withAuth = require('../../utils/auth');
//Import the models
const { Blogger, BlogPost, Comment } = require('../../models');
//Import the Operator object from Sequelize
const { Op } = require('sequelize');

//Render the dashboard of the logged-in user/blogger. You get all of your own posts.
router.get('/', withAuth, async (req, res) => {
    try {
      const bloggerData = await Blogger.findByPk(req.session.userId, {
        attributes: { exclude: ['password'] },
        include: [{ model: BlogPost }],
      });
  
      const blogger = bloggerData.get({ plain: true });
  
      blogger.blog_posts.forEach((post) => {
        post.isOwnPost = true
        post.author = blogger.username});
      
      return res.render('dashboard', {
        ...blogger,
        loggedIn: req.session.loggedIn
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

//Render the view with the form to add a comment a given post
router.get('/posts/:id/comment', withAuth, async (req, res) => {
  try {
    const postData = await BlogPost.findByPk(req.params.id);
    const post = postData.get({ plain: true });
    const authorData = await Blogger.findByPk(post.blogger_id);
    const author_name = authorData.username;
    const author_id = authorData.id;

    res.render('comment-submit', { ...post, author_name, author_id, loggedIn: req.session.loggedIn });
  } catch (err) {
    res.status(500).json(err);
  }
});
//Add a comment to a particular post.
router.post('/posts/:id/comment', withAuth, async (req, res) => {
  try {

    const newComment = await Comment.create({
      ...req.body,
      blogger_id: req.session.userId
    });
    res.status(201).json(newComment);

  } catch (err) {
    res.status(400).json(err);
  }
});

//Get all other bloggers
router.get('/bloggers', withAuth, async (req, res) => {
    try {
      const allBloggersData = await Blogger.findAll({
        where:{
          id: {
            [Op.ne]: req.session.userId
          }
        },
        attributes:{
          exclude: ['password']
        }
      });
      const allBloggers = allBloggersData.map((blogger) => blogger.get({ plain: true }));
      const userNameData = await Blogger.findByPk(req.session.userId);
      const { username } = userNameData.get({ plain: true });
  
      res.render('all-bloggers', {
        allBloggers,
        username,
        loggedIn: req.session.loggedIn
      }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  })
  //Get all posts by a selected blogger with the option to add a comment or view all of its comments.
  router.get('/bloggers/:id', withAuth, async (req, res) => {
    try {
      const allPostsData = await BlogPost.findAll({
        where: {
          blogger_id: req.params.id
        }
      });
      const bloggerNameData = await Blogger.findByPk(parseInt(req.params.id), {
        attributes: ['username']
      });
  
      const { username } = bloggerNameData.get({ plain: true });
      const allPosts = allPostsData.map((post) =>post.get({ plain: true }));

      allPosts.forEach((post) => post.author = username);

      res.render('posts-by-blogger', {
        username,
        allPosts,
        loggedIn: req.session.loggedIn
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  })

  //Get all of your comments.
router.get('/comments', withAuth, async (req, res) => {
    try {
      const commentsData = await Comment.findAll({
        where: {
          blogger_id: req.session.userId
        }
      });
      if (!commentsData.length) res.status(404).json({ message: 'You still have not commented on any post.' });
  
      const userNameData = await Blogger.findByPk(req.session.userId, {
        attributes: ['username']
      });
  
      const comments = commentsData.map((comment) => comment.get({ plain: true }));
      const { username } = userNameData.get({ plain: true });
  
      for (const comment of comments) {
        comment.author= username;
        
        const post = await BlogPost.findByPk(comment.blog_post_id, {
          include: [{
            model: Blogger,
            attributes: ['username']
          }]
        });
        const commentedPost = post.get({ plain: true });
        comment.post_title = commentedPost.title
        comment.post_author = commentedPost.blogger.username;
      };
  
      res.render('comments-by-current-blogger', { comments, username, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  //Get the view to edit comments
  router.get('/comments/:id/edit', withAuth, async (req, res) => {
    try{
     
      const commentData = await Comment.findByPk(req.params.id);
      const comment = commentData.get({plain:true});
      
      return res.render('edit-comment', { ...comment, loggedIn: req.session.loggedIn});

    } catch(err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  //Update one of your comments
  router.put('/comments/:id/edit', withAuth, async (req, res) => {
    try {
      await Comment.update(req.body, {
        where:{
          id: req.params.id
        }
      });

      res.status(200).json({ message: "Comment was successfully updated."});
    } catch(err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  //Delete one of your comments
  router.delete('/comments/:id/edit', withAuth, async (req, res) => {
    try{
      await Comment.destroy({
        where: {
          id:req.params.id
        }
      });

      res.status(200).json({ message: "Comment successfully deleted."});
    } catch(err) {
      console.error(err);
      res.status(500).json(err);
    }
  })
  //Render the view to update/modify or delete one of your own posts
router.get('/:id/edit', withAuth, async (req, res) => {
    try {
      const postData = await BlogPost.findByPk(req.params.id);
      const post = postData.get({ plain: true });
      res.render('edit-post', { ...post, loggedIn: req.session.loggedIn });
  
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //Update (modify) one of your own posts
  router.put('/:id/edit', withAuth,  async (req, res) => {
    try {
      await BlogPost.update(req.body, {
        where: {
          id: req.params.id
        }
      });
      res.status(200).json({ message: 'Post updated successfully.' });
    } catch (err) {
      res.status(400).json(err);
    }
  });
  //Delete one of your own posts
  router.delete('/:id/edit', withAuth,  async (req, res) => {
    try {
      await BlogPost.destroy({
        where: {
          id: req.params.id
        }
      });
      res.status(200).json({ message: 'Post successfully destroyed.' })
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //Render the view to add a new post.
  router.get('/post', withAuth, async (req, res) => {
    try {
  
      const userNameData = await Blogger.findByPk(req.session.userId, {
        attributes: ['username']
      });
      const { username } = userNameData.get({ plain: true });
  
      res.render('post-submit', { username, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  })
  //Add a new post.
  router.post('/post', withAuth, async (req, res) => {
    try {
      const { title, content } = req.body;
      const blogger_id = req.session.userId;
  
      await BlogPost.create({ title, content, blogger_id });
  
      res.status(201).json({ message: 'New post added to the db.' });
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  });
  //Export the router
  module.exports = router;