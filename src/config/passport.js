const passport = require('passport');
const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    //Confirmacion email usuario
    const user = await User.findOne({email})
    if(!user) {
        return done(null, false, {message: 'Not User Found'})
    } else {
        //Validar contraseña
        const match = await user.matchPassword(password)
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, {message: 'Incorrect Password'});
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err,user) => {
        done(err, user);
    });
});