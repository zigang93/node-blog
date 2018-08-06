const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const routes = require('./routes');
const pkg = require('./package');

const app = express();

// setup views folder
app.set('views', path.join(__dirname, 'views'));
// setup template for ejs
app.set('view engine', 'ejs');

// use public folder
app.use(express.static(path.join(__dirname, 'public')));
// session
app.use(session({
  name: config.session.key, // save session id in cookie
  secret: config.session.secret, // use secret to calculate hash and put in cookie ，then generate signedCookie
  resave: true, // force update session
  saveUninitialized: false, // set false，force create a session，even user not login yet
  cookie: {
    maxAge: config.session.maxAge// cookie session id auto delete after expired
  },
  store: new MongoStore({// save session in mongodb
    url: config.mongodb // mongodb address
  })
}));
// flash middleware for notification
app.use(flash());

// setup app locals variable
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
};

// setup respond variable
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

// routes
routes(app);

// listen port
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`);
});
