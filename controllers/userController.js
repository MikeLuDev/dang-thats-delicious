const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

// Render login form
exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

// Render register form
exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

// Validate user registration
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name').notEmpty();
  req.checkBody('email', 'Invalid email addres').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', 'Password can not be blank').notEmpty();
  req.checkBody('password-confirm', 'Confirmed password cannot be blank').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your passwords do not match');
  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return;
  }
  next();
};

// Save new user to db
exports.register = async (req, res, next) => {
  const user = await new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};
