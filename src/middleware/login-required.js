
const loginRequired = (req, res, next) => {
  // A logged-in user should have a username set in the session
  if(req.session && req.session.username) next();
  // If not, redirect them to the login page
  else res.redirect('/login');
}

module.exports = loginRequired;