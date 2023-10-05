const router = require('express').Router();
const { Blogger, BlogPost, Comment} = require('../../models');

//Render the login form if loggedIn = false; else redirect to the dashboard
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login');
});
//Verify if the user/blogger is already registered in the db and use bcript.compareSync to check whether the password matches the encrypted one within the db. If the info provided is correct, let him in.
router.post('/login', async (req, res) => {
    try {
        const bloggerData = await Blogger.findOne({
            where: {
                username: req.body.username,
            },
            include: [{ model: BlogPost }]
        });

        if (!bloggerData) {
            res
                .status(400)
                .json({ message: 'Incorrect username or password. Please try again!' });
            return;
        }

        const validPassword = bloggerData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect username or password. Please try again!' });
            return;
        }

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.userId = bloggerData.id
            //Return successful response status to the client-side (where the fetch request originated)
            return res.status(200).json({
                message: "You are now logged in.",
                cookie: req.session.cookie
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
//Render the view with the signup form
router.get('/signup', async (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
        return;
    }
    res.render('signup')
});
//Add a user (create a record) to the db and let the new user log-in
router.post('/signup', async (req, res) => {
    try {
        const bloggerExists = await Blogger.findOne({
            where: {
                username: req.body.username
            }
        });

        if (bloggerExists) {
            return res.status(400).json({ message: "Username is already taken." });
        }
        const newUserData = await Blogger.create(req.body,
            { individualHooks: true }
        );

        const newUser = newUserData.get({ plain: true });

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.userId = newUser.id
            console.log(req.session.cookie);
            return res.status(200).json({ message: "You are now logged in." });
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

//Let a user log-out by ending the session after pressing the logout link in the nav bar. Redirect the user to the homepage.
router.get('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
            } else {
                res.status(200).json({message: "Succesfully ended the session. Goodbye!"});
            }
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;