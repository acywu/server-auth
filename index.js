
var port = process.env.PORT || 3032;
var express = require('express');
var passport = require('passport')
  , GoogleStrategy = require('passport-google-oauth').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;

//define passport usage

passport.use(new GoogleStrategy({
  // Demo purpose only
  consumerKey: '108948990882-8b9m6bkrtqi72or4ej10emhlq95n6v2q.apps.googleusercontent.com',
  consumerSecret: 'bF_qPjTaWVkOI9YQInI8Qpcq',
  callbackURL: 'http://localhost:'+port+'/google-token' //this will need to be dealt with
  }, function(accessToken, refreshToken, profile, cb) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }));

passport.use(new FacebookStrategy({
    clientID: '[FBID]',
    clientSecret: '[FBSECRET]',
    callbackURL: 'https://localhost :'+port+'/facebook-token'
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

//define REST proxy options based on logged in user
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(null); }
  res.redirect('/error')
}

//configure, route and start express
var app = express.createServer();
app.configure(function() {
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'thissecretrocks' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

app.get('/',
  function(req, res) {
    res.send('Hello World.');
  });

app.get('/google-login', passport.authenticate('google'));

app.get('/google-token', passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res){
    res.send('Logged In.');
  });

  app.get('/facebook-login', passport.authenticate('facebook'));

app.get('/facebook-token', passport.authenticate('facebook', { failureRedirect: '/error' }),
  function(req, res){
    res.send('Logged In.');
  });


app.get('/error', function(req, res){
  res.send('An error has occured.');
  });

app.get('/*',function(req, res) {
  res.render(req.url.substring(1,req.url.length)); //really?
})

app.listen(port, function() {
  console.log("Listening on " + port);
});
