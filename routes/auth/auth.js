const express = require("express");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const matchdomain = process.env.MATCHDOMAIN;
function extractProfile(profile) {
    let imageUrl = '';
    if (profile.photos && profile.photos.length) {
        imageUrl = profile.photos[0].value;
    }
    return {
        id: profile.id,
        displayName: profile.displayName,
        image: imageUrl,
    };
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLECLIENTID,
    clientSecret: process.env.GOOGLECLIENTSECRET,
    callbackURL: process.env.GOOGLECALLBACKURL
}, function (accessToken, refreshToken, profile, done) {
    if (profile) {
      //if(profile.emails[0].value.match(`/${matchdomain}/`)){
        return done(null, profile);
      //}else{
       // return done(null, false);
      //}
    }
    else {
        return done(null, false);
    }
}));

const router = express.Router();

router.get('/login',
    passport.authenticate('google', { scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
  ], session: false, }),
);

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login'}), (req, res) => {
    res.send(req.user.emails[0].value);
});
module.exports = router;