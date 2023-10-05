const router = require('express').Router();
const { Blogger } = require('../models');
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

//Wildcard route for non-defined endpoints
router.get('*', async (req, res) => {
    if (req.session.userId) {
        const bloggerData = await Blogger.findByPk(req.session.userId);
        const username = bloggerData.username;
        res.render('not-found', { username, loggedIn: req.session.loggedIn });
    }
    res.render('not-found');
});


module.exports = router;