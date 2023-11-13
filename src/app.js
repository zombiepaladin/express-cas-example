const express = require('express');
const session = require('express-session');
const auth = require('./endpoints/auth');
const loginRequired = require('./middleware/login-required');

// Create our new express application
const app = new express();
// And export it from this module
module.exports = app;

// If we are behind a proxy server, we need to set trust settings
// (i.e. if we are running in a CodeSpace, we are behind 1 proxy)
// Remove or comment out if we are not behind a proxy.
app.set('trust proxy', 1) // trust first proxy

// Set up our session. 
app.use(session({
  // We want a unique session secret for the application, 
  // ideally stored as an environment variable.
  secret: process.SESSION_SECRET || 'keyboard cat',
  // resave forces the session to be written back to the 
  // session store when no changes have been made
  resave: false,
  // saveUninitialized allows new and unmodified sessions
  // to be saved to the session store.  Since we're using 
  // the username to determine login status, `true` is fine.
  saveUninitialized: true,
  // Cookie-specific settings
  cookie: { 
    // secure requires the client to be using https
    secure: false
  }
}));

// Use CAS-based authentication to log users in
app.use(auth);

// Only logged-in users should see this page. 
app.get('/', loginRequired, (req, res) => {
  res.send(`Welcome ${req.session.username}!  You are authenticated :)`);
})