const usersCtrl = {};
const passport = require('passport');
const User = require('../models/User');
usersCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};
usersCtrl.signup = async (req,res) => {
    const errors = []
    const {name, email, password, confirm_password} = req.body;
    if(password != confirm_password) {
        errors.push({text: 'Password do not match'})
    }
    if(password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'})
    }
    if (errors.length > 0) {
        return res.render('users/signup', {
            errors,
            name,
            email
        })
    } else {
        const emailUser = await User.findOne({email: email});
        if (emailUser) {
            req.flash('error_msg', 'The email is alredy in use.');
            res.redirect('/users/signup')
        } else {
            const newUser = new User({name, email, password})
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You are registered')
            res.redirect('/users/signup');

        }
    }

};
usersCtrl.renderSignInForm = (req, res) => {
    res.render('users/signin')
};
usersCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/users/signin',
    successRedirect: '/clients',
    failureFlash: true
});
usersCtrl.logout = (req, res) => {
    req.logout( (err) => {
        if (err) { return next(err); }
        req.flash( "success_msg" , "Session Was Closed" );
        res.redirect( "/users/signin" );
    });
}

module.exports = usersCtrl;