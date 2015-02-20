/*jslint vars:true, node:true */
"use strict";

module.exports = function(routes, passport, oauth2server) {

  /**
   * Shows the login page or redirects if already logged in.
   */
  var login = function(req, res, next) {
    var next_url = req.query.next || routes.app;

    if (req.isAuthenticated()) {
      console.log('\n\nIS LOGGED IN\n\n');
      res.redirect(next_url);
    }

    // render the page and pass in any flash data if it exists
    res.render('user/login', {
      title: 'Login',
      next_url: next_url,
      message: req.flash('loginMessage'),
      csrf_token: req.csrfToken()
    });
  };

  /**
   * Performs login and redirects to next url.
   */
  var logon = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect(routes.root + routes.session.login); }

      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect(req.body.next ? decodeURIComponent(req.body.next) : routes.app);
      });
    })(req, res, next);
  };

  /**
   * Performs logout and redirects to next url.
   */
  var logout = function(req, res, next) {
    var next_url = req.query.next || routes.root + routes.session.login;

    req.logout();
    res.redirect(next_url);
  };

  return {
    login: login,
    logon: logon,
    logout: logout
  };

};
